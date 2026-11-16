// github.ts - Fetches public GitHub data and reduces it to one small snapshot.

export interface RecentRepo {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  pushedAt: string;
  createdAt: string;
}

export interface GithubSnapshot {
  user: string;
  repos: number;
  followers: number;
  following: number;
  stars: number;
  recent: RecentRepo[];
  languages: { name: string; count: number }[];
  days: number[];
  fetchedAt: string;
}

interface ApiUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface ApiRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  created_at: string;
  fork: boolean;
}

interface ApiEvent {
  created_at: string;
}

const API = 'https://api.github.com';
const DAY = 86_400_000;
export const PULSE_DAYS = 30;

// Three public endpoints; the events call may fail without sinking the rest.
export async function fetchGithub(user: string, token?: string): Promise<GithubSnapshot> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const get = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API}${path}`, { headers });
    if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${path}`);
    return (await response.json()) as T;
  };

  const [profile, repos, events] = await Promise.all([
    get<ApiUser>(`/users/${user}`),
    get<ApiRepo[]>(`/users/${user}/repos?per_page=100&sort=pushed`),
    get<ApiEvent[]>(`/users/${user}/events/public?per_page=100`).catch(() => [] as ApiEvent[]),
  ]);

  const own = repos.filter((repo) => !repo.fork);
  const now = Date.now();

  // Count repositories by primary language, most used first.
  const tally = new Map<string, number>();
  for (const repo of own) {
    if (repo.language) tally.set(repo.language, (tally.get(repo.language) ?? 0) + 1);
  }
  const languages = [...tally].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // One bucket per day, oldest first, today last.
  const days = new Array<number>(PULSE_DAYS).fill(0);
  for (const event of events) {
    const index = PULSE_DAYS - 1 - Math.floor((now - Date.parse(event.created_at)) / DAY);
    if (index >= 0 && index < PULSE_DAYS) days[index] = (days[index] ?? 0) + 1;
  }

  return {
    user,
    repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    stars: own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    recent: own
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description ?? '',
        language: repo.language ?? '',
        stars: repo.stargazers_count,
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
      })),
    languages,
    days,
    fetchedAt: new Date(now).toISOString(),
  };
}

// Build-side helper: one request per build or dev session, null when GitHub is unreachable.
let cached: Promise<GithubSnapshot | null> | undefined;
export function buildSnapshot(user: string, token?: string): Promise<GithubSnapshot | null> {
  cached ??= fetchGithub(user, token).catch(() => null);
  return cached;
}
