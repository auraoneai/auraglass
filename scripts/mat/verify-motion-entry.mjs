#!/usr/bin/env node
/* scripts/mat/verify-motion-entry.mjs — REQ-MAT-50 (FIN D.3-30) consumer check
 * for `aura-glass/motion`. Remote only (GitLab job mat:test:motion-entry): it
 * packs the built package and installs it into scratch consumers from the npm
 * registry. Locally it exits 2 and prints the remote command.
 *
 * Checks (each one fails closed; the JSON report lists every result):
 *   dist-entry        dist/motion/public.js exists and its first statement is 'use client'
 *   dist-adapter      every dist/motion/adapter/*.js starts with 'use client'
 *   dist-no-node      no `node:` specifier in any dist/motion/** module
 *   with-peer-exports Node ESM import of aura-glass/motion (peer installed) exposes
 *                     exactly the 7 frozen names
 *   vite-with-peer    tests/motion/fixtures/with-peer builds with Vite with motion
 *                     installed, and the client output contains no `node:` specifier
 *   no-peer-absent    the without-peer consumer really has no motion package
 *   no-peer-message   Node ESM import of aura-glass/motion there rejects with the
 *                     contract install message (not ERR_MODULE_NOT_FOUND)
 *   vite-no-peer      the same Vite client build fails without the peer and names it
 *
 * Usage: node scripts/mat/verify-motion-entry.mjs [--tarball <path.tgz>] [--out <dir>]
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const MESSAGE =
  'aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12';
const REMOTE_CMD = 'GitLab job mat:test:motion-entry (node scripts/mat/verify-motion-entry.mjs)';

if (!process.env.CI && !process.env.AG_REMOTE_RUNNER) {
  console.error(`[motion-entry] remote-only lane: run ${REMOTE_CMD}`);
  process.exit(2);
}

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const outDir = resolve(arg('--out') ?? join('.artifacts/mat', process.env.CI_JOB_NAME_SLUG ?? 'motion-entry'));
mkdirSync(outDir, { recursive: true });

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const pin = (name) => {
  const v = pkg.devDependencies?.[name] ?? pkg.dependencies?.[name];
  if (!v) throw new Error(`package.json has no pinned version for ${name}`);
  return `${name}@${v}`;
};

const results = [];
const record = (id, ok, detail) => {
  results.push({ id, ok, detail });
  console.log(`[motion-entry] ${ok ? 'PASS' : 'FAIL'} ${id}: ${detail}`);
};
const run = (cmd, args, cwd, extra = {}) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 600_000, ...extra });
  return { status: r.status, out: `${r.stdout ?? ''}${r.stderr ?? ''}`, error: r.error };
};
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
// first statement of an ES module: skip leading comments/whitespace/hashbang
const firstStatement = (src) => src
  .replace(/^#!.*\n/, '')
  .replace(/^(\s+|\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)*/, '')
  .slice(0, 40);
const USE_CLIENT = /^['"]use client['"]/;
const NODE_SPEC = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)['"]node:[a-z_/]+['"]/g;

// ---------------------------------------------------------------- dist checks
const distMotion = join(ROOT, 'dist/motion');
const entry = join(distMotion, 'public.js');
if (!existsSync(entry)) {
  record('dist-entry', false, 'dist/motion/public.js missing (run after plat:build:dist; ./motion must not be seed-filtered)');
} else {
  const head = firstStatement(readFileSync(entry, 'utf8'));
  record('dist-entry', USE_CLIENT.test(head), `first statement: ${JSON.stringify(head)}`);
}
const adapterDir = join(distMotion, 'adapter');
if (!existsSync(adapterDir)) {
  record('dist-adapter', false, 'dist/motion/adapter/ missing');
} else {
  const files = walk(adapterDir).filter((f) => f.endsWith('.js'));
  const bad = files.filter((f) => !USE_CLIENT.test(firstStatement(readFileSync(f, 'utf8'))));
  record('dist-adapter', files.length > 0 && bad.length === 0,
    `${files.length} files; without 'use client': ${bad.map((f) => relative(ROOT, f)).join(', ') || 'none'}`);
}
if (existsSync(distMotion)) {
  const hits = walk(distMotion).filter((f) => f.endsWith('.js'))
    .flatMap((f) => [...readFileSync(f, 'utf8').matchAll(NODE_SPEC)].map((m) => `${relative(ROOT, f)}: ${m[0]}`));
  record('dist-no-node', hits.length === 0, hits.join('; ') || 'no node: specifiers');
} else {
  record('dist-no-node', false, 'dist/motion missing');
}

// ---------------------------------------------------------------- pack
let tarball = arg('--tarball') ?? process.env.AURAGLASS_TARBALL;
if (!tarball || !existsSync(tarball)) {
  const packDir = mkdtempSync(join(tmpdir(), 'ag-motion-pack-'));
  // --ignore-scripts: dist/ comes from plat:build:dist; never rebuild here
  const r = run('npm', ['pack', '--ignore-scripts', '--pack-destination', packDir, '--silent'], ROOT);
  if (r.status !== 0) {
    record('pack', false, r.out.trim().slice(-2000));
    writeReport();
    process.exit(1);
  }
  tarball = join(packDir, r.out.trim().split('\n').at(-1));
}
tarball = resolve(tarball);
console.log(`[motion-entry] tarball ${tarball}`);

const FIXTURE = join(ROOT, 'tests/motion/fixtures/with-peer');
const stage = (withPeer) => {
  const dir = mkdtempSync(join(tmpdir(), withPeer ? 'ag-with-peer-' : 'ag-no-peer-'));
  cpSync(FIXTURE, dir, { recursive: true });
  const deps = [tarball, pin('vite'), pin('react'), pin('react-dom')];
  if (withPeer) deps.push(pin('motion'));
  const r = run('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock', ...deps], dir);
  if (r.status !== 0) throw new Error(`npm install failed in ${dir}:\n${r.out.slice(-2000)}`);
  return dir;
};

