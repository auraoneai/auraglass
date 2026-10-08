/* @jest-environment node */
/* tests/deprecations/prior-deprecation.test.mjs — REQ-PLAT-28 (PLAT-192): prior-
   deprecation coverage — no entry -> uncovered; unpublished since -> uncovered;
   published -> covered; allow-listed exception -> covered; GA mode fails on
   uncovered. */
import { describe, expect, it } from '@jest/globals';
import { coverage } from '../../scripts/release/verify-breaking-register.mjs';
import { deprecationCoverage } from '../../scripts/release/classify-change.mjs';

const E = (o = {}) => ({
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', breaking: 'B4', ...o,
});

describe('prior-deprecation coverage (G-07)', () => {
  it('no covering entry -> uncovered', () => {
    const r = deprecationCoverage([{ entry: 'x', symbol: 'Ghost', breaking: 'B4' }], [], { published: { '4.2.0': [] } });
    expect(r.uncovered).toHaveLength(1);
  });
  it('since is a version npm cannot resolve (404) -> uncovered', () => {
    const r = deprecationCoverage([{ entry: '.', symbol: 'Old', breaking: 'B4' }],
      [E()], { published: { '4.3.0': ['DEP-P0001'] } });
    expect(r.uncovered).toHaveLength(1);
    expect(r.removals[0].verifiedIn).toBeNull();
  });
  it('since below 4.2.0 -> uncovered even when published', () => {
    const r = deprecationCoverage([{ entry: '.', symbol: 'Old', breaking: 'B4' }],
      [E({ since: '4.1.0' })], { published: { '4.1.0': ['DEP-P0001'] } });
    expect(r.uncovered).toHaveLength(1);
  });
  it('published 4.x minor >= 4.2.0 containing the id -> covered', () => {
    const r = deprecationCoverage([{ entry: '.', symbol: 'Old', breaking: 'B4' }],
      [E()], { published: { '4.2.0': ['DEP-P0001'] } });
    expect(r.uncovered).toHaveLength(0);
    expect(r.removals[0].verifiedIn).toBe('4.2.0');
  });
  it('entry coverage rows classify allow-listed exceptions as covered', () => {
    const c = coverage([E({ since: '4.1.0' })], { published: {}, allowlist: new Set(['DEP-P0001']), ga: true });
    expect(c.entries[0].coverage).toBe('covered');
    expect(c.entries[0].verifiedIn).toBe('exception');
    expect(c.uncoveredCount).toBe(0);
  });
  it('uncovered entries in GA mode surface as uncoveredCount (the gate fails)', () => {
    const c = coverage([E({ since: '4.3.0' })], { published: {}, allowlist: new Set(), ga: true });
    expect(c.ga).toBe(true);
    expect(c.uncoveredCount).toBe(1);
    expect(c.entries[0].coverage).toBe('uncovered');
  });
  it('coverage output shape is stable', () => {
    const c = coverage([E()], { published: { '4.2.0': ['DEP-P0001'] } });
    expect(c).toMatchObject({ version: 1, total: 1 });
    expect(c.entries[0]).toMatchObject({ id: 'DEP-P0001', kind: 'export', symbol: 'Old', removeIn: '5.0.0', coverage: 'covered' });
  });
});
