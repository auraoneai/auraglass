/* @jest-environment node */
/* tests/release/classify-change.test.ts — REQ-PLAT-18/20/21/22: table-driven
   classification over every source plus the Multi-Family and visual-record rules. */
import { describe, expect, it } from '@jest/globals';
import {
  classify, deprecationCoverage, diffApiReports, diffPackageJson, diffSnapshots,
  parseChangesetBumps, parseCommitMarkers, visualClass,
} from '../../scripts/release/classify-change.mjs';

const M = (o = {}) => ({ hasBang: false, hasBreaking: false, multiFamily: [], ...o });

describe.each([
  ['no diffs at all', {}, 'C-I'],
  ['added public name', { apiDiffs: { 'a-cmp.button': { added: ['GlowButton'], removed: [] } } }, 'C-E'],
  ['removed public name', { apiDiffs: { 'a-cmp.button': { added: [], removed: ['Button'] } } }, 'C-B'],
  ['whole subpath removed (snapshot)', { snapshotDiff: { perEntry: { './ai': { removed: 'whole-entry', added: [] } }, entriesRemoved: ['./ai'], entriesAdded: [] } }, 'C-B'],
  ['snapshot names added', { snapshotDiff: { perEntry: { './theme': { added: ['newToken'], removed: [] } }, entriesRemoved: [], entriesAdded: [] } }, 'C-E'],
  ['deprecation entry added', { deprecationsAdded: [{ id: 'DEP-P0009', kind: 'export', breaking: 4, since: '4.2.0' }] }, 'C-D'],
  ['peer floor raised', { packageDiff: { peerDependencies: { added: [], removed: [], changed: ['react'] } } }, 'C-B'],
  ['engines floor raised', { packageDiff: { engines: { added: [], removed: [], changed: ['node'] } } }, 'C-B'],
  ['dependency removed without entry', { packageDiff: { dependencies: { added: [], removed: ['zod'], changed: [] } } }, 'C-B'],
  ['dependency removed with install-level entry', {
    packageDiff: { dependencies: { added: [], removed: ['zod'], changed: [] } },
    deprecationsAdded: [{ id: 'DEP-P0010', kind: 'dependency', symbol: 'zod', breaking: 13, since: '4.2.0' }],
    version: '4.2.0',
    sources: { 'src/x.ts': 'await import(\'zod\') // throw new Error("[aura-glass] zod is now an optional peer; install it: npm i zod")' },
    doctorReport: { undeclared: [] }, releaseNotes: { firstList: ['zod …'] },
  }, 'C-D-IL'],
  ['install-level entry w/o lazy loading -> C-B', {
    deprecationsAdded: [{ id: 'DEP-P0011', kind: 'dependency', symbol: 'zod', breaking: 13, since: '4.2.0' }],
    version: '4.2.0', sources: { 'src/x.ts': "import z from 'zod'" },
  }, 'C-B'],
  ['exports key added', { packageDiff: { exports: { added: ['./new'], removed: [], changed: [] } } }, 'C-E'],
  ['visual fix with record', { visual: { status: 'recorded', cells: [{ id: 'a' }], class: 'C-I-VF', record: 'slug.json' } }, 'C-I-VF'],
  ['visual change unrecorded on 4x', { visual: { status: 'unrecorded', cells: [{ id: 'a' }], class: 'C-B' }, line: '4x' }, 'C-B'],
  ['maps consumer w/o artifacts', { changedFiles: ['src/mapbox/store.ts'] }, 'C-E'],
  ['maps consumer with artifact', { changedFiles: ['src/mapbox/store.ts', 'dist-maps.tgz'] }, 'C-I'],
  ['contract surface touched', { changedFiles: ['src/contracts/fragments.ts'] }, 'C-B'],
])('classify → %s gives %s', (_name, inputs, want) => {
  it(`is ${want}`, () => {
    const r = classify({ markers: M(inputs.markers), ...inputs });
    expect(r.class).toBe(want);
    expect(Array.isArray(r.reasons)).toBe(true);
  });
});

