// Build step: point every internal link at the page's canonical, trailing-slash URL.
//
// Pages are built as /path/index.html, so Netlify serves them at /path/ and answers
// /path with a 301. Links are written slash-less all over the codebase and in
// Keystatic content, which made every click (and every Googlebot fetch) start with a
// redirect, and turned legacy redirects into two hops (/old -> /new -> /new/).
//
// After the build, rewrite internal href/action values in the HTML and redirect
// targets in _redirects to the slash form, but only when that page really exists in
// the output, so asset links, downloads and unknown paths are left untouched.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function trailingSlashLinks() {
  return {
    name: 'trailing-slash-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const isPage = (path) => existsSync(join(root, path, 'index.html'));
        const fix = (path) =>
          path !== '/' && !path.endsWith('/') && isPage(path) ? `${path}/` : path;

        let links = 0;
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const next = html.replace(
            /(\s(?:href|action)=")(\/(?!\/)[^"?#]*)([?#][^"]*)?"/g,
            (m, attr, path, rest = '') => {
              const fixed = fix(path);
              if (fixed === path) return m;
              links++;
              return `${attr}${fixed}${rest}"`;
            },
          );
          if (next !== html) await writeFile(file, next);
        }

        let rules = 0;
        const redirectsFile = join(root, '_redirects');
        if (existsSync(redirectsFile)) {
          const lines = (await readFile(redirectsFile, 'utf8')).split('\n').map((line) => {
            const m = line.match(/^(\S+)(\s+)(\/\S*)(\s+\d{3}!?\s*)$/);
            if (!m || /[*:]/.test(m[3])) return line;
            const fixed = fix(m[3]);
            if (fixed === m[3]) return line;
            rules++;
            return `${m[1]}${m[2]}${fixed}${m[4]}`;
          });
          await writeFile(redirectsFile, lines.join('\n'));
        }
        logger.info(`${links} internal links and ${rules} redirect targets now end in /`);
      },
    },
  };
}
