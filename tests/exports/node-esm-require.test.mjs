/* REQ-PLAT-68: ESM `import` + CJS `require` resolution against a REAL packed
   install. Runs under node:20.19 and node:22 in pack-matrix (`node --test`)
   and under the repo's jest run. Each built subpath resolves via both
   loaders; a contract entry gated to a later GA line (EntrySpec.ga, e.g.
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
const SUBPATHS = ['./material', './tokens', './icons', './data', './date', './three', './styles.css'];
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
writeFileSync(join(app, 'package.json'), JSON.stringify({
  name: 'app', type: 'module',
  dependencies: { 'aura-glass': `file:${tgz}` },
}));
execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps'], { cwd: app, stdio: 'pipe' });

// resolution only — executing would need the peer graph installed
const probe = (sub) => {
  const file = join(app, 'probe.mjs');
  writeFileSync(file, `import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
try {
  await import.meta.resolve('aura-glass${sub.slice(1)}');
  req.resolve('aura-glass${sub.slice(1)}');
  process.exit(0);
} catch (e) { console.error(e.code ?? e.message); process.exit(1); }`);
  return execFileSync('node', [file], { cwd: app, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
};

for (const sub of SUBPATHS) {
  test(`${sub} resolves (esm resolve + cjs require.resolve)`, () => {
    probe(sub);
    assert.ok(true);
  });
}

for (const sub of GATED) {
  test(`${sub} is not exported before its GA line (${GA_LINE[sub]} > ${pkgVersion})`, () => {
    assert.throws(() => probe(sub), (e) => /ERR_PACKAGE_PATH_NOT_EXPORTED/.test(String(e.stderr ?? '')));
  });
}

process.on('exit', () => rmSync(work, { recursive: true, force: true }));