describe('marker and target failures surface as errors', () => {
  it('C-B on 4.x minor fails the allowed table', () => {
    const r = classify({ line: '4x', changedFiles: ['src/contracts/x.ts'], markers: M() });
    expect(r.class).toBe('C-B');
    expect(r.errors.join('\n')).toMatch(/not allowed on 4x-minor/);
  });
  it('C-E on a 4.x patch fails', () => {
    const r = classify({ line: '4x', target: '4x-patch', apiDiffs: { 'a-cmp.button': { added: ['x'], removed: [] } }, markers: M() });
    expect(r.errors.join('\n')).toMatch(/not allowed on 4x-patch/);
  });
  it('exception deprecation entries stay allowed on a 4.x patch', () => {
    const r = classify({
      line: '4x', target: '4x-patch',
      deprecationsAdded: [{ id: 'DEP-P0001', kind: 'export', breaking: 2, since: '4.1.1', exception: 'security' }],
      markers: M(),
    });
    expect(r.errors).toEqual([]);
  });
  it('C-B on next pre-release without marker fails', () => {
    const r = classify({ changedFiles: ['src/contracts/x.ts'], markers: M() });
    expect(r.errors.join('\n')).toMatch(/no '!' or 'BREAKING CHANGE:'/);
  });
  it('C-B on next with ! marker passes', () => {
    const r = classify({ changedFiles: ['src/contracts/x.ts'], markers: M({ hasBang: true }) });
    expect(r.errors).toEqual([]);
  });
  it('changeset below floor fails', () => {
    const r = classify({
      apiDiffs: { 'a-cmp.button': { added: ['x'], removed: [] } },
      changesetBumps: ['patch'], markers: M(),
    });
    expect(r.errors.join('\n')).toMatch(/below the floor/);
  });
});

describe('Multi-Family trailer (REQ-PLAT-21)', () => {
  const removalsInput = {
    apiDiffs: {
      'a-cmp.button': { added: [], removed: ['Button'] },
      'a-surf.shell': { added: [], removed: ['AppShell'] },
    },
    deprecationsAdded: [
      { id: 'DEP-P0001', kind: 'export', symbol: 'Button', breaking: 4, since: '4.2.0' },
      { id: 'DEP-P0002', kind: 'export', symbol: 'AppShell', breaking: 9, since: '4.2.0' },
    ],
    markers: M({ hasBang: true }),
  };
  it('removals across two breaking groups without the trailer fail', () => {
    const r = classify(removalsInput);
    expect(r.errors.join('\n')).toMatch(/Multi-Family/);
  });
  it('the trailer satisfies the rule', () => {
    const r = classify({ ...removalsInput, markers: M({ hasBang: true, multiFamily: ['one sweep PR'] }) });
    expect(r.errors).toEqual([]);
  });
  it('a single breaking group needs no trailer', () => {
    const r = classify({
      apiDiffs: { 'a-cmp.button': { added: [], removed: ['Button'] } },
      deprecationsAdded: [{ id: 'DEP-P0001', kind: 'export', symbol: 'Button', breaking: 4, since: '4.2.0' }],
      markers: M({ hasBang: true }),
    });
    expect(r.errors).toEqual([]);
  });
});

describe('helper units', () => {
  it('diffPackageJson isolates tracked keys only', () => {
    const d = diffPackageJson(
      JSON.stringify({ version: '4.1.0', dependencies: { zod: '^3' }, scripts: { x: 'y' } }),
      JSON.stringify({ version: '4.1.0', dependencies: {}, scripts: { x: 'z' }, peerDependencies: { react: '^19' } }),
    );
    expect(d.dependencies.removed).toEqual(['zod']);
    expect(d.scripts).toBeUndefined();
  });
  it('parseCommitMarkers finds !, BREAKING CHANGE and Multi-Family', () => {
    const m = parseCommitMarkers('refactor(5.0)!: remove server\n\nBREAKING CHANGE: gone\nMulti-Family: sweep\n');
    expect(m.hasBang).toBe(true); expect(m.hasBreaking).toBe(true); expect(m.multiFamily).toEqual(['sweep']);
  });
  it('parseChangesetBumps reads frontmatter', () => {
    expect(parseChangesetBumps(['---\n"aura-glass": minor\n---\ntext'])).toEqual(['minor']);
  });
  it('visualClass: clean/absent/recorded/unrecorded', () => {
    expect(visualClass({ report: null, line: '4x' }).status).toBe('missing-blocking');
    expect(visualClass({ report: null, line: '5x' }).status).toBe('pending');
    expect(visualClass({ report: { cells: [] }, recordFiles: [] }).status).toBe('clean');
    const un = visualClass({ report: { cells: [{ id: 'c1', changedRatio: 0.02 }] }, recordFiles: [], line: '4x' });
    expect(un.status).toBe('unrecorded'); expect(un.class).toBe('C-B');
  });
  it('deprecationCoverage verifies published 4.x minors >= 4.2.0', () => {
    const cov = deprecationCoverage(
      [{ entry: 'a-cmp.button', symbol: 'Button', breaking: 4 }],
      [{ id: 'DEP-P0001', symbol: 'Button', since: '4.2.0' }],
      { published: { '4.2.0': ['DEP-P0001'], '4.1.0': [] } },
    );
    expect(cov.removals[0]?.verifiedIn).toBe('4.2.0');
    const miss = deprecationCoverage([{ entry: 'x', symbol: 'Old', breaking: 4 }],
      [{ id: 'DEP-P0002', symbol: 'Old', since: '4.1.0' }], { published: { '4.1.0': ['DEP-P0002'] } });
    expect(miss.uncovered).toHaveLength(1);
  });
});

