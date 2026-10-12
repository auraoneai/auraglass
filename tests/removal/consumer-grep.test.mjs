/* @jest-environment node */
/* REQ-PLAT-81 (PLAT-223): consumer-grep unit + fixture-tree tests — row
   parsing, family matching, the import-specifier scan over a fixture tree, the
   per-file gh grep, verifyRecord error paths (unacknowledged hits, old shape,
   freshness against the PR base) and the bare --verify loop over a synthetic
   repo root. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  dispositionsRows, familyNames, verifyRecord, FAMILY_PATHS, countNameHits, scanRoot, expandRoots,
  ghSearch, familiesInDiff, reshapeRecord,
} from '../../scripts/removal/consumer-grep.mjs';

const ROW = '| 1 | GlassAiChat | `src/components/ai/GlassAiChat.tsx` | CLASS | yes | removed | - | plat | removed | PRD-03 | rm-02 ai/voice family |';
const ROW2 = '| 2 | GlassWidget | `src/components/widgets/GlassWidget.tsx` | CLASS | yes | removed | - | plat | removed | PRD-03 | rm-11 catch-all |';
const DOC = `# dispositions fixture\n\n| # | Component | File | Disp | Pub | Destination | Target | Owner | Codemod | Owning PRD | Reconciliation note |\n|---|---|---|---|---|---|---|---|---|---|---|\n${ROW}\n${ROW2}\n`;

const good = (family, names, extra = {}) => ({
  family, names, status: 'ok', gh: { status: 'ok' }, hits: [], acknowledged: [], scanSha: 'abc', ...extra,
});

describe('consumer-grep units', () => {
  it('parses the 11-column dispositions table', () => {
    const rows = dispositionsRows(DOC);
    expect(rows.length).toBe(2);
    expect(rows[0].name).toBe('GlassAiChat');
    expect(rows[0].owner).toBe('plat');
    expect(rows[0].codemod).toBe('removed');
  });

  it('still parses the earlier 9-column table (no Owner/Codemod)', () => {
    const doc9 = '| 7 | GlassVoice | `src/components/voice/GlassVoice.tsx` | CLASS | yes | removed | - | PRD-03 | rm-02 |\n';
    const rows = dispositionsRows(doc9 + DOC);
    expect(rows.map((r) => r.name)).toEqual(['GlassAiChat', 'GlassWidget', 'GlassVoice']);
    expect(rows[2]).toMatchObject({ prd: 'PRD-03', owner: '', codemod: '' });
  });

  it('familyNames matches prefixes; RM-11 is the src/components catch-all; RM-13 has no export names', () => {
    const rows = dispositionsRows(DOC);
    expect(familyNames('RM-02', rows).map((r) => r.name)).toEqual(['GlassAiChat']);
    expect(familyNames('RM-11', rows).map((r) => r.name)).toEqual(['GlassWidget']);
    expect(familyNames('RM-13', rows)).toEqual([]);
    expect(familyNames('RM-99', rows)).toBeNull();
  });

  it('countNameHits: word-boundary names, only in files with an aura-glass import specifier', () => {
    const imp = "import { GlassWidget, GlassWidgetPro } from 'aura-glass';\n<GlassWidget />";
    expect(countNameHits(imp, ['GlassWidget'])).toBe(2); // GlassWidgetPro is not a word-boundary match
    expect(countNameHits("const x = require('aura-glass/compat'); x.GlassWidget", ['GlassWidget'])).toBe(1);
    expect(countNameHits("await import('aura-glass/primitives'); GlassWidget", ['GlassWidget'])).toBe(1);
    expect(countNameHits("import { GlassWidget } from 'aura-glass-fork';", ['GlassWidget'])).toBe(0);
    expect(countNameHits('// mentions aura-glass and GlassWidget in prose', ['GlassWidget'])).toBe(0);
    expect(countNameHits(imp, [])).toBe(0);
  });

  it('verifyRecord: missing, stale, old shape, unavailable scans without signoff', () => {
    expect(verifyRecord('RM-02', null, ['GlassAiChat'])[0]).toContain('no consumer-grep record');
    expect(verifyRecord('RM-02', good('RM-02', []), ['GlassAiChat']).join(' ')).toContain('stale');
    const old = { family: 'RM-02', names: ['GlassAiChat'], status: 'ok', gh: { status: 'ok' }, scans: [], acknowledged: false };
    expect(verifyRecord('RM-02', old, ['GlassAiChat']).join(' ')).toContain('predates REQ-PLAT-81 shape');
    expect(verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { gh: { status: 'missing' } }), ['GlassAiChat']).join(' ')).toContain('gh search missing');
    expect(verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { status: 'missing' }), ['GlassAiChat']).join(' ')).toContain('all roots missing');
    expect(verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { status: 'missing', gh: { status: 'missing' }, signoff: 'roots on the owner Mac only' }), ['GlassAiChat'])).toEqual([]);
    expect(verifyRecord('RM-02', good('RM-02', ['GlassAiChat']), ['GlassAiChat'])).toEqual([]);
  });

  it('verifyRecord fails on a hit without an owner acknowledgement (codemod or 4.x LTS)', () => {
    const hits = [{ path: '/x/app/a.tsx', count: 2 }, { path: 'gh:o/r/b.ts', count: 1 }];
    const open = verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { hits }), ['GlassAiChat']);
    expect(open.join(' ')).toContain('2 consumer hit(s) without an owner acknowledgement');
    const half = verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { hits, acknowledged: [{ path: '/x/app/a.tsx', via: 'codemod' }] }), ['GlassAiChat']);
    expect(half.join(' ')).toContain('1 consumer hit(s)');
    expect(half.join(' ')).toContain('gh:o/r/b.ts');
    const badVia = verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { hits: hits.slice(0, 1), acknowledged: [{ path: '/x/app/a.tsx', via: 'later' }] }), ['GlassAiChat']);
    expect(badVia.join(' ')).toContain("needs { path, via: codemod | 4.x-lts }");
    expect(badVia.join(' ')).toContain('1 consumer hit(s)');
    const all = verifyRecord('RM-02', good('RM-02', ['GlassAiChat'], { hits, acknowledged: [{ path: '/x/app/a.tsx', via: 'codemod' }, { path: 'gh:o/r/b.ts', via: '4.x-lts' }] }), ['GlassAiChat']);
    expect(all).toEqual([]);
  });

  it('verifyRecord freshness: an RM PR fails when the scan predates the PR base', () => {
    const rec = good('RM-02', ['GlassAiChat'], { scanSha: 'old' });
    const isAncestor = (a, b) => !(a === 'base' && b === 'old');
    expect(verifyRecord('RM-02', rec, ['GlassAiChat'], { base: 'base', isAncestor }).join(' ')).toContain('older than the PR base base');
    expect(verifyRecord('RM-02', { ...rec, scanSha: 'new' }, ['GlassAiChat'], { base: 'base', isAncestor })).toEqual([]);
    expect(verifyRecord('RM-02', { ...rec, scanSha: undefined }, ['GlassAiChat'], { base: 'base', isAncestor }).join(' ')).toContain('no scanSha');
    expect(verifyRecord('RM-02', rec, ['GlassAiChat'])).toEqual([]); // not an RM PR for this family: no freshness rule
  });

  it('familiesInDiff: a changed record or a deleted legacy file under a family path', () => {
    const diff = [
      'M\tdocs/release/decisions/removals/RM-13.json',
      'D\tlegacy/src/components/ai/GlassAiChat.tsx',
      'M\tlegacy/src/primitives/Slot.tsx',
      'D\tsrc/components/widgets/GlassWidget.tsx',
    ].join('\n');
    expect([...familiesInDiff(diff)].sort()).toEqual(['RM-02', 'RM-11', 'RM-13']);
  });

  it('reshapeRecord turns line hits into {path, count} and acknowledged:false into []', () => {
    const prev = { family: 'RM-12', names: ['Slot'], status: 'ok', sha: 's', mergeSha: 's', gh: { status: 'ok', hits: [{ path: 'a' }] },
      scans: [{ root: '/r', hitCount: 2, hits: ['/r/a.tsx:1:x', '/r/a.tsx:9:y'] }, { root: '/q', hitCount: 0, hits: [] }], acknowledged: false };
    const next = reshapeRecord(prev);
    expect(next).toEqual({ family: 'RM-12', names: ['Slot'], status: 'ok', sha: 's', mergeSha: 's',
      roots: [{ root: '/r', hitCount: 2 }, { root: '/q', hitCount: 0 }], hits: [{ path: '/r/a.tsx', count: 2 }],
      gh: { status: 'ok', files: 1 }, acknowledged: [] });
    expect(reshapeRecord(next)).toBe(next);
  });

  it('ghSearch greps each found source file and reports unfetchable ones as partial', () => {
    const gh = (args) => {
      if (args[0] === 'search') return JSON.stringify([
        { path: 'src/a.tsx', repository: { nameWithOwner: 'o/r' } },
        { path: 'README.md', repository: { nameWithOwner: 'o/r' } },
        { path: 'src/b.ts', repository: { nameWithOwner: 'o/r' } },
        { path: 'src/c.ts', repository: { nameWithOwner: 'o/r' } },
      ]);
      if (args.at(-1) === 'repos/o/r/contents/src/a.tsx') return "import { GlassWidget } from 'aura-glass';";
      if (args.at(-1) === 'repos/o/r/contents/src/b.ts') return 'export const unrelated = 1;';
      throw new Error('404');
    };
    expect(ghSearch(['GlassWidget'], { gh })).toEqual({ status: 'partial', files: 4, reason: '1 file(s) could not be fetched', hits: [{ path: 'gh:o/r/src/a.tsx', count: 1 }] });
    expect(ghSearch(['GlassWidget'], { gh: () => { throw new Error('no network'); } }).status).toBe('missing');
  });
});

describe('consumer-grep fixture tree', () => {
  it('scanRoot finds importing source files, prunes excluded dirs and ignores prose', () => {
    const root = mkdtempSync(join(tmpdir(), 'cg-scan-'));
    try {
      const put = (p, text) => { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), text); };
      put('app/page.tsx', "import {\n  GlassWidget,\n} from 'aura-glass';\nexport default () => <GlassWidget />;\n");
      put('app/other.ts', "import { Button } from 'aura-glass';\n");
      put('app/node_modules/x/index.js', "import { GlassWidget } from 'aura-glass';");
      put('app/dist/out.js', "import { GlassWidget } from 'aura-glass';");
      put('docs/notes.md', "import { GlassWidget } from 'aura-glass';");
      const res = scanRoot(root, ['GlassWidget']);
      expect(res.files).toBe(2);
      expect(res.hits).toEqual([{ path: join(root, 'app/page.tsx'), count: 2 }]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it('expandRoots: platforms/* checkouts except aura-glass itself; missing roots pass through', () => {
    const base = mkdtempSync(join(tmpdir(), 'cg-roots-'));
    try {
      for (const d of ['platforms/Meridian', 'platforms/AuraGlass', 'platforms/AuraGlass.wt', 'platforms/auraglass', 'platforms/demandgraph', 'AuraOne']) mkdirSync(join(base, d), { recursive: true });
      writeFileSync(join(base, 'platforms/file.txt'), '');
      expect(expandRoots([join(base, 'AuraOne'), join(base, 'platforms'), join(base, 'gone')]))
        .toEqual([join(base, 'AuraOne'), join(base, 'gone'), join(base, 'platforms/Meridian'), join(base, 'platforms/demandgraph')].sort());
    } finally { rmSync(base, { recursive: true, force: true }); }
  });

  const makeRoot = () => {
    const root = mkdtempSync(join(tmpdir(), 'cg-'));
    mkdirSync(join(root, 'scripts/removal'), { recursive: true });
    mkdirSync(join(root, 'docs/inventory'), { recursive: true });
    mkdirSync(join(root, 'docs/release/decisions/removals'), { recursive: true });
    cpSync(new URL('../../scripts/removal/consumer-grep.mjs', import.meta.url).pathname,
      join(root, 'scripts/removal/consumer-grep.mjs'));
    writeFileSync(join(root, 'docs/inventory/component-dispositions.md'), DOC);
    return root;
  };
  const run = (root, args) => execFileSync('node', ['scripts/removal/consumer-grep.mjs', ...args], { cwd: root, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, CI_MERGE_REQUEST_DIFF_BASE_SHA: '' } });

  it('bare --verify passes with good records, fails without one and on an unacknowledged hit', () => {
    const root = makeRoot();
    try {
      /* --verify loops every known family + on-disk record, so the fixture
         needs a record per FAMILY_PATHS key. */
      const write = (fam, extra = {}) => writeFileSync(join(root, `docs/release/decisions/removals/${fam}.json`), JSON.stringify(
        good(fam, fam === 'RM-02' ? ['GlassAiChat'] : fam === 'RM-11' ? ['GlassWidget'] : [], extra)));
      for (const fam of Object.keys(FAMILY_PATHS)) write(fam);
      expect(run(root, ['--verify'])).toContain('RM-02: record current');
      write('RM-11', { hits: [{ path: '/consumer/app.tsx', count: 1 }] });
      expect(() => run(root, ['--verify'])).toThrow(/RM-11: 1 consumer hit\(s\) without an owner acknowledgement/);
      write('RM-11', { hits: [{ path: '/consumer/app.tsx', count: 1 }], acknowledged: [{ path: '/consumer/app.tsx', via: '4.x-lts' }] });
      expect(run(root, ['--verify'])).toContain('RM-11: record current');
      rmSync(join(root, 'docs/release/decisions/removals/RM-02.json'));
      expect(() => run(root, ['--verify'])).toThrow(/no consumer-grep record for RM-02/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it('--write scans --roots, keeps acknowledgements of surviving hits and the removal sha; --verify --base enforces freshness', () => {
    const root = makeRoot();
    const consumer = mkdtempSync(join(tmpdir(), 'cg-consumer-'));
    try {
      writeFileSync(join(consumer, 'app.tsx'), "import { GlassWidget } from 'aura-glass';\n");
      const recPath = join(root, 'docs/release/decisions/removals/RM-11.json');
      writeFileSync(recPath, JSON.stringify({ family: 'RM-11', sha: 'rm11', mergeSha: 'rm11',
        acknowledged: [{ path: join(consumer, 'app.tsx'), via: 'codemod' }, { path: '/gone.tsx', via: 'codemod' }] }));
      run(root, ['--family', 'RM-11', '--roots', consumer, '--no-gh', '--write']);
      const rec = JSON.parse(readFileSync(recPath, 'utf8'));
      expect(rec).toMatchObject({ family: 'RM-11', sha: 'rm11', mergeSha: 'rm11', names: ['GlassWidget'], status: 'ok',
        hits: [{ path: join(consumer, 'app.tsx'), count: 1 }], acknowledged: [{ path: join(consumer, 'app.tsx'), via: 'codemod' }],
        roots: [{ root: consumer, files: 1, hitCount: 1 }], gh: { status: 'missing', reason: '--no-gh' } });
      expect(rec.scans).toBeUndefined();

      // freshness: make the fixture a git repo; a record scanned before the base fails once the PR touches RM-11
      const git = (...a) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { cwd: root, encoding: 'utf8' }).trim();
      git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'scan');
      const scan = git('rev-parse', '--short=9', 'HEAD');
      writeFileSync(join(root, 'later.txt'), 'x'); git('add', '-A'); git('commit', '-qm', 'base');
      const base = git('rev-parse', 'HEAD');
      writeFileSync(recPath, JSON.stringify({ ...rec, scanSha: scan, signoff: 'downstream scan separately' }));
      git('add', '-A'); git('commit', '-qm', 'pr');
      expect(() => run(root, ['--verify', '--family', 'RM-11', '--base', base])).toThrow(/older than the PR base/);
      writeFileSync(recPath, JSON.stringify({ ...rec, scanSha: git('rev-parse', '--short=9', 'HEAD'), signoff: 'downstream scan separately' }));
      expect(run(root, ['--verify', '--family', 'RM-11', '--base', base])).toContain('scanned at/after');
    } finally { rmSync(root, { recursive: true, force: true }); rmSync(consumer, { recursive: true, force: true }); }
  });
});
