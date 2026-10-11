/* REQ-PLAT-68: ESM `import` + CJS `require` resolution against a REAL packed
   install. Runs under node:20.19 and node:22 in pack-matrix. 8 assertions:
   each built subpath resolves via both loaders. Exits 1 on any miss. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const ROOT = new URL('../..', import.meta.url).pathname;
const SUBPATHS = ['./material', './tokens', './icons', './data', './date', './three', './charts', './styles.css'];

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

for (const sub of SUBPATHS) {
  test(`${sub} resolves (esm resolve + cjs require.resolve)`, async () => {
    // resolution only — executing would need the peer graph installed
    const probe = join(app, 'probe.mjs');
    writeFileSync(probe, `import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
try {
  await import.meta.resolve('aura-glass${sub.slice(1)}');
  req.resolve('aura-glass${sub.slice(1)}');
  process.exit(0);
} catch (e) { console.error(e.code ?? e.message); process.exit(1); }`);
    execFileSync('node', [probe], { cwd: app, encoding: 'utf8' });
    assert.ok(true);
  });
}

process.on('exit', () => rmSync(work, { recursive: true, force: true }));