/* REQ-FIN-10 deltas: tolerance-filtered cells, 4x >=4.2.0 missing-report
   error, merged-set breaking lookup, optionalPeer install-level move, trimmed
   CONTRACT_SURFACE, head-only Multi-Family trailer. */
describe('REQ-FIN-10 classify-change', () => {
  it('cells at/below changedRatio tolerance are filtered', () => {
    const v = visualClass({ report: { cells: [{ id: 'a', changedRatio: 0.0005 }, { id: 'b', changedRatio: 0.001 }] }, line: '5x' });
    expect(v.status).toBe('clean');
    expect(v.cells).toHaveLength(0);
  });
  it('cells above tolerance need a record (5x) / classify C-B (4x)', () => {
    const rep = { cells: [{ id: 'a', changedRatio: 0.01 }] };
    expect(visualClass({ report: rep, line: '5x' }).status).toBe('unrecorded');
    expect(visualClass({ report: rep, line: '4x' }).class).toBe('C-B');
  });
  it('missing visual report errors on 4x >= 4.2.0 only', () => {
    const base = { line: '4x', target: '4x-minor', markers: M(), visual: { status: 'missing-blocking', cells: [] }, changedFiles: [], version: '4.2.1' };
    expect(classify(base).errors.join(' ')).toContain('visual-class report missing on 4x >= 4.2.0');
    expect(classify({ ...base, version: '4.1.9' }).errors.join(' ')).not.toContain('visual-class report missing');
  });
  it('dep -> optionalPeerDependencies is an install-level move (C-D-IL), not C-B', () => {
    const r = classify({
      markers: M(), line: '4x', target: '4x-minor',
      packageDiff: {
        dependencies: { added: [], removed: ['zod'], changed: [] },
        optionalPeerDependencies: { added: ['zod'], removed: [], changed: [] },
      },
      deprecationsAdded: [{ id: 'DEP-P0020', kind: 'dependency', symbol: 'zod', breaking: 13, since: '4.3.0' }],
      version: '4.3.0',
      sources: { 'src/x.ts': "await import('zod') // [aura-glass] zod is now an optional peer" },
      doctorReport: { undeclared: [] }, releaseNotes: { firstList: ['zod …'] },
    });
    expect(r.class).toBe('C-D-IL');
  });
  it('breaking group lookup uses the merged base+HEAD set (deprecationsAll)', () => {
    const r = classify({
      markers: M({ multiFamily: ['separate concerns'] }),
      apiDiffs: { a: { added: [], removed: ['X', 'Y'] } },
      deprecationsAdded: [],
      deprecationsAll: [
        { id: 'DEP-OLD1', kind: 'export', symbol: 'X', breaking: 3, since: '4.1.0' },
        { id: 'DEP-OLD2', kind: 'export', symbol: 'Y', breaking: 3, since: '4.1.0' },
      ],
    });
    // both removals resolve to breaking group 3 — one group, trailer not required
    expect(r.errors.join(' ')).not.toContain('Multi-Family');
    expect(r.removals.every((x) => x.breaking === 3)).toBe(true);
  });
  it('src/index.ts / src/root / src/compat / deprecations.json diffs are not contract-surface hits', () => {
    const r = classify({ markers: M(), changedFiles: ['src/index.ts', 'src/root/x.ts', 'src/compat/mat/y.ts', 'deprecations.json'] });
    expect(r.class).toBe('C-I');
    const hit = classify({ markers: M(), changedFiles: ['src/contracts/preferences.ts'] });
    expect(hit.class).toBe('C-B');
  });
});

/* ------------------------------------------------------------------------
   REQ-PLAT-19/20/21/23 + REQ-SURF-75: real inputs. Fragments are parsed (not
   regex-scanned), visual-fix records are schema-checked and matched per
   record, DOM-part contract changes classify, and main() runs end-to-end over
   temporary git repositories. */
import { execFileSync } from 'node:child_process';
import { mkdirSync as mkdirP, mkdtempSync, readFileSync as readF, rmSync, writeFileSync as writeF } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname as dirOf, join as joinP } from 'node:path';
import { jest } from '@jest/globals';
import {
  deprecationSets, diffDomContract, domContractDiffs, isDefaultModeCell, loadDeprecationsAt, main,
  validateVisualRecord,
} from '../../scripts/release/classify-change.mjs';

