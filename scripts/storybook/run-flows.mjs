#!/usr/bin/env node
/* REQ-QUAL-57 (REQ-FIN-106, FIN-452): run the Storybook flow specs (tests/e2e/qual/storybook/**) against the
   built, fresh storybook-static/. Remote only (GitLab CI / gated runner, machine policy + REQ-QUAL-67): without
   CI=true, AG_REMOTE_RUNNER=1 or AG_CERT_ALLOW_LOCAL=1 it exits 2 and prints the remote command.
   Usage: node scripts/storybook/run-flows.mjs [--dir storybook-static] [--port 6006] [-- <playwright args>]

   1. verify-fresh (ag-build.json sha == SHA under test, clean tree in CI, index hash);
   2. serves <dir> on 127.0.0.1:<port> (static, no directory listing, path-traversal safe);
   3. runs `playwright test tests/e2e/qual/storybook --project=chromium` with AG_STORYBOOK_URL set, results under
      $AURAGLASS_EVIDENCE_DIR (the root config writes <dir>/playwright/results.json). */
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main as verifyFresh } from './verify-fresh.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
export const REMOTE_COMMAND = 'GitLab CI job qual:test:storybook-flows (pipeline for the branch head), or the gated runner: skill auraone-remote-run';

export const isRemote = (env = process.env) => env.CI === 'true' || env.AG_REMOTE_RUNNER === '1' || env.AG_CERT_ALLOW_LOCAL === '1';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon', '.map': 'application/json',
};

/** Static file server for a built Storybook, bound to 127.0.0.1 only. */
export function serveStatic(dir, port) {
  const base = resolve(dir) + sep;
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(base, rel));
    if (!file.startsWith(base) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((r, j) => server.once('error', j).listen(port, '127.0.0.1', () => r(server)));
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  if (!isRemote(env)) {
    console.error(`run-flows: browser runs are remote-only. Run: ${REMOTE_COMMAND}`);
    return 2;
  }
  const sep2 = argv.indexOf('--');
  const own = sep2 >= 0 ? argv.slice(0, sep2) : argv;
  const extra = sep2 >= 0 ? argv.slice(sep2 + 1) : [];
  const dirIdx = own.indexOf('--dir');
  const portIdx = own.indexOf('--port');
  const dir = resolve(dirIdx >= 0 ? own[dirIdx + 1] : 'storybook-static');
  const port = Number(portIdx >= 0 ? own[portIdx + 1] : 6006);
  if (verifyFresh(['--dir', dir], env) !== 0) return 1;
  const server = await serveStatic(dir, port);
  try {
    const child = spawn(join(ROOT, 'node_modules', '.bin', 'playwright'), ['test', 'tests/e2e/qual/storybook', '--project=chromium', ...extra], {
      cwd: ROOT,
      env: { ...env, AG_STORYBOOK_URL: `http://127.0.0.1:${port}`, AG_STORYBOOK_DIR: dir },
      stdio: 'inherit',
    });
    return await new Promise((r) => child.on('close', (code) => r(code ?? 1)));
  } finally {
    server.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code), (e) => { console.error(`run-flows: ${e.message}`); process.exit(1); });
}