// ---------------------------------------------------------------- with the peer
try {
  const dir = stage(true);
  const EXPECTED = ['MotionProvider', 'Shared', 'SharedLayout', 'magnetic', 'toMotionTransition', 'useDragDetents', 'useMomentum'];
  const keys = run(process.execPath, ['--input-type=module', '-e',
    "const m = await import('aura-glass/motion'); console.log(JSON.stringify({ keys: Object.keys(m).sort(), spring: m.toMotionTransition('spring-smooth') }))"], dir);
  writeFileSync(join(outDir, 'with-peer-import.log'), keys.out);
  let parsed = null;
  try { parsed = JSON.parse(keys.out.trim().split('\n').at(-1)); } catch { /* reported below */ }
  record('with-peer-exports', keys.status === 0 && JSON.stringify(parsed?.keys) === JSON.stringify([...EXPECTED].sort()),
    parsed ? `exports: ${parsed.keys.join(', ')}; spring-smooth: ${JSON.stringify(parsed.spring)}` : `exit ${keys.status}: ${keys.out.trim().slice(-600)}`);
  const b = run('npx', ['--no-install', 'vite', 'build'], dir);
  writeFileSync(join(outDir, 'vite-with-peer.log'), b.out);
  if (b.status !== 0) {
    record('vite-with-peer', false, `vite build exited ${b.status}: ${b.out.trim().split('\n').slice(-5).join(' | ')}`);
  } else {
    const assets = walk(join(dir, 'dist')).filter((f) => /\.(m?js)$/.test(f));
    const hits = assets.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(NODE_SPEC)].map((m) => `${relative(dir, f)}: ${m[0]}`));
    const bytes = assets.reduce((n, f) => n + statSync(f).size, 0);
    record('vite-with-peer', assets.length > 0 && hits.length === 0,
      `${assets.length} js assets (${bytes} B); node: specifiers: ${hits.join('; ') || 'none'}`);
  }
} catch (e) {
  record('vite-with-peer', false, String(e.message ?? e).slice(0, 2000));
}

// ---------------------------------------------------------------- without the peer
try {
  const dir = stage(false);
  const absent = !existsSync(join(dir, 'node_modules/motion/package.json'));
  record('no-peer-absent', absent, absent ? 'motion not installed' : 'motion is present in the no-peer consumer');

  const imp = run(process.execPath, ['--input-type=module', '-e', "await import('aura-glass/motion')"], dir);
  writeFileSync(join(outDir, 'no-peer-import.log'), imp.out);
  record('no-peer-message', imp.status !== 0 && imp.out.includes(MESSAGE),
    `exit ${imp.status}; ${imp.out.includes(MESSAGE) ? 'contract message present' : `got: ${imp.out.trim().split('\n').find((l) => /Error/.test(l)) ?? imp.out.trim().slice(0, 300)}`}`);

  const b = run('npx', ['--no-install', 'vite', 'build'], dir);
  writeFileSync(join(outDir, 'vite-no-peer.log'), b.out);
  record('vite-no-peer', b.status !== 0 && /motion/.test(b.out),
    b.status === 0 ? 'vite build succeeded without the peer (motion must not be bundled from aura-glass)'
      : `vite build failed as required: ${b.out.trim().split('\n').filter((l) => /motion/.test(l)).slice(0, 2).join(' | ')}`);
} catch (e) {
  record('no-peer', false, String(e.message ?? e).slice(0, 2000));
}

function writeReport() {
  const report = {
    req: 'REQ-MAT-50',
    task: 'D.3-30',
    sha: process.env.CI_COMMIT_SHA ?? null,
    job: process.env.CI_JOB_URL ?? null,
    tarball: tarball ?? null,
    results,
  };
  writeFileSync(join(outDir, 'motion-entry.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`[motion-entry] report ${relative(ROOT, join(outDir, 'motion-entry.json'))}`);
}
writeReport();
process.exit(results.every((r) => r.ok) ? 0 : 1);
