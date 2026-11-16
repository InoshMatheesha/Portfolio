# Inosh Matheesha - Portfolio

Static portfolio site built with Astro and TypeScript. No framework runtime, no trackers, no third-party requests.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type check, then build to dist/
npm run preview  # serve the production build
```

Requires Node 22.23 or newer.

## Edit the content

All text lives in `src/data/`. Nothing else needs to change for a content update.

| File | Holds |
|---|---|
| `site.ts` | Name, role, education, about text, contact channels, GitHub numbers |
| `projects.ts` | Project cards and their categories |
| `layers.ts` | The five layers of the hero stack |
| `skills.ts` | Skill groups and proficiency levels |
| `writing.ts` | Medium articles |

Project images are read from `assets/` and converted to AVIF and WebP at build time.

## Deploy

Any static host works; the output is `dist/`.

- **Vercel:** import the repo. `vercel.json` adds the security headers and the site URL is picked up automatically.
- **Elsewhere:** set `SITE_URL=https://your-domain` at build time so canonical and social-card URLs are absolute.

## Security posture

- Content Security Policy with script hashes, emitted by Astro into every page.
- HSTS, `nosniff`, frame denial, referrer and permissions policies in `vercel.json`.
- `/.well-known/security.txt` is published. Its `Expires` date needs renewing once a year.

## Version

The version in `package.json` is shown in the site footer. Bump it with each change.
