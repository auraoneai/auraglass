
/* REQ-FIN-10 4x port: missing-report error on >=4.2.0, tolerance-filtered
   cells, merged-set breaking lookup, optionalPeer install-level move. */
describe('REQ-FIN-10 classify-change (4x port)', () => {
  it('missing visual report errors on 4x >= 4.2.0 only', async () => {
    const { classify } = await import('../../scripts/release/classify-change.mjs');
    const base: any = { line: '4x', target: '4x-minor', visual: { status: 'missing-blocking', cells: [] }, changedFiles: [], version: '4.2.1' };
    expect(classify(base).errors.join(' ')).toContain('visual-class report missing on 4x >= 4.2.0');
    expect(classify({ ...base, version: '4.1.9' }).errors.join(' ')).not.toContain('visual-class report missing');
  });
  it('cells at/below changedRatio tolerance are filtered', async () => {
    const { visualClass } = await import('../../scripts/release/classify-change.mjs');
    const v = visualClass({ report: { cells: [{ id: 'a', changedRatio: 0.0005 }, { id: 'b', changedRatio: 0.001 }] }, line: '4x' });
    expect(v.status).toBe('clean');
  });
  it('dep -> optionalPeerDependencies is install-level (C-D-IL)', async () => {
    const { classify } = await import('../../scripts/release/classify-change.mjs');
    const r = classify({
      line: '4x', target: '4x-minor', changedFiles: [],
      packageDiff: {
        dependencies: { added: [], removed: ['zod'], changed: [] },
        optionalPeerDependencies: { added: ['zod'], removed: [], changed: [] },
      },
      deprecationsAdded: [{ id: 'DEP-P0020', kind: 'dependency', symbol: 'zod', breaking: 13, since: '4.3.0' }],
      version: '4.3.0',
      sources: { 'src/x.ts': "await import('zod') // [aura-glass] zod is now an optional peer" },
      doctorReport: { undeclared: [] }, releaseNotes: { firstList: ['zod …'] },
    } as any);
    expect(r.class).toBe('C-D-IL');
  });
});
