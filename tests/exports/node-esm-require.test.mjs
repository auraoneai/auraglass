/* REQ-PLAT-68: ESM `import` + CJS `require` against a REAL packed install.
   Runs under node:20.19 and node:22 in pack-matrix (`node --test`) and under
   the repo's jest run. Each built subpath (including '.') resolves via both
   loaders; '.', ./tokens, ./material and ./icons are also EXECUTED through
   `await import()` and `require()` (require(esm), unflagged since Node
   20.19) with the required peers react/react-dom installed at the repo's
   pinned versions, and both loaders must yield the same named exports. A
   contract entry gated to a later GA line (EntrySpec.ga, e.g.
   ./charts ga:'5.1' on 5.0.x — dropped by scripts/build/generate-exports.mjs)
   must NOT resolve (ERR_PACKAGE_PATH_NOT_EXPORTED). Exits 1 on any miss. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

// jest injects a global `test`; `node --test` does not, so fall back to node:test.
const test = typeof globalThis.test === 'function' ? globalThis.test : (await import('node:test')).test;

const ROOT = new URL('../..', import.meta.url).pathname;
const SUBPATHS = ['.', './material', './tokens', './icons', './data', './date', './three', './styles.css'];
// Executed (not only resolved) through both loaders.
const EXECUTED = ['.', './tokens', './material', './icons'];
const spec = (sub) => (sub === '.' ? 'aura-glass' : `aura-glass${sub.slice(1)}`);
// Contract entries whose GA line is after the packed version's line.
const GA_LINE = { './charts': '5.1' };
const pkgVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
const line = (v) => v.split('.').slice(0, 2).map(Number);
const after = (a, b) => { const [x, y] = line(a); const [p, q] = line(b); return x > p || (x === p && y > q); };
for (const [sub, ga] of Object.entries(GA_LINE)) if (!after(ga, pkgVersion)) SUBPATHS.push(sub);
const GATED = Object.entries(GA_LINE).filter(([, ga]) => after(ga, pkgVersion)).map(([sub]) => sub);

const work = mkdtempSync(join(tmpdir(), 'ag-esm-req-'));
execFileSync('npm', ['pack', '--ignore-scripts', '--pack-destination', work], { cwd: ROOT, stdio: 'pipe' });
const tgz = join(work, readdirSync(work).find((f) => f.endsWith('.tgz')));
const app = join(work, 'app');
mkdirSync(app, { recursive: true });
const devDeps = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).devDependencies ?? {};
const pin = (name) => devDeps[name] ?? '^19.0.0';
writeFileSync(join(app, 'package.json'), JSON.stringify({
  name: 'app', type: 'module',
  // the required peers; optional peers (motion, three, ...) stay uninstalled
  dependencies: { 'aura-glass': `file:${tgz}`, react: pin('react'), 'react-dom': pin('react-dom') },
}));
execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps'], { cwd: app, stdio: 'pipe' });

const probe = (sub) => {
  const file = join(app, 'probe.mjs');
  writeFileSync(file, `import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
try {
  await import.meta.resolve(${JSON.stringify(spec(sub))});
  req.resolve(${JSON.stringify(spec(sub))});
  process.exit(0);
} catch (e) { console.error(e.code ?? e.message); process.exit(1); }`);
  return execFileSync('node', [file], { cwd: app, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
};

// Executes the entry through both loaders in fresh processes; prints the
// sorted export names of each. Node 20.19+/22.12+ load ESM via require().
const execProbe = (sub) => {
  const esm = join(app, 'exec-esm.mjs');
  const cjs = join(app, 'exec-cjs.cjs');
  writeFileSync(esm, `const m = await import(${JSON.stringify(spec(sub))});
process.stdout.write(JSON.stringify(Object.keys(m).filter((k) => k !== 'default' && k !== 'module.exports').sort()));`);
  writeFileSync(cjs, `const m = require(${JSON.stringify(spec(sub))});
process.stdout.write(JSON.stringify(Object.keys(m).filter((k) => k !== 'default' && k !== 'module.exports' && k !== '__esModule').sort()));`);
  const opts = { cwd: app, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NODE_OPTIONS: '' } };
  const run = (f) => {
    try { return JSON.parse(execFileSync('node', ['--no-warnings', f], opts)); }
    catch (e) { throw new Error(`${sub} via ${f.endsWith('.cjs') ? 'require()' : 'import()'} failed: ${e.stderr || e.message}`); }
  };
  return { esm: run(esm), cjs: run(cjs) };
};

for (const sub of SUBPATHS) {
  test(`${sub} resolves (esm resolve + cjs require.resolve)`, () => {
    probe(sub);
    assert.ok(true);
  });
}

for (const sub of EXECUTED) {
  test(`${sub} executes via await import() and require() with the same exports`, () => {
    const { esm, cjs } = execProbe(sub);
    if (sub !== './icons') assert.ok(esm.length > 0, `${sub} has no named exports`);
    assert.deepEqual(cjs, esm);
  });
}

for (const sub of GATED) {
  test(`${sub} is not exported before its GA line (${GA_LINE[sub]} > ${pkgVersion})`, () => {
    assert.throws(() => probe(sub), (e) => /ERR_PACKAGE_PATH_NOT_EXPORTED/.test(String(e.stderr ?? '')));
  });
}

process.on('exit', () => rmSync(work, { recursive: true, force: true }));
