/* @jest-environment node */
/* REQ-PLAT-69 staged rollout (G-05): PLAT rules are `error` on PLAT globs
   (_strict.cjs) and `warn` elsewhere until RC-1, then `error` everywhere. */
import { describe, expect, it } from '@jest/globals';

const { phase, rolloutSeverity } = require('../../../lint/rules/plat/_rollout.cjs');
const { strict } = require('../../../lint/rules/plat/_strict.cjs');
const RULES = ['use-client-required', 'use-client-needless', 'no-random-in-render', 'no-dom-lazy-init', 'contract-boundary', 'no-legacy-import'];

describe('PLAT lint rollout (REQ-PLAT-69)', () => {
  it('pre-RC versions warn, RC and GA error', () => {
    for (const v of ['5.0.0-alpha.1', '5.0.0-beta.3', '4.3.0']) expect([v, rolloutSeverity({ env: {}, version: v })]).toEqual([v, 'warn']);
    for (const v of ['5.0.0-rc.1', '5.0.0', '5.1.2']) expect([v, rolloutSeverity({ env: {}, version: v })]).toEqual([v, 'error']);
  });
  it('an RC or GA tag pipeline is RC-1 whatever package.json says', () => {
    expect(phase({ env: { CI_COMMIT_TAG: 'v5.0.0-rc.1' }, version: '5.0.0-beta.9' })).toBe('rc');
    expect(phase({ env: { CI_COMMIT_TAG: 'v5.0.0' }, version: '5.0.0-beta.9' })).toBe('rc');
    expect(phase({ env: { CI_COMMIT_TAG: 'v5.0.0-beta.2' }, version: '5.0.0-beta.2' })).toBe('pre-rc');
  });
  it('every PLAT rule uses the rollout severity on src/** and stays error on PLAT globs', () => {
    const want = rolloutSeverity();
    for (const name of RULES) {
      const mod = require(`../../../lint/rules/plat/${name}.cjs`);
      expect([name, mod.agConfig.map((c: { severity: string }) => c.severity)]).toEqual([name, [want]]);
      expect(strict[name]).toEqual(expect.arrayContaining(['src/internal/**/*.{ts,tsx}', 'src/compat/**/*.{ts,tsx}']));
    }
  });
});