describe('deprecation fragments are parsed for real (REQ-PLAT-19/21)', () => {
  it('loads every committed fragment entry at HEAD with symbol and breaking Bnn', async () => {
    const rows = await loadDeprecationsAt('HEAD');
    expect(rows.length).toBeGreaterThan(400);
    const withBreaking = rows.filter((e) => /^B\d+$/.test(String(e.breaking)));
    expect(withBreaking.length).toBeGreaterThan(400);
    // plat.ts builds its ids with .map() — unreachable for any regex scan
    expect(rows.find((e) => e.id === 'DEP-P0001')).toMatchObject({ kind: 'export', entry: '.', breaking: 'B14', since: '4.1.1' });
    expect(rows.filter((e) => e.symbol).length).toBeGreaterThan(400);
  });
  it('base and HEAD are loaded at their own refs', async () => {
    const seen = [];
    const s = await deprecationSets('BASE', {
      load: async (ref) => { seen.push(ref); return ref === 'HEAD' ? [{ id: 'DEP-X1', symbol: 'A', breaking: 'B1' }, { id: 'DEP-X2', symbol: 'B', breaking: 'B2' }] : [{ id: 'DEP-X1', symbol: 'A', breaking: 'B1' }]; },
    });
    expect(seen).toEqual(['HEAD', 'BASE']);
    expect(s.added.map((e) => e.id)).toEqual(['DEP-X2']);
    expect(s.all.map((e) => e.id)).toEqual(['DEP-X1', 'DEP-X2']);
  });
});

describe('visual-fix records (REQ-PLAT-20)', () => {
  const cell = (c, ratio = 0.02) => ({ cell: c, changedRatio: ratio, changed: true });
  const A = 'button--states|photo|chromium|scheme=dark,viewport=1440x900';
  const B = 'card--default|photo|chromium|scheme=light,viewport=390x844';
  const rec = (o = {}) => ({ file: 'docs/release/visual-fixes/x.json', data: { id: 'D-28-dark-text', cells: [A], compositeArtifact: 'https://ci.example/artifacts/composite.png', ...o } });
  it('default-mode filter: chromium, light/dark, 1440x900/390x844, preview v5 excluded', () => {
    expect(isDefaultModeCell(cell(A))).toBe(true);
    expect(isDefaultModeCell(cell('x|photo|webkit|scheme=dark'))).toBe(false);
    expect(isDefaultModeCell(cell('x|photo|chromium|scheme=dark,viewport=1024x768'))).toBe(false);
    expect(isDefaultModeCell(cell('x|photo|chromium|scheme=dark,preview=v5'))).toBe(false);
    expect(isDefaultModeCell(cell('x|photo|chromium|scheme=high-contrast'))).toBe(false);
  });
  it('changed cell with no record -> C-B on 4x', () => {
    const v = visualClass({ report: { cells: [cell(A)] }, records: [], line: '4x' });
    expect(v.class).toBe('C-B');
  });
  it('record listing a different cell -> C-B and a mismatch error', () => {
    const v = visualClass({ report: { cells: [cell(A)] }, records: [rec({ cells: [B] })], line: '4x' });
    expect(v.class).toBe('C-B');
    expect(v.recordErrors.join(' ')).toMatch(/do not match/);
  });
  it('matching record -> C-I-VF', () => {
    const v = visualClass({ report: { cells: [cell(A)] }, records: [rec()], line: '4x' });
    expect(v.class).toBe('C-I-VF');
    expect(v.record).toBe('docs/release/visual-fixes/x.json');
  });
  it('records are matched one by one, never accumulated across files', () => {
    const v = visualClass({ report: { cells: [cell(A), cell(B)] }, records: [rec({ cells: [A] }), rec({ file: 'y.json', cells: [B] })], line: '4x' });
    expect(v.class).toBe('C-B');
  });
  it('preview-v5 and non-default cells are ignored', () => {
    const v = visualClass({ report: { cells: [cell('x|photo|chromium|scheme=dark,preview=v5'), cell('x|photo|firefox|scheme=dark')] }, records: [], line: '4x' });
    expect(v.status).toBe('clean');
    expect(v.excluded).toBe(2);
  });
  it('schema: id enum, cells[], compositeArtifact present', () => {
    expect(validateVisualRecord(rec().data)).toEqual([]);
    expect(validateVisualRecord(rec({ compositeArtifact: undefined }).data).join(' ')).toMatch(/compositeArtifact/);
    expect(validateVisualRecord(rec({ id: 'whatever' }).data).join(' ')).toMatch(/id 'whatever'/);
    expect(validateVisualRecord(rec({ id: 'DEP-P0001' }).data, { exceptionIds: ['DEP-P0001'] })).toEqual([]);
    expect(validateVisualRecord(rec({ cells: [] }).data).join(' ')).toMatch(/cells/);
    expect(validateVisualRecord(rec({ compositeArtifact: 'artifacts/c.png' }).data, { artifactExists: () => false }).join(' ')).toMatch(/does not exist/);
  });
  it('missing compositeArtifact fails the gate', () => {
    const v = visualClass({ report: { cells: [cell(A)] }, records: [rec({ compositeArtifact: '' })], line: '4x' });
    const r = classify({ visual: v, line: '4x', markers: M(), version: '4.2.0' });
    expect(r.errors.join(' ')).toMatch(/compositeArtifact/);
  });
  it('5x: informational before GA, C-B from 5.0.0', () => {
    expect(visualClass({ report: { cells: [cell(A)] }, records: [], line: '5x', version: '5.0.0-alpha.3' }).class).toBeNull();
    expect(visualClass({ report: { cells: [cell(A)] }, records: [], line: '5x', version: '5.0.0' }).class).toBe('C-B');
  });
});

