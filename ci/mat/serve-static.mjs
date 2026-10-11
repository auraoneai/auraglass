#!/usr/bin/env node
/* ci/mat/serve-static.mjs — minimal static file server for the MAT browser
 * jobs (remote runner only), so Playwright specs can reach storybook-static at
 * AG_STORYBOOK_URL without extra dependencies in the Playwright image.
 *
 *   node ci/mat/serve-static.mjs --dir storybook-static --port 6006 &
 *   node ci/mat/serve-static.mjs --wait http://127.0.0.1:6006/iframe.html [--timeout 60000]
 *
 * --wait exits 0 once the URL answers 2xx and exits 1 on timeout (fail-closed). */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json; charset=utf-8',
};

const waitUrl = opt('wait', null);
if (waitUrl) {
  const timeout = Number(opt('timeout', '60000'));
  const start = Date.now();
  for (;;) {
    try {
      const res = await fetch(waitUrl);
      if (res.ok) process.exit(0);
    } catch {
      // not up yet
    }
    if (Date.now() - start > timeout) {
      console.error(`[serve-static] ${waitUrl} not served within ${timeout} ms`);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

const root = resolve(opt('dir', 'storybook-static'));
const port = Number(opt('port', '6006'));
const host = opt('host', '127.0.0.1');
if (!existsSync(join(root, 'iframe.html'))) {
  console.error(`[serve-static] ${root}/iframe.html missing`);
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}`);
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  let file = join(root, rel);
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, host, () => console.log(`[serve-static] ${root} on http://${host}:${port}`));
