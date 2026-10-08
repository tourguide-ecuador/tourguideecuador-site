// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import trailingSlashLinks from './integrations/trailing-slash-links.mjs';

/**
 * Three build modes:
 *
 *  1. `astro dev`                        → local content editing at /keystatic
 *                                          (Keystatic local mode + Node adapter).
 *  2. `astro build` (default)            → pure-static drag-drop deploy:
 *                                          no adapter, no functions, no Keystatic.
 *  3. `astro build` with PUBLIC_KEYSTATIC_CLOUD_PROJECT (or PUBLIC_KEYSTATIC_GITHUB_REPO)
 *                                        → production CLOUD EDITING on Netlify:
 *                                          pages stay static, the Keystatic admin +
 *                                          its API deploy as Netlify functions so the
 *                                          client edits at /keystatic on the live site.
 *
 * Output stays `static`; only the Keystatic admin routes are on-demand (mode 3).
 */
const isDev = process.argv.includes('dev');
const cloudEditing = !!(process.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT || process.env.PUBLIC_KEYSTATIC_GITHUB_REPO);

const extra = isDev
  ? await (async () => {
      const keystatic = (await import('@keystatic/astro')).default;
      const react = (await import('@astrojs/react')).default;
      const node = (await import('@astrojs/node')).default;
      return { integrations: [react(), keystatic()], adapter: node({ mode: 'standalone' }) };
    })()
  : cloudEditing
    ? await (async () => {
        const keystatic = (await import('@keystatic/astro')).default;
        const react = (await import('@astrojs/react')).default;
        const netlify = (await import('@astrojs/netlify')).default;
        return { integrations: [react(), keystatic()], adapter: netlify() };
      })()
    : { integrations: [], adapter: undefined };

// https://astro.build/config
export default defineConfig({
  site: 'https://tourguideecuador.com',
  output: 'static',
  adapter: extra.adapter,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      filter: (page) => !/\/(keystatic|thank-you)\/?$/.test(page),
    }),
    mdx(),
    ...extra.integrations,
    // Keep last: rewrites internal links in the finished HTML to their trailing-slash URLs.
    trailingSlashLinks(),
  ],
  image: { domains: [] },
  vite: {
    plugins: [tailwindcss()],
  },
});
