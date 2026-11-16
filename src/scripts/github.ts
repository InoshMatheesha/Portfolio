// github.ts - Draws the GitHub panel from the build snapshot, then refreshes it live.
import { fetchGithub, PULSE_DAYS, type GithubSnapshot, type RecentRepo } from '../lib/github';
import type { Env } from './main';

const TTL = 30 * 60 * 1000; // reuse a live answer for half an hour
const NEW_FOR = 30 * 86_400_000; // a repo counts as new for 30 days
const SVG = 'http://www.w3.org/2000/svg';

type Source = 'snapshot' | 'cache' | 'live';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const svg = (tag: string, attrs: Record<string, string | number>): SVGElement => {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
};

// "3 days ago" style text from a timestamp.
const ago = (iso: string): string => {
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const minutes = Math.round((Date.parse(iso) - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return format.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return format.format(hours, 'hour');
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return format.format(days, 'day');
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return format.format(months, 'month');
  return format.format(Math.round(months / 12), 'year');
};

export function initGithub(env: Env): void {
  const root = document.querySelector<HTMLElement>('[data-github]');
  const user = root?.dataset.github;
  if (!root || !user) return;

  const find = <T extends Element = HTMLElement>(name: string): T | null => root.querySelector<T>(`[data-gh-${name}]`);
  const chain = JSON.parse(root.dataset.chain ?? '{}') as Record<string, string>;
  const cacheKey = `gh:${user}`;

  // Count from the number on screen to the new one.
  const count = (key: string, target: number): void => {
    const node = root.querySelector<HTMLElement>(`[data-gh-count="${key}"]`);
    if (!node) return;
    const from = Number(node.textContent) || 0;
    if (from === target || env.reducedMotion) {
      node.textContent = String(target);
      return;
    }
    const started = performance.now();
    const step = (time: number): void => {
      const progress = Math.min((time - started) / 900, 1);
      const eased = 1 - (1 - progress) ** 3;
      node.textContent = String(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const repoRow = (repo: RecentRepo): HTMLLIElement => {
    const row = el('li', 'gh-repo');
    const name = el('span', 'gh-repo__name');
    const link = el('a', '', repo.name);
    link.href = repo.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    name.append(link);
    if (Date.now() - Date.parse(repo.createdAt) < NEW_FOR) name.append(el('span', 'gh-repo__new', 'New'));
    // Repos that already have a card link straight to it.
    const card = chain[repo.url.toLowerCase()];
    if (card) {
      const jump = el('a', 'gh-repo__card', 'On the chain');
      jump.href = `#project-${card}`;
      name.append(jump);
    }
    const when = el('time', 'gh-repo__when', ago(repo.pushedAt));
    when.dateTime = repo.pushedAt;
    row.append(name, when);
    if (repo.description) row.append(el('span', 'gh-repo__desc', repo.description));
    const meta = el('span', 'gh-repo__meta');
    if (repo.language) meta.append(el('span', '', repo.language));
    meta.append(el('span', '', `${repo.stars} ${repo.stars === 1 ? 'star' : 'stars'}`));
    row.append(meta);
    return row;
  };

  // Top five languages get a colour each; the rest share one.
  const drawLanguages = (data: GithubSnapshot): void => {
    const host = find('langs');
    if (!host) return;
    const top = data.languages.slice(0, 5);
    const rest = data.languages.slice(5).reduce((sum, item) => sum + item.count, 0);
    const parts = rest ? [...top, { name: 'Other', count: rest }] : top;
    const total = parts.reduce((sum, item) => sum + item.count, 0);
    if (!total) return host.replaceChildren();

    const bar = svg('svg', { class: 'gh-langbar', viewBox: '0 0 100 6', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    const list = el('ul', 'gh-langlist');
    let offset = 0;
    parts.forEach((part, index) => {
      const width = (part.count / total) * 100;
      bar.append(svg('rect', { class: `gh-lang--${index}`, x: offset.toFixed(2), y: 0, width: Math.max(width - 0.6, 0.4).toFixed(2), height: 6 }));
      offset += width;
      const item = el('li');
      item.append(el('i', `gh-lang--${index}`), part.name, el('span', '', String(part.count)));
      list.append(item);
    });
    host.replaceChildren(bar, list);
  };

  // One bar per day, today on the right.
  const drawDays = (data: GithubSnapshot): void => {
    const host = find('days');
    const label = find('events');
    if (!host) return;
    const peak = Math.max(...data.days, 1);
    const total = data.days.reduce((sum, value) => sum + value, 0);
    const chart = svg('svg', { class: 'gh-days', viewBox: `0 0 ${PULSE_DAYS * 10 - 3} 40`, preserveAspectRatio: 'none', role: 'img' });
    chart.setAttribute('aria-label', `${total} public events in the last ${PULSE_DAYS} days`);
    const end = Date.parse(data.fetchedAt);
    data.days.forEach((value, index) => {
      const height = value ? 6 + (value / peak) * 34 : 3;
      const bar = svg('rect', { x: index * 10, y: 40 - height, width: 7, height, rx: 1.5 });
      if (!value) bar.setAttribute('class', 'is-quiet');
      const day = new Date(end - (PULSE_DAYS - 1 - index) * 86_400_000);
      const title = document.createElementNS(SVG, 'title');
      title.textContent = `${day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: ${value} ${value === 1 ? 'event' : 'events'}`;
      bar.append(title);
      chart.append(bar);
    });
    const axis = el('p', 'gh-axis');
    axis.append(el('span', '', `${PULSE_DAYS} days ago`), el('span', '', 'Today'));
    host.replaceChildren(chart, axis);
    if (label) label.textContent = `/ ${total} ${total === 1 ? 'event' : 'events'}`;
  };

  const render = (data: GithubSnapshot, source: Source): void => {
    count('repos', data.repos);
    count('stars', data.stars);
    count('followers', data.followers);
    count('following', data.following);
    find('recent')?.replaceChildren(...data.recent.map(repoRow));
    const empty = find('empty');
    if (empty) empty.hidden = data.recent.length > 0;
    drawLanguages(data);
    drawDays(data);

    const status = find('status');
    if (status) {
      status.textContent =
        source === 'live'
          ? 'Live from GitHub, just now'
          : source === 'cache'
            ? `Live from GitHub, ${ago(data.fetchedAt)}`
            : `Snapshot from ${new Date(data.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    find('dot')?.classList.toggle('is-live', source !== 'snapshot');
  };

  // 1. The snapshot baked in at build time.
  let shown = false;
  try {
    const baked = JSON.parse(find('snapshot')?.textContent ?? 'null') as GithubSnapshot | null;
    if (baked) {
      render(baked, 'snapshot');
      shown = true;
    }
  } catch {
    // A broken snapshot just means the live call does all the work.
  }

  // 2. A recent live answer kept in this browser.
  try {
    const stored = JSON.parse(localStorage.getItem(cacheKey) ?? 'null') as GithubSnapshot | null;
    if (stored && Date.now() - Date.parse(stored.fetchedAt) < TTL) {
      render(stored, 'cache');
      return;
    }
  } catch {
    // Storage can be blocked; carry on to the network.
  }

  // 3. The API itself.
  fetchGithub(user)
    .then((live) => {
      render(live, 'live');
      try {
        localStorage.setItem(cacheKey, JSON.stringify(live));
      } catch {
        // Nothing to do if storage is unavailable.
      }
    })
    .catch(() => {
      const status = find('status');
      if (status && !shown) status.textContent = 'GitHub did not answer. Open the profile for current numbers.';
    });
}
