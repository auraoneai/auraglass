/* node --test file (PLAT-224 requires `node --test`):
   node --test tests/release/consumer-grep.nodetest.mjs                       */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { dispositionsRows, familyNames, verifyRecord, ghSearch, FAMILY_PATHS } from '../../scripts/removal/consumer-grep.mjs';

const ROW = (i, name, file, disp = 'REMOVE', pub = 'yes', dest = 'removed', target = '-', prd = 'PRD-16', owner = 'PLAT', codemod = 'removed') =>
  `| ${i} | ${name} | \`${file}\` | ${disp} | ${pub} | ${dest} | ${target} | ${owner} | ${codemod} | ${prd} |  |`;
const TABLE = `# x\n\n| # | Name | File | 4.x disposition | Public | 5.0 destination | 5.0 target | Owner | Codemod | Owning PRD | Reconciliation note |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;

test('dispositionsRows parses the generated table', () => {
  const rows = dispositionsRows(TABLE + ROW(0, 'GlassChat', 'src/components/ai/GlassChat.tsx'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'GlassChat');
  assert.equal(rows[0].dest, 'removed');
  assert.equal(rows[0].owner, 'PLAT');
  assert.equal(rows[0].codemod, 'removed');
  assert.equal(rows[0].prd, 'PRD-16');
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
test('--verify fails on missing, stale, old-shape and unacknowledged records', () => {
  const rec = (x) => ({ family: 'RM-02', names: ['A'], status: 'ok', gh: { status: 'ok' }, hits: [], acknowledged: [], ...x });
  assert.ok(verifyRecord('RM-02', null, ['A']).join().includes('no consumer-grep record'));
  assert.ok(verifyRecord('RM-02', rec({ names: [] }), ['NewName']).join().includes('stale'));
  assert.ok(verifyRecord('RM-02', { family: 'RM-02', names: ['A'], gh: { status: 'ok' }, scans: [], acknowledged: false }, ['A']).join().includes('predates'));
  assert.ok(verifyRecord('RM-02', rec({ gh: { status: 'missing' } }), ['A']).join().includes('no operator signoff'));
  assert.ok(verifyRecord('RM-02', rec({ hits: [{ path: '/c/a.ts', count: 1 }] }), ['A']).join().includes('without an owner acknowledgement'));
  assert.deepEqual(verifyRecord('RM-02', rec({ hits: [{ path: '/c/a.ts', count: 1 }], acknowledged: [{ path: '/c/a.ts', via: 'codemod' }] }), ['A']), []);
  assert.deepEqual(verifyRecord('RM-02', rec({ gh: { status: 'missing' }, signoff: 'operator: gh unavailable' }), ['A']), []);
});
test('gh search results are fetched and grepped per file', () => {
  const gh = (args) => (args[0] === 'search'
    ? JSON.stringify([{ repository: { nameWithOwner: 'o/x' }, path: 'a.ts' }])
    : "import { GlassChat } from 'aura-glass';");
  const r = ghSearch(['GlassChat'], { gh });
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.hits, [{ path: 'gh:o/x/a.ts', count: 1 }]);
});

test('bare --verify rejects a missing known-family record', () => {
  const root = mkdtempSync(join(tmpdir(), 'consumer-grep-verify-'));
  try {
    mkdirSync(join(root, 'scripts/removal'), { recursive: true });
    mkdirSync(join(root, 'docs/inventory'), { recursive: true });
    mkdirSync(join(root, 'docs/release/decisions/removals'), { recursive: true });
    cpSync(new URL('../../scripts/removal/consumer-grep.mjs', import.meta.url),
      join(root, 'scripts/removal/consumer-grep.mjs'));
    writeFileSync(join(root, 'docs/inventory/component-dispositions.md'), TABLE);
    for (const family of Object.keys(FAMILY_PATHS)) {
      writeFileSync(join(root, `docs/release/decisions/removals/${family}.json`), JSON.stringify({
        family, names: [], status: 'missing', signoff: 'fixture', gh: { status: 'missing' }, hits: [], acknowledged: [],
      }));
    }
    const args = ['scripts/removal/consumer-grep.mjs', '--verify'];
    const opts = { cwd: root, encoding: 'utf8', stdio: 'pipe' };
    assert.match(execFileSync(process.execPath, args, opts), /RM-02: record current/);
    rmSync(join(root, 'docs/release/decisions/removals/RM-02.json'));
    assert.throws(() => execFileSync(process.execPath, args, opts),
      (error) => error.status !== 0 && /no consumer-grep record/.test(error.stderr));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
