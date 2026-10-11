/* @jest-environment node */
/* tests/deprecations/verify.test.ts — REQ-PLAT-25 (4.x side, REQ-FIN-33 / AC-FIN-33).
   scripts/release/verify-deprecations.mjs: one violating fixture per rule
   (each fails with its own message), the valid fixture passes, the
   --compare-branch rule in both directions, ref loading that evaluates
   computed fragment rows, and main() end to end on a hermetic temp repo.
   Fixtures are inline: tests/contract-doubles/** is CONTRACT-owned. */
import { describe, expect, it, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const VERIFY = join(ROOT, 'scripts/release/verify-deprecations.mjs');
const esm = (body: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `const m = await import(${JSON.stringify(VERIFY)}); ${body}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  .trim().split('\n').at(-1) as string);

const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

const OK = {
  id: 'DEP-P0101', kind: 'export', status: 'planned', entry: '.', symbol: 'GlassOld',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'Button', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: "GlassOld is renamed; import Button instead.", doc: '#dep-dep-p0101',
  stream: 'plat',
};
// Context of a 4.1.1 line: contract codemods, a canonical-names fixture dir,
// a snapshot in which GlassOld is exported from '.'.
const CTX = `{
  entriesManifest: ['.', './forms'], breakingIds: new Set(['B4']), version: '4.1.1',
  codemods: new Set(['canonical-names', 'removed']), codemodFixtures: new Set(['canonical-names']),
  exportsAt: (since, entry) => since === '4.0.0' ? null : new Set(entry === '.' ? ['GlassOld', 'Kept'] : []),
}`;
const check = (entries: object[]): string[] =>
  esm(`console.log(JSON.stringify(m.checkEntries(${JSON.stringify(entries)}, ${CTX})));`);

describe('checkEntries: one fixture per rule', () => {
  it('accepts the valid fixture', () => {
    expect(check([OK])).toEqual([]);
  });

  it.each<[string, Record<string, unknown> | null, RegExp]>([
    ['id shape', { id: 'DEP-X0001' }, /id must match DEP-\[PMCSQ\]/],
    ['duplicate id', null, /duplicate id/],
    ['id prefix vs stream', { stream: 'mat' }, /id prefix does not match stream 'mat' \(expected DEP-M####\)/],
    ['kind', { kind: 'module' }, /invalid kind 'module'/],
    ['status', { status: 'done' }, /invalid status 'done'/],
    ['4.x subpath', { entry: './nowhere' }, /entry '\.\/nowhere' is not a 4\.x subpath/],
    ['since is 4.x', { since: '5.0.0' }, /since '5\.0\.0' is not a 4\.x\.y version/],
    ['removeIn values', { removeIn: '7.0.0' }, /removeIn must be '5\.0\.0' or '6\.0\.0'/],
    ['removeIn later than since', { since: '6.1.0', removeIn: '6.0.0' }, /removeIn '6\.0\.0' must be later than since '6\.1\.0'/],
    ['5.0 removal needs a >=4.2 minor', { since: '4.1.1', status: 'active' }, /requires the deprecation to have shipped in a 4\.x minor >= 4\.2\.0/],
    ['active later than the line version', { status: 'active' }, /status 'active' but since '4\.2\.0' is later than the line version 4\.1\.1/],
    ['planned not later than the line version', { since: '4.1.1', exception: 'security', evidence: 'x' }, /status 'planned' but since '4\.1\.1' is not later than the line version 4\.1\.1/],
    ['codemod null needs manual/none', { codemod: null }, /codemod is null but automation is 'full'/],
    ['codemod in CORE ∪ AREA', { codemod: 'nope' }, /unknown codemod 'nope'/],
    ['codemod fixture directory', { codemod: 'removed' }, /codemod 'removed' has no fixture directory/],
    ['automation', { automation: 'magic' }, /invalid automation 'magic'/],
    ['breaking shape', { breaking: 'BX' }, /breaking 'BX' must be B<n>/],
    ['breaking in register', { breaking: 'B99' }, /breaking 'B99' is not in docs\/release\/breaking-changes\.json/],
    ['message length', { message: `Button ${'x'.repeat(200)}` }, /message is 207 chars \(> 200\)/],
    ['message names the replacement', { message: 'GlassOld is going away.' }, /message does not name the replacement 'Button'/],
    ['doc anchor', { doc: '#other' }, /doc '#other' must be a '#dep-\*' anchor/],
    ['exception value', { exception: 'vibes', evidence: 'x' }, /invalid exception 'vibes'/],
    ['exception evidence', { exception: 'security' }, /exception entries require evidence/],
    ['export in the since snapshot', { symbol: 'Gone', message: 'Gone is renamed; import Button instead.' }, /export 'Gone' is not in the 4\.2\.0 export snapshot of '\.'/],
    ['since snapshot exists', { since: '4.0.0', status: 'active', exception: 'security', evidence: 'x' }, /no export snapshot for 4\.0\.0 '\.'/],
  ])('%s', (_rule, patch, re) => {
    const entries = patch === null ? [OK, { ...OK }] : [{ ...OK, ...patch }];
    const errors = check(entries);
    expect(errors.join('\n')).toMatch(re);
    // The valid fixture alone stays clean, so the failure is caused by this patch.
    expect(check([OK])).toEqual([]);
  });

  it('a pre-release line (4.2.0-pre.0) ranks below 4.2.0: planned since 4.2.0 is valid, active is not', () => {
    const at = (version: string, entry: object): string[] =>
      esm(`console.log(JSON.stringify(m.checkEntries(${JSON.stringify([entry])}, { ...${CTX}, version: ${JSON.stringify(version)} })));`);
    expect(at('4.2.0-pre.0', OK)).toEqual([]);
    expect(at('4.2.0-pre.0', { ...OK, status: 'active' }).join('\n'))
      .toMatch(/status 'active' but since '4\.2\.0' is later than the line version 4\.2\.0-pre\.0/);
    expect(at('4.2.0', OK).join('\n'))
      .toMatch(/status 'planned' but since '4\.2\.0' is not later than the line version 4\.2\.0/);
  });

  it('cmpVersion follows SemVer pre-release precedence', () => {
    const r = esm(`console.log(JSON.stringify([
      m.cmpVersion('4.2.0', '4.2.0-pre.0'), m.cmpVersion('4.2.0-pre.0', '4.2.0'),
      m.cmpVersion('4.2.0-pre.2', '4.2.0-pre.10'), m.cmpVersion('4.2.0-pre.0', '4.2.0-pre.0'),
      m.cmpVersion('4.2.0-pre', '4.2.0-pre.0'), m.cmpVersion('4.2.0-1', '4.2.0-alpha'),
      m.cmpVersion('4.1.1', '4.2.0-pre.0'), m.cmpVersion('x', '4.2.0'),
    ].map((n) => (Number.isNaN(n) ? 'NaN' : Math.sign(n)))));`);
    expect(r).toEqual([1, -1, -1, 0, -1, -1, -1, 'NaN']);
  });

  it('exception entries may name subpaths outside ENTRIES', () => {
    expect(check([{ ...OK, entry: './gone', kind: 'subpath', symbol: '*', since: '4.1.1', status: 'active', exception: 'security', evidence: 'CVE-1' }])).toEqual([]);
  });
  it('manual automation allows codemod null', () => {
    expect(check([{ ...OK, codemod: null, automation: 'manual' }])).toEqual([]);
  });
});

describe('--compare-branch', () => {
  it('5x: an id of release/4.x removed or edited on next fails (append-only)', () => {
    const base = [OK, { ...OK, id: 'DEP-P0102' }];
    expect(esm(`console.log(JSON.stringify(m.checkCompareBranch(${JSON.stringify([OK])}, ${JSON.stringify(base)}, { line: '5x', ref: 'origin/release/4.x' })))`).join('\n'))
      .toMatch(/DEP-P0102: entry removed vs origin\/release\/4\.x/);
    expect(esm(`console.log(JSON.stringify(m.checkCompareBranch(${JSON.stringify([{ ...OK, since: '4.3.0' }])}, ${JSON.stringify([OK])}, { line: '5x' })))`).join('\n'))
      .toMatch(/field 'since' changed/);
    expect(esm(`console.log(JSON.stringify(m.checkCompareBranch(${JSON.stringify([OK, { ...OK, id: 'DEP-P0103' }])}, ${JSON.stringify([OK])}, { line: '5x' })))`)).toEqual([]);
  });
  it('4x: an id on this 4.x line that is absent on next fails', () => {
    const errs = esm(`console.log(JSON.stringify(m.checkCompareBranch(${JSON.stringify([OK, { ...OK, id: 'DEP-P0104' }])}, ${JSON.stringify([OK])}, { line: '4x', ref: 'origin/next' })))`);
    expect(errs).toEqual(['DEP-P0104: present on this 4.x line but absent on origin/next']);
  });
});

/** Hermetic git repo with the contract loader, one PLAT fragment and the inputs main() reads. */
function fixtureRepo(fragment: string): string {
  const t = mkdtempSync(join(tmpdir(), 'ag-verify-dep-repo-'));
  temps.push(t);
  const put = (rel: string, text: string) => { mkdirSync(dirname(join(t, rel)), { recursive: true }); writeFileSync(join(t, rel), text); };
  mkdirSync(join(t, 'src/contracts'), { recursive: true });
  cpSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(t, 'src/contracts/load-fragments.mjs'));
  cpSync(join(ROOT, 'src/contracts/fragments.ts'), join(t, 'src/contracts/fragments.ts'));
  symlinkSync(join(ROOT, 'node_modules'), join(t, 'node_modules'));
  put('package.json', JSON.stringify({ name: 'aura-glass', version: '4.1.1', exports: { '.': './dist/index.js' } }));
  put('docs/release/breaking-changes.json', JSON.stringify({ version: 1, items: [{ id: 'B4', title: 'Renames' }] }));
  put('etc/api/index.exports.json', JSON.stringify({ entry: '.', exports: ['GlassOld', 'GlassOlder'] }));
  put('fragments/codemods/plat/fixtures/canonical-names/basic/input.tsx', 'export {};\n');
  put('fragments/deprecations/plat.ts', fragment);
  const git = (...a: string[]) => execFileSync('git', a, { cwd: t, stdio: 'ignore' });
  git('init', '-q'); git('add', '-A');
  git('-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-qm', 'fixture');
  return t;
}
// A computed fragment (rows built with .map), as fragments/deprecations/plat.ts does on 4.x.
const computed = (names: string[]) => `import type { DeprecationFragment } from '../../src/contracts/fragments';
export default ${JSON.stringify(names)}.map((symbol, i) => ({
  id: \`DEP-P\${String(i + 101).padStart(4, '0')}\`, kind: 'export', status: 'planned', entry: '.', symbol,
  since: '4.2.0', removeIn: '5.0.0', replacement: 'Button', codemod: 'canonical-names', automation: 'full',
  breaking: 'B4', message: \`\${symbol} is renamed; import Button instead.\`, doc: \`#dep-\${symbol.toLowerCase()}\`,
})) satisfies DeprecationFragment;
`;
const mainIn = (root: string, args: string[]): number =>
  esm(`console.log(JSON.stringify(await m.main(${JSON.stringify(args)}, { root: ${JSON.stringify(root)} })));`);

describe('main() on a hermetic repo', () => {
  it('passes, fails on a rule violation, and loads computed rows from a git ref', () => {
    const t = fixtureRepo(computed(['GlassOld', 'GlassOlder']));
    expect(mainIn(t, ['--line', '4x'])).toBe(0);
    const fromRef = esm(`console.log(JSON.stringify((await m.loadEntriesForRef('HEAD', ${JSON.stringify(t)})).map((e) => e.id)))`);
    expect(fromRef).toEqual(['DEP-P0101', 'DEP-P0102']);
    // HEAD has both ids → 4x presence check passes.
    expect(mainIn(t, ['--line', '4x', '--compare-branch', 'HEAD'])).toBe(0);
    // A third row on the working tree that the ref (standing in for next) lacks.
    writeFileSync(join(t, 'fragments/deprecations/plat.ts'), computed(['GlassOld', 'GlassOlder', 'GlassOld']));
    expect(mainIn(t, ['--line', '4x', '--compare-branch', 'HEAD'])).toBe(1);
    // A symbol missing from the current export report violates the snapshot rule.
    writeFileSync(join(t, 'fragments/deprecations/plat.ts'), computed(['GlassOld', 'NotExported']));
    expect(mainIn(t, ['--line', '4x'])).toBe(1);
  });

  it('reads CORE_CODEMODS ∪ AREA_CODEMODS from the contract file', () => {
    const ids = esm(`console.log(JSON.stringify([...(await m.contractCodemods(${JSON.stringify(ROOT)}))].sort()))`);
    expect(ids).toEqual(['ai-chat', 'app-shell-slots', 'canonical-names', 'css-vars', 'dead-optical-props', 'deps',
      'imports-subpaths', 'media-backdrops', 'motion-imports', 'motion-props', 'prop-grammar', 'providers',
      'reduced-motion-initial', 'removed']);
  });

  it('snapshot resolver: published snapshot wins, current api report for unpublished since, null otherwise', () => {
    const t = fixtureRepo(computed(['GlassOld']));
    mkdirSync(join(t, 'etc/snapshots'), { recursive: true });
    writeFileSync(join(t, 'etc/snapshots/4.1.0.json'), JSON.stringify({ version: 1, entries: { '.': { runtime: ['A'], types: ['B'] } } }));
    const r = esm(`const at = m.snapshotResolver(${JSON.stringify(t)}, '4.1.1');
      const s = (v) => { const x = at(v, '.'); return x == null ? null : [...x].sort(); };
      console.log(JSON.stringify({ published: s('4.1.0'), current: s('4.1.1'), future: s('4.2.0'), missing: s('4.0.0') }))`);
    expect(r).toEqual({ published: ['A', 'B'], current: ['GlassOld', 'GlassOlder'], future: ['GlassOld', 'GlassOlder'], missing: null });
  });
});
