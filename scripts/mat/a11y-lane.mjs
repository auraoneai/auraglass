#!/usr/bin/env node
/* scripts/mat/a11y-lane.mjs — REQ-MAT-65 (D.3-39): the MAT catalogue-wide a11y
   lane on a GitLab remote Playwright runner. Fail-closed: any spec failure,
   missing Storybook, server error or empty run exits non-zero; nothing is
   reported pending from here.

   Usage (GitLab .ag-playwright job only):
     node scripts/mat/a11y-lane.mjs --suite e2e|pixel-contrast --engine chromium|webkit|firefox [--shard i/n]

   - Serves storybook-static/ (the qual:build:storybook artifact; built here
     with `npm run storybook:build` when the artifact is absent) on
     127.0.0.1:6006 with node:http — no extra dependency.
   - Runs the mat:a11y-<suite>-<engine> project (fragments/playwright/mat.json).
   - MAT_A11Y_SCOPE: full on nightly/release scope, pr otherwise.
   - Invoked outside CI / the gated remote runner it exits 2 and prints the
     remote command (machine policy, PRD-F §12 rule 6). */
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SUITES = ['e2e', 'pixel-contrast'];
const ENGINES = ['chromium', 'webkit', 'firefox'];
const PORT = 6006;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wasm': 'application/wasm', '.txt': 'text/plain',
  '.map': 'application/json', '.ico': 'image/x-icon',
};

export function parseArgs(argv) {
  const get = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const suite = get('--suite'), engine = get('--engine'), shard = get('--shard') ?? null;
  if (!SUITES.includes(suite)) throw new Error(`--suite must be ${SUITES.join('|')} (got ${suite})`);
  if (!ENGINES.includes(engine)) throw new Error(`--engine must be ${ENGINES.join('|')} (got ${engine})`);
  if (shard !== null && !/^[1-9]\d*\/[1-9]\d*$/.test(shard)) throw new Error(`--shard must be i/n (got ${shard})`);
  return { suite, engine, shard };
}

export const sweepScopeFor = (agScope) => (agScope === 'nightly' || agScope === 'release' ? 'full' : 'pr');

/** Resolve a request path inside dir; null when it escapes dir. */
export function resolveStatic(dir, urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const p = normalize(join(dir, clean));
  if (p !== dir && !p.startsWith(dir + sep)) return null;
  if (existsSync(p) && statSync(p).isDirectory()) return join(p, 'index.html');
  return p;
}

function serve(dir) {
  const server = createServer((req, res) => {
    const file = resolveStatic(dir, req.url ?? '/');
    if (!file || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok, fail) => {
    server.once('error', fail);
    server.listen(PORT, '127.0.0.1', () => ok(server));
  });
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  let args;
  try { args = parseArgs(argv); } catch (e) { console.error(`a11y-lane: ${e.message}`); return 64; }
  const command = `node scripts/mat/a11y-lane.mjs ${argv.join(' ')}`;
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1')) {
    console.error(`a11y-lane: browser lanes run only on GitLab CI or the gated remote runner (machine policy).\nRemote command: ${command}`);
    return 2;
  }
  const sb = join(ROOT, 'storybook-static');
  // A complete build has both the index and the preview iframe; a partial
  // artifact (manager built, preview failed) is rebuilt, never served.
  const complete = () => existsSync(join(sb, 'index.json')) && existsSync(join(sb, 'iframe.html'));
  if (!complete()) {
    console.log('a11y-lane: storybook-static/ absent or incomplete (no usable qual:build:storybook artifact) — building it');
    const b = spawnSync('npm', ['run', 'storybook:build'], { cwd: ROOT, stdio: 'inherit' });
    if (b.status !== 0) { console.error(`a11y-lane: storybook:build failed (exit ${b.status})`); return 1; }
    if (!complete()) { console.error('a11y-lane: storybook build wrote no index.json/iframe.html'); return 1; }
  }
  const server = await serve(sb);
  const url = `http://127.0.0.1:${PORT}`;
  try {
    const probe = await fetch(`${url}/index.json`);
    if (!probe.ok) { console.error(`a11y-lane: ${url}/index.json -> HTTP ${probe.status}`); return 1; }
    const project = `mat:a11y-${args.suite}-${args.engine}`;
    const slug = env.CI_JOB_NAME_SLUG || `mat-a11y-${args.suite}-${args.engine}`;
    const r = spawnSync(process.execPath, [
      'node_modules/@playwright/test/cli.js', 'test', `--project=${project}`,
      '--reporter=line', `--output=.artifacts/mat/${slug}/test-results`,
      ...(args.shard ? [`--shard=${args.shard}`] : []),
    ], {
      cwd: ROOT, stdio: 'inherit',
      env: { ...env, AG_STORYBOOK_URL: url, MAT_A11Y_SCOPE: sweepScopeFor(env.AG_SCOPE) },
    });
    if (r.error) { console.error(`a11y-lane: playwright did not start: ${r.error.message}`); return 1; }
    console.log(`a11y-lane: ${project} exit ${r.status}`);
    return r.status === 0 ? 0 : 1;
  } finally {
    server.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code), (e) => { console.error(`a11y-lane: ${e.stack ?? e.message}`); process.exit(1); });
}
