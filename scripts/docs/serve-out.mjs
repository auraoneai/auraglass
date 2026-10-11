#!/usr/bin/env node
/* scripts/docs/serve-out.mjs — REQ-PLAT-102. Minimal static server for the
   exported docs site (apps/docs/out) used by the remote docs-a11y and
   docs-lighthouse specs. The export is built with a basePath (GitLab Pages
   path, see apps/docs/next.config.ts), so the site is mounted under that
   prefix exactly as Pages serves it; trailingSlash routes map to
   <route>/index.html. Missing files return 404 (out/404.html when present).

   node scripts/docs/serve-out.mjs [--dir apps/docs/out] [--port 4173] [--base /prefix] */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_BASE_URL } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.ico': 'image/x-icon', '.map': 'application/json',
};

/** basePath the export was built with (same derivation as apps/docs/next.config.ts). */
export function docsBasePath(env = process.env) {
  if (env.NEXT_BASE_PATH !== undefined) return env.NEXT_BASE_PATH.replace(/\/$/, '');
  return DOCS_BASE_URL ? new URL(DOCS_BASE_URL, 'https://pages.example.com').pathname.replace(/\/$/, '') : '';
}

/** File for a request path under `dir`, or null. Never escapes `dir`. */
export function fileFor(dir, base, urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (base) {
    if (p !== base && !p.startsWith(`${base}/`)) return null;
    p = p.slice(base.length) || '/';
  }
  const abs = normalize(join(dir, p));
  if (abs !== dir && !abs.startsWith(dir + sep)) return null;
  for (const c of [abs, join(abs, 'index.html'), `${abs}.html`]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

export function serve({ dir, port, base }) {
  const root = resolve(dir);
  const server = createServer((req, res) => {
    const file = fileFor(root, base, req.url ?? '/');
    if (!file) {
      const nf = join(root, '404.html');
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      if (existsSync(nf)) createReadStream(nf).pipe(res); else res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'public, max-age=31536000' });
    createReadStream(file).pipe(res);
  });
  server.listen(port, '127.0.0.1', () => console.log(`serve-out: ${root} at http://127.0.0.1:${port}${base}/`));
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
  const dir = resolve(ROOT, arg('--dir', 'apps/docs/out'));
  if (!existsSync(dir)) { console.error(`serve-out: ${dir} missing — plat:build:docs artifacts required`); process.exit(1); }
  serve({ dir, port: Number(arg('--port', '4173')), base: arg('--base', docsBasePath()) });
}
