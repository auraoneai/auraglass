/**
 * @jest-environment node
 */
/* tests/docs/tsdoc-coverage.test.ts — PLAT-379 (REQ-PLAT-100, REQ-FIN-43, AC-FIN-43).
   Every public prop of an exported component needs TSDoc: 100 % on T0/T1,
   ≥95 % on T2 before RC and 100 % from RC. The only escape is the expiring
   baseline scripts/integration/baselines/tsdoc-coverage.json (§4.3 rule 3):
   a row excuses one prop until RC-1, and a stale or expired row fails. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import {
  buildReference, readTsdocBaseline, run, tsdocCoverage, tsdocThreshold, TSDOC_BASELINE,
} from '../../scripts/docs/gen-component-docs.mjs';
import { makeFixture, type Fixture, type FixtureComponent } from './helpers/reference-fixture';

const root = join(__dirname, '..', '..');
const quiet = { log: () => {}, error: () => {} };
const fixtures: Fixture[] = [];
const fixture = (components: FixtureComponent[], opts?: Parameters<typeof makeFixture>[1]) => {
  const f = makeFixture(components, opts); fixtures.push(f); return f;
};
afterAll(() => fixtures.forEach((f) => f.cleanup()));

const documented: FixtureComponent = {
  name: 'Widget', dir: 'widget', tier: 'T1',
  props: [
    { name: 'label', type: 'string', doc: 'Visible label.' },
    { name: 'size', type: "'sm' | 'md'", optional: true, doc: 'Control size.', default: "'md'" },
  ],
};
const withSeeded = (c: FixtureComponent): FixtureComponent => ({
  ...c, props: [...c.props, { name: 'seeded', type: 'boolean', optional: true, doc: null }],
});

describe('tsdoc thresholds', () => {
  it('T0/T1 are 100 % at every train stop; T2 is 95 % before RC and 100 % from RC; preview is not gated', () => {
    expect(tsdocThreshold('T0', '5.0.0-alpha.0')).toBe(1);
    expect(tsdocThreshold('T1', '5.0.0-beta.2')).toBe(1);
    expect(tsdocThreshold('T2', '5.0.0-alpha.0')).toBe(0.95);
    expect(tsdocThreshold('T2', '5.0.0-beta.1')).toBe(0.95);
    expect(tsdocThreshold('T2', '5.0.0-rc.1')).toBe(1);
    expect(tsdocThreshold('T2', '5.0.0')).toBe(1);
    expect(tsdocThreshold('preview', '5.0.0')).toBeNull();
  });
});

describe('tsdoc coverage over a fixture repo', () => {
  it('passes when every public prop has TSDoc', () => {
    const f = fixture([documented]);
    const ref = buildReference({ root: f.root });
    const cov = tsdocCoverage(ref.components, '5.0.0-alpha.0');
    expect(cov.ok).toBe(true);
    expect(cov.tiers.T1).toMatchObject({ documented: 2, total: 2 });
    expect(run({ root: f.root, check: false, tsdoc: true, ...quiet })).toBe(0);
  });

  it('fails on a seeded undocumented T1 prop and names it', () => {
    const f = fixture([withSeeded(documented)]);
    const ref = buildReference({ root: f.root });
    const cov = tsdocCoverage(ref.components, '5.0.0-alpha.0');
    expect(cov.ok).toBe(false);
    expect(cov.failures).toEqual([expect.objectContaining({ tier: 'T1', undocumented: ['Widget.seeded'] })]);
    const errors: string[] = [];
    expect(run({ root: f.root, tsdoc: true, log: () => {}, error: (m) => errors.push(m) })).toBe(1);
    expect(errors.join('\n')).toContain('Widget.seeded');
  });

  it('T2: one undocumented prop in 20 (95 %) passes before RC and fails at RC', () => {
    const props = Array.from({ length: 19 }, (_, i) => ({ name: `p${i}`, type: 'string', optional: true, doc: `Prop ${i}.` }));
    const c: FixtureComponent = { name: 'Gauge', dir: 'gauge', tier: 'T2', props: [...props, { name: 'bare', type: 'number', optional: true, doc: null }] };
    const ref = buildReference({ root: fixture([c]).root });
    expect(tsdocCoverage(ref.components, '5.0.0-beta.0').ok).toBe(true);
    expect(tsdocCoverage(ref.components, '5.0.0-rc.1').ok).toBe(false);
  });

  it('an unexpired baseline row excuses the prop; stale and expired rows fail', () => {
    const f = fixture([withSeeded(documented)]);
    const ref = buildReference({ root: f.root });
    const row = { prop: 'Widget.seeded', owner: 'CMP', reqFin: 'REQ-FIN-76', expires: 'RC-1' };
    expect(tsdocCoverage(ref.components, '5.0.0-alpha.0', [row]).ok).toBe(true);
    const expired = tsdocCoverage(ref.components, '5.0.0-rc.1', [row]);
    expect(expired.ok).toBe(false);
    expect(expired.expired).toEqual(['Widget.seeded']);
    const stale = tsdocCoverage(ref.components, '5.0.0-alpha.0', [row, { prop: 'Widget.label', expires: 'RC-1' }]);
    expect(stale.ok).toBe(false);
    expect(stale.stale).toEqual(['Widget.label']);
    f.write(TSDOC_BASELINE, JSON.stringify([row]));
    expect(readTsdocBaseline(f.root)).toEqual([row]);
    expect(run({ root: f.root, tsdoc: true, ...quiet })).toBe(0);
  });
});

describe('tsdoc coverage of the repository', () => {
  it('meets the tier thresholds for the current version (with the expiring baseline, when present)', () => {
    const version = require(join(root, 'package.json')).version as string;
    const ref = buildReference({ root });
    const cov = tsdocCoverage(ref.components, version, readTsdocBaseline(root) ?? []);
    const summary = cov.failures.map((f) => `${f.tier} ${(f.ratio * 100).toFixed(1)} % < ${f.threshold * 100} % (${f.undocumented.length} undocumented)`);
    expect({ failures: summary, stale: cov.stale, expired: cov.expired }).toEqual({ failures: [], stale: [], expired: [] });
  });
});
