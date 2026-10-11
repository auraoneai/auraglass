#!/usr/bin/env node
/* scripts/qual/serve-static.mjs — QUAL (G-14). Serves a built Storybook directory on 127.0.0.1 for the browser lanes
   (AG_STORYBOOK_URL / AG_STORYBOOK_BASE_URL in qual:certify:l7 and qual:certify:baseline-refresh). No dependency.
   Usage: node scripts/qual/serve-static.mjs <dir> <port>   (loopback only; paths outside <dir> are refused) */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wasm': 'application/wasm', '.map': 'application/json' };

/** Absolute file for a request path, or null when it escapes the root or does not exist. */
export function resolveRequest(root, urlPath) {
  let p;
  try { p = decodeURIComponent(new URL(urlPath, 'http://x').pathname); } catch { return null; }
  const abs = normalize(join(root, p));
  if (abs !== root && !abs.startsWith(root.endsWith(sep) ? root : root + sep)) return null;
  const file = existsSync(abs) && statSync(abs).isDirectory() ? join(abs, 'index.html') : abs;
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

export function serve(dir, port) {
  const root = resolve(dir);
  if (!existsSync(join(root, 'index.json'))) throw new Error(`${dir} has no index.json (not a Storybook build)`);
  const server = createServer((req, res) => {
    const file = resolveRequest(root, req.url ?? '/');
    if (!file || (req.method !== 'GET' && req.method !== 'HEAD')) { res.writeHead(file ? 405 : 404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
  });
  return new Promise((ok, fail) => { server.once('error', fail); server.listen(port, '127.0.0.1', () => ok(server)); });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [dir, port] = process.argv.slice(2);
  if (!dir || !/^\d+$/.test(port ?? '')) { console.error('usage: serve-static.mjs <dir> <port>'); process.exit(64); }
  serve(dir, Number(port)).then(() => console.log(`serve-static: ${dir} on http://127.0.0.1:${port}`), (e) => { console.error(`serve-static: ${e.message}`); process.exit(1); });
}
