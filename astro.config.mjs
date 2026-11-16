// astro.config.mjs - Static build with a hashed CSP; CSS is inlined to skip a blocking request.
import { defineConfig } from 'astro/config';

// Canonical URL comes from SITE_URL, or from Vercel when deployed there.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : undefined);

export default defineConfig({
  site,
  compressHTML: true,
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.github.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },
});