describe('DOM-part contract changes (REQ-SURF-75)', () => {
  const snapFile = (parts) => `it('x', () => { expect(f()).toMatchInlineSnapshot(\`\n  [\n${parts.map((p) => `    "${p}",`).join('\n')}\n  ]\n\`); });\n`;
  it('a changed dom-contract inline snapshot is C-B', () => {
    const d = diffDomContract('src/data/table/Table.dom-contract.test.tsx', snapFile(['root', 'table-row']), snapFile(['root', 'table-line']));
    expect(d.changed).toHaveLength(1);
    expect(classify({ domDiffs: [d], markers: M({ hasBang: true }) }).class).toBe('C-B');
  });
  it('re-indented but identical snapshots are no change', () => {
    const d = diffDomContract('src/a/A.dom-contract.test.tsx', snapFile(['root']), snapFile(['root']).replace(/ {4}"/g, '      "'));
    expect(d.changed).toEqual([]); expect(d.added).toEqual([]);
  });
  it('removed meta.parts is C-B, added parts are C-E', () => {
    const meta = (p) => `export const meta = { name: 'Table', parts: [${p.map((x) => `'${x}'`).join(', ')}], states: [] };\n`;
    const rm = diffDomContract('src/data/table/Table.meta.ts', meta(['root', 'table-row']), meta(['root']));
    expect(rm.removed).toEqual(['table-row']);
    expect(classify({ domDiffs: [rm], markers: M({ hasBang: true }) }).class).toBe('C-B');
    const add = diffDomContract('src/data/table/Table.meta.ts', meta(['root']), meta(['root', 'table-row']));
    expect(classify({ domDiffs: [add], markers: M() }).class).toBe('C-E');
  });
  it('.snap files compare by snapshot name', () => {
    const snap = (body) => `exports[\`overlay parts 1\`] = \`${body}\`;\n`;
    const d = diffDomContract('src/x/__snapshots__/overlay-dom-contract.test.tsx.snap', snap('a'), snap('b'));
    expect(d.changed).toEqual(['overlay parts 1']);
  });
  it('only DOM-contract and meta files are inspected', () => {
    const read = jest.fn(() => ['a', 'b']);
    expect(domContractDiffs(['src/x.ts', 'README.md'], { read })).toEqual([]);
    expect(read).not.toHaveBeenCalled();
  });
});

// --------------------------------------------------------- main() temp repos ---
const GIT_ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
function tempRepo({ version = '5.0.0-alpha.1', fragments = [], rootExports = ['Alpha', 'Beta'] } = {}) {
  const dir = mkdtempSync(joinP(tmpdir(), 'classify-repo-'));
  const g = (...args) => execFileSync('git', args, { cwd: dir, env: GIT_ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const write = (rel, text) => { mkdirP(dirOf(joinP(dir, rel)), { recursive: true }); writeF(joinP(dir, rel), text); };
  const frag = (rows) => `import type { DeprecationFragment } from '../../src/contracts/fragments';\nconst rows = ${JSON.stringify(rows, null, 2)};\nexport default rows satisfies DeprecationFragment;\n`;
  const api = (names) => `${JSON.stringify({ entry: '.', exports: names, unanalysable: [] }, null, 1)}\n`;
  g('init', '-q', '-b', 'base');
  write('package.json', `${JSON.stringify({ name: 'aura-glass', version, exports: { '.': { types: './dist/index.d.ts', import: './dist/index.mjs' } } }, null, 2)}\n`);
  write('fragments/deprecations/plat.ts', frag(fragments));
  write('etc/api/root.exports.json', api(rootExports));
  g('add', '-A'); g('commit', '-q', '-m', 'chore: base');
  g('checkout', '-q', '-b', 'pr');
  const commit = (msg) => { g('add', '-A'); g('commit', '-q', '--allow-empty', '-m', msg); };
  const run = async (extra = [], opts = {}) => {
    const out = joinP(dir, '.artifacts/out.json');
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      const code = await main(['--base', 'base', '--out', out, ...extra], { cwd: dir, env: {}, ...opts });
      return { code, result: JSON.parse(readF(out, 'utf8')) };
    } finally { err.mockRestore(); log.mockRestore(); }
  };
  return { dir, g, write, frag, api, commit, run, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}
const dep = (o) => ({ kind: 'export', status: 'planned', entry: '.', since: '4.2.0', removeIn: '5.0.0', replacement: null, codemod: null, automation: 'none', message: 'm', doc: '#d', ...o });

describe('main() over a temporary git repo', () => {
  it('root export added -> C-E, exit 0', async () => {
    const r = tempRepo();
    try {
      r.write('etc/api/root.exports.json', r.api(['Alpha', 'Beta', 'Gamma']));
      r.commit('feat: add Gamma');
      const { code, result } = await r.run(['--no-real-snapshots']);
      expect(result.class).toBe('C-E');
      expect(result.perEntry.root.added).toEqual(['Gamma']);
      expect(code).toBe(0);
    } finally { r.cleanup(); }
  });

  it('a fragment entry added -> C-D with the parsed entry', async () => {
    const r = tempRepo({ fragments: [dep({ id: 'DEP-P0101', symbol: 'Alpha', breaking: 'B4' })] });
    try {
      r.write('fragments/deprecations/plat.ts', r.frag([
        dep({ id: 'DEP-P0101', symbol: 'Alpha', breaking: 'B4' }),
        // key order differs from the first row: breaking after since, before kind
        { id: 'DEP-P0102', since: '4.2.0', breaking: 'B7', kind: 'export', symbol: 'Beta', entry: '.', status: 'planned', removeIn: '5.0.0', replacement: null, codemod: null, automation: 'none', message: 'm', doc: '#d' },
      ]));
      r.commit('feat: deprecate Beta');
      const { code, result } = await r.run(['--no-real-snapshots']);
      expect(result.class).toBe('C-D');
      expect(result.deprecationsAdded.map((e) => [e.id, e.breaking, e.symbol])).toEqual([['DEP-P0102', 'B7', 'Beta']]);
      expect(code).toBe(0);
    } finally { r.cleanup(); }
  });

  describe('Multi-Family trailer (REQ-PLAT-21)', () => {
    const setup = () => tempRepo({
      fragments: [dep({ id: 'DEP-P0201', symbol: 'Alpha', breaking: 'B4' }), dep({ id: 'DEP-P0202', symbol: 'Beta', breaking: 'B9' })],
      rootExports: ['Alpha', 'Beta', 'Keep'],
    });
    it('removals from two breaking groups without the trailer -> exit 1', async () => {
      const r = setup();
      try {
        r.write('etc/api/root.exports.json', r.api(['Keep']));
        r.commit('refactor!: remove Alpha and Beta');
        const { code, result } = await r.run(['--no-real-snapshots']);
        expect(result.class).toBe('C-B');
        expect(result.removals.map((x) => x.breaking).sort()).toEqual(['B4', 'B9']);
        expect(result.errors.join(' ')).toMatch(/Multi-Family/);
        expect(code).toBe(1);
      } finally { r.cleanup(); }
    });
    it('the trailer on the head commit -> exit 0', async () => {
      const r = setup();
      try {
        r.write('etc/api/root.exports.json', r.api(['Keep']));
        r.commit('refactor!: remove Alpha and Beta\n\nMulti-Family: one sweep for the alpha cut');
        const { code, result } = await r.run(['--no-real-snapshots']);
        expect(result.errors).toEqual([]);
        expect(code).toBe(0);
      } finally { r.cleanup(); }
    });
    it('a trailer on a non-head commit does not count -> exit 1', async () => {
      const r = setup();
      try {
        r.write('etc/api/root.exports.json', r.api(['Keep']));
        r.commit('refactor!: remove Alpha and Beta\n\nMulti-Family: earlier commit');
        r.commit('chore: follow-up');
        const { code, result } = await r.run(['--no-real-snapshots']);
        expect(result.errors.join(' ')).toMatch(/Multi-Family/);
        expect(code).toBe(1);
      } finally { r.cleanup(); }
    });
  });

  describe('visual-fix records through main() on 4x (REQ-PLAT-20)', () => {
    const A = 'button--states|photo|chromium|scheme=dark,viewport=1440x900';
    const B = 'card--default|photo|chromium|scheme=light,viewport=390x844';
    const report = (cells) => `${JSON.stringify({ version: 1, sha: 'h', base: 'b', changedCount: cells.length, cells: cells.map((c) => ({ cell: c, changedRatio: 0.05, changed: true })) })}\n`;
    const record = (o = {}) => `${JSON.stringify({ id: 'D-28-dark-text', cells: [A], compositeArtifact: 'https://ci.example/composite.png', ...o }, null, 2)}\n`;
    const setup = () => {
      const r = tempRepo({ version: '4.2.1' });
      r.write('.gitignore', '.artifacts/\n'); r.commit('chore: ignore artifacts');
      r.write('.artifacts/plat/plat-test-visual-4x/visual-class.json', report([A]));
      return r;
    };
    const run4x = (r) => r.run(['--line', '4x', '--no-real-snapshots']);
    it('changed cell without a record fails', async () => {
      const r = setup();
      try { r.commit('fix: darker text'); const { code, result } = await run4x(r); expect(result.class).toBe('C-B'); expect(code).toBe(1); } finally { r.cleanup(); }
    });
    it('a record listing a different cell fails', async () => {
      const r = setup();
      try {
        r.write('docs/release/visual-fixes/dark-text.json', record({ cells: [B] })); r.commit('fix: darker text');
        const { code, result } = await run4x(r);
        expect(result.class).toBe('C-B'); expect(code).toBe(1);
      } finally { r.cleanup(); }
    });
    it('a matching record added by the PR passes as C-I-VF', async () => {
      const r = setup();
      try {
        r.write('docs/release/visual-fixes/dark-text.json', record()); r.commit('fix: darker text');
        const { code, result } = await run4x(r);
        expect(result.class).toBe('C-I-VF');
        expect(result.visual.record).toBe('docs/release/visual-fixes/dark-text.json');
        expect(code).toBe(0);
      } finally { r.cleanup(); }
    });
    it('a record already on the base branch does not count', async () => {
      const r = tempRepo({ version: '4.2.1' });
      try {
        r.g('checkout', '-q', 'base');
        r.write('.gitignore', '.artifacts/\n');
        r.write('docs/release/visual-fixes/old.json', record()); r.commit('fix: old record');
        r.g('checkout', '-q', '-B', 'pr');
        r.write('.artifacts/plat/plat-test-visual-4x/visual-class.json', report([A]));
        r.commit('fix: darker text again');
        const { code, result } = await run4x(r);
        expect(result.class).toBe('C-B'); expect(code).toBe(1);
      } finally { r.cleanup(); }
    });
    it('a preview-v5 cell is ignored', async () => {
      const r = setup();
      try {
        r.write('.artifacts/plat/plat-test-visual-4x/visual-class.json', report(['x|photo|chromium|scheme=dark,preview=v5']));
        r.commit('fix: preview only');
        const { code, result } = await run4x(r);
        expect(result.visual.status).toBe('clean'); expect(result.class).toBe('C-I'); expect(code).toBe(0);
      } finally { r.cleanup(); }
    });
    it('a record without compositeArtifact fails', async () => {
      const r = setup();
      try {
        r.write('docs/release/visual-fixes/dark-text.json', record({ compositeArtifact: undefined })); r.commit('fix: darker text');
        const { code, result } = await run4x(r);
        expect(result.errors.join(' ')).toMatch(/compositeArtifact/); expect(code).toBe(1);
      } finally { r.cleanup(); }
    });
  });

  it('a DOM-part snapshot change through main() is C-B (REQ-SURF-75)', async () => {
    const t = (p) => `it('parts', () => { expect(parts()).toMatchInlineSnapshot(\`\n  [\n    "${p}",\n  ]\n\`); });\n`;
    const r = tempRepo();
    try {
      r.g('checkout', '-q', 'base');
      r.write('src/data/table/Table.dom-contract.test.tsx', t('table-row')); r.commit('test: dom contract');
      r.g('checkout', '-q', '-B', 'pr');
      r.write('src/data/table/Table.dom-contract.test.tsx', t('table-line')); r.commit('refactor!: rename table-row part');
      const { code, result } = await r.run(['--no-real-snapshots']);
      expect(result.class).toBe('C-B');
      expect(result.domContract).toEqual([{ file: 'src/data/table/Table.dom-contract.test.tsx', kind: 'dom-snapshot', removed: 0, changed: 1, added: 0 }]);
      expect(code).toBe(0); // '!' marker present on next
    } finally { r.cleanup(); }
  });

  describe('export snapshots are real by default (REQ-PLAT-23 item 8)', () => {
    const snap = (names) => `${JSON.stringify({ version: 1, package: 'aura-glass@x', entries: { '.': { kind: 'module', runtime: names, require: [], types: names } } })}\n`;
    it('--base-snapshot/--head-snapshot diff: a removed runtime name is C-B', async () => {
      const r = tempRepo();
      try {
        r.write('.snaps/base.json', snap(['Alpha', 'Beta'])); r.write('.snaps/head.json', snap(['Alpha']));
        r.commit('refactor!: drop Beta');
        const { result } = await r.run(['--base-snapshot', '.snaps/base.json', '--head-snapshot', '.snaps/head.json']);
        expect(result.snapshots.status).toBe('diffed');
        expect(result.class).toBe('C-B');
        expect(result.perEntry['.'].removed).toEqual(['Beta']);
      } finally { r.cleanup(); }
    });
    it('a non-tag base with no tarball is reported unavailable; --require-snapshots fails', async () => {
      const r = tempRepo();
      try {
        r.commit('chore: nothing');
        const soft = await r.run([]);
        expect(soft.result.snapshots.status).toBe('unavailable');
        expect(soft.result.snapshots.reasons.join(' ')).toMatch(/not a release tag/);
        expect(soft.code).toBe(0);
        const hard = await r.run(['--require-snapshots']);
        expect(hard.code).toBe(1);
        expect(hard.result.errors.join(' ')).toMatch(/export-snapshot diff required/);
      } finally { r.cleanup(); }
    });
    it('a tag base uses etc/snapshots/<version>.json and the head tarball', async () => {
      const r = tempRepo({ version: '4.2.0' });
      try {
        r.g('tag', 'v4.2.0', 'base');
        r.write('etc/snapshots/4.2.0.json', snap(['Alpha', 'Beta']));
        r.write('.artifacts/pack/aura-glass-4.2.1.tgz', 'tgz');
        r.commit('feat: add Gamma');
        const snapshotter = { snapshotTarball: jest.fn(() => ({ json: snap(['Alpha', 'Beta', 'Gamma']) })), snapshotPublished: jest.fn() };
        const { code, result } = await r.run(['--line', '4x', '--target', '4x-minor'], { snapshotter });
        expect(snapshotter.snapshotTarball).toHaveBeenCalledTimes(1);
        expect(snapshotter.snapshotPublished).not.toHaveBeenCalled();
        expect(result.snapshots).toMatchObject({ status: 'diffed', base: 'etc/snapshots/4.2.0.json', head: '.artifacts/pack/aura-glass-4.2.1.tgz' });
        expect(result.class).toBe('C-E');
        expect(code).toBe(1); // 4x >= 4.2.0 without a visual-class report
        expect(result.errors.join(' ')).toMatch(/visual-class report missing/);
      } finally { r.cleanup(); }
    });
    it('a tag base without a committed snapshot packs the published tarball', async () => {
      const r = tempRepo({ version: '4.2.0' });
      try {
        r.g('tag', 'v4.2.0', 'base');
        r.commit('chore: nothing');
        const snapshotter = { snapshotTarball: jest.fn(() => ({ json: snap(['Alpha']) })), snapshotPublished: jest.fn(() => ({ json: snap(['Alpha']) })) };
        const { result } = await r.run(['--head-tarball', 'package.json'], { snapshotter });
        expect(snapshotter.snapshotPublished).toHaveBeenCalledWith('4.2.0', expect.anything());
        expect(result.snapshots.base).toBe('aura-glass@4.2.0');
      } finally { r.cleanup(); }
    });
  });
});

describe('deprecationCoverage is aligned with lib/deprecation-coverage (REQ-PLAT-28)', () => {
  it('matches exact symbols only (no substring coverage) and honours the allowlist', () => {
    const cov = deprecationCoverage(
      [{ entry: 'root', symbol: 'GlassButtonGroup' }, { entry: 'root', symbol: 'Old' }],
      [{ id: 'DEP-C1', symbol: 'GlassButton', since: '4.2.0' }, { id: 'DEP-P1', symbol: 'Old', since: '4.1.1', exception: 'honesty' }],
      { published: { '4.2.0': ['DEP-C1'] }, allowlist: new Set(['DEP-P1']) },
    );
    expect(cov.removals.find((x) => x.symbol === 'GlassButtonGroup').coveringEntry).toBeNull();
    expect(cov.removals.find((x) => x.symbol === 'Old').verifiedIn).toBe('exception');
    expect(cov.uncovered.map((x) => x.symbol)).toEqual(['GlassButtonGroup']);
  });
});
