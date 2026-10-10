/* certification/lanes.config.ts — QUAL built-in lane registrations (REQ-QUAL-05, -27, -30, -68).
   The lane runner (packages/qa/src/evidence/laneRunner.ts, CLI certification/run.mjs) merges these with every
   stream's `fragments/lanes/<stream>.ts` (loadFragments('lanes'), S-50). A registration's `scope` is the narrowest
   scope it runs at (pr ⊂ main ⊂ nightly ⊂ release).
   A built-in whose producing gate has not landed yet is listed in `PENDING_BUILTINS` with the producing G-id; the
   runner reports it `pending` (never a skipped test, never a pass), drops it once the producer registers the gate,
   and fails if the gate file exists but nobody registered it. */
import type { LaneRegistration } from '../src/contracts/fragments';

/** `owner` attributes a built-in's failure (contract §6.1 pre-existing): the stream that owns the config the gate
    executes (contracts/ownership.json). Defaults to QUAL. `config` / `coverage` are built-in-only keys. */
export type BuiltinRegistration = LaneRegistration & { owner?: 'plat' | 'mat' | 'cmp' | 'surf' | 'qual'; config?: string; coverage?: boolean };

export const BUILTINS: BuiltinRegistration[] = [
  // ---- L1 Static (REQ-QUAL-27)
  // repo lint, the same command as `npm run lint` (eslint.config.js + eslint-plugin-auraglass.js are PLAT's, row B05).
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/lint.mjs', scope: 'pr', remote: false, failClosed: true, owner: 'plat' },
  // stylelint with stylelint.showcase.config.mjs over showcase/**/*.css (pending until G-26's showcases land).
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/stylelint-showcase.mjs', scope: 'pr', remote: false, failClosed: true },
  // zero `!important` in stories, showcases and the Storybook shell (D-24).
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'pr', remote: false, failClosed: true },
  // REQ-QUAL-60 tracked-evidence guard (G-01).
  { lane: 'L1', kind: 'jest', path: 'packages/qa/test/no-committed-evidence.test.ts', config: 'jest.qual.config.js', scope: 'pr', remote: false, failClosed: true },
  // REQ-QUAL-02 export inventory gate (G-01); writes inventory.json into the job's evidence dir.
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/write-inventory.mjs', scope: 'pr', remote: false, failClosed: true },
  // REQ-QUAL-68 exemptions validator.
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/exemptions.mjs', scope: 'pr', remote: false, failClosed: true },
  // ---- L12 Unit and coverage floors (REQ-QUAL-30): every test by location (jest.config.js verbatim) with
  // --coverageThreshold from certification/ratchets.json, and the floors-only-increase ratchet.
  { lane: 'L12', kind: 'jest', path: 'jest.config.js', coverage: true, scope: 'pr', remote: false, failClosed: true },
  { lane: 'L12', kind: 'node-script', path: 'certification/gates/coverage-ratchet.mjs', scope: 'pr', remote: false, failClosed: true },
];

/** Built-in L1 gates whose producer has not merged yet: reported `pending` with the producing work item. */
export const PENDING_BUILTINS: Array<{ lane: LaneRegistration['lane']; path: string; producer: string }> = [
  { lane: 'L1', path: 'scripts/qual/lint-tests.mjs', producer: 'G-19 (REQ-QUAL-31)' },
  { lane: 'L1', path: 'scripts/qual/verify-css-perf.mjs', producer: 'G-23 (REQ-QUAL-44)' },
  { lane: 'L1', path: 'scripts/qual/verify-dist-perf.mjs', producer: 'G-24 (REQ-QUAL-46)' },
  { lane: 'L1', path: 'scripts/qual/lint-stories.mjs', producer: 'G-10 (REQ-QUAL-55 story-glass gate)' },
];

export default BUILTINS;
