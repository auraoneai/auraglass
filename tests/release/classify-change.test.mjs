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
