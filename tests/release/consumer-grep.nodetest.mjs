/* node --test file (PLAT-224 requires `node --test`):
   node --test tests/release/consumer-grep.nodetest.mjs                       */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { dispositionsRows, familyNames, verifyRecord, ghSearch } from '../../scripts/removal/consumer-grep.mjs';

const ROW = (i, name, file, disp = 'REMOVE', pub = 'yes', dest = 'removed', target = '-', prd = 'PRD-16') =>
  `| ${i} | ${name} | \`${file}\` | ${disp} | ${pub} | ${dest} | ${target} | ${prd} |  |`;
const TABLE = `# x\n\n| # | Name | File | 4.x disposition | Public | 5.0 destination | 5.0 target | Owning PRD | Reconciliation note |\n|---|---|---|---|---|---|---|---|---|\n`;

test('dispositionsRows parses the generated table', () => {
  const rows = dispositionsRows(TABLE + ROW(0, 'GlassChat', 'src/components/ai/GlassChat.tsx'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'GlassChat');
  assert.equal(rows[0].dest, 'removed');
});
test('familyNames resolves export names from family paths', () => {
  const rows = dispositionsRows(TABLE + [
    ROW(0, 'GlassChat', 'src/components/ai/GlassChat.tsx'),
    ROW(1, 'GlassCard', 'src/components/surface/GlassCard.tsx', 'KEEP', 'yes', 'core', 'Card', 'PRD-14'),
  ].join('\n'));
  const names = familyNames('RM-02', rows).map((r) => r.name);
  assert.deepEqual(names, ['GlassChat']);
});
test('word-boundary rg finds only aura-glass import lines', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cg-'));
  try {
    mkdirSync(join(dir, 'src'), { recursive: true });
    writeFileSync(join(dir, 'src/a.ts'), "import { GlassChat } from 'aura-glass';\nconst GlassChatLocal = 1;\n");
    writeFileSync(join(dir, 'src/b.ts'), "const GlassChatters = 'unrelated';\n");
    mkdirSync(join(dir, 'node_modules/x'), { recursive: true });
    writeFileSync(join(dir, 'node_modules/x/i.ts'), "import { GlassChat } from 'aura-glass';\n");
    const hits = execFileSync('rg', ['--no-messages', '-n', '--glob', '!node_modules', String.raw`\bGlassChat\b`, dir],
      { encoding: 'utf8' }).split('\n').filter((l) => l.includes('aura-glass'));
    assert.equal(hits.length, 1);
    assert.ok(hits[0].includes('a.ts'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('--verify fails on missing, stale and unacknowledged records', () => {
  assert.ok(verifyRecord('RM-02', null, ['A']).join().includes('no consumer-grep record'));
  assert.ok(verifyRecord('RM-02', { family: 'RM-02', names: [], gh: { status: 'missing' }, acknowledged: false },
    ['NewName']).join().includes('stale'));
  assert.ok(verifyRecord('RM-02', { family: 'RM-02', names: ['A'], gh: { status: 'missing' }, acknowledged: false },
    ['A']).join().includes('not acknowledged'));
  assert.deepEqual(verifyRecord('RM-02',
    { family: 'RM-02', names: ['A'], gh: { status: 'missing' }, acknowledged: true, status: 'ok' }, ['A']), []);
});
test('gh stubbed via PATH is invoked and parsed', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gh-'));
  try {
    writeFileSync(join(dir, 'gh'), '#!/bin/sh\necho \'[{"repository":{"name":"x"},"path":"a.ts"}]\'');
    execFileSync('chmod', ['+x', join(dir, 'gh')]);
    const old = process.env.PATH;
    process.env.PATH = `${dir}:${old}`;
    try {
      const r = ghSearch(['GlassChat']);
      assert.equal(r.status, 'ok');
      assert.equal(r.hits.length, 1);
    } finally { process.env.PATH = old; }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
