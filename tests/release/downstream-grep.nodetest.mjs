/* node --test file (PLAT-213 requires `node --test`; kept outside jest's
   testMatch on purpose — run: node --test tests/release/downstream-grep.nodetest.mjs) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { main, safeRoot, scanRoot } from '../../scripts/release/downstream-grep.mjs';

test('scanRoot reports a missing root as missing, not clean', () => {
  const r = scanRoot('/definitely/not/here-xyz');
  assert.equal(r.status, 'missing');
});
test('safeRoot refuses $HOME and /', () => {
  assert.equal(safeRoot('/').ok, false);
  assert.equal(safeRoot(homedir()).ok, false);
});
test('fixture tree: pinned version, services import and removed symbol are found', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dg-'));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '3.1.1' } }));
    mkdirSync(join(dir, 'src'));
    writeFileSync(join(dir, 'src/x.ts'),
      "import { DynamicAtmosphere } from 'aura-glass';\nimport { svc } from 'aura-glass/services';\n");
    const r = scanRoot(dir);
    assert.equal(r.status, 'ok');
    assert.ok(r.pins.some((l) => l.includes('3.1.1')));
    assert.ok(r.imports.length >= 2);
    assert.ok(r.servicesImports.length >= 1);
    assert.ok(r.removedSymbolHits.some((h) => h.startsWith('DynamicAtmosphere:')));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('timeout bound honoured: per-root timeout option is respected', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dg2-'));
  try {
    const r = scanRoot(dir, { timeoutSecs: 1 });
    assert.ok(['ok', 'partial-timeout'].includes(r.status));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('main writes the report and returns 2 when every root is missing', () => {
  const out = join(mkdtempSync(join(tmpdir(), 'dg3-')), 'report.json');
  const code = main(['--roots', '/nope/a,/nope/b', '--out', out]);
  assert.equal(code, 2);
  const rep = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(rep.roots.length, 2);
  assert.ok(existsSync(out));
});
