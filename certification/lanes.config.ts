/* certification/lanes.config.ts — QUAL built-in lane registrations (REQ-QUAL-05, -27).
   run.mjs merges these with every stream's `fragments/lanes/<stream>.ts` (loadFragments('lanes'), S-50).
   A built-in whose producing gate has not landed yet is listed in `PENDING_BUILTINS` with the producing G-id;
   the lane runner reports it as `pending` (never a skipped test, never a pass). */
import type { LaneRegistration } from '../src/contracts/fragments';

/** `owner` attributes a built-in's failure (contract §6.1 pre-existing): the stream that owns the config the gate executes
    (contracts/ownership.json). Defaults to QUAL. */
export type BuiltinRegistration = LaneRegistration & { owner?: 'plat' | 'mat' | 'cmp' | 'surf' | 'qual' };

export const BUILTINS: BuiltinRegistration[] = [
  // QUAL-27: repo lint, the same command as `npm run lint` (eslint.config.js + eslint-plugin-auraglass.js are PLAT's, row B05).
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/lint.mjs', scope: 'pr', remote: false, failClosed: true, owner: 'plat' },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/lint.mjs', scope: 'main', remote: false, failClosed: true, owner: 'plat' },
  // QUAL-27: zero `!important` in stories, showcases and the Storybook shell.
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'release', remote: false, failClosed: true },
  // REQ-QUAL-04/-12 (G-12): L6 environment-visual capture driver; the spec selects the §4.2 matrix from AG_SCOPE.
  ...(['pr', 'main', 'nightly', 'release'] as const).map((scope): BuiltinRegistration =>
    ({ lane: 'L6', kind: 'playwright', path: 'certification/lanes/environment-visual.spec.ts', scope, remote: true, failClosed: true })),
  // REQ-QUAL-24..26 (G-14): L7 pixel regression + visual-class rows; run.mjs applies the REQ-QUAL-25 branch verdict and
  // writes .artifacts/qual/visual-class.json (REPORTS.visualClass).
  ...(['pr', 'main', 'nightly', 'release'] as const).map((scope): BuiltinRegistration =>
    ({ lane: 'L7', kind: 'playwright', path: 'certification/lanes/regression.spec.ts', scope, remote: true, failClosed: true })),
];

/** Built-in L1 gates whose producer has not merged yet: reported `pending` with the producing work item. */
export const PENDING_BUILTINS: Array<{ lane: LaneRegistration['lane']; path: string; producer: string }> = [
  { lane: 'L1', path: 'stylelint.showcase.config.mjs (showcase/**/*.css)', producer: 'G-26' },
  { lane: 'L1', path: 'scripts/qual/lint-tests.mjs', producer: 'G-19' },
  { lane: 'L1', path: 'scripts/qual/verify-css-perf.mjs', producer: 'G-23' },
  { lane: 'L1', path: 'scripts/qual/verify-dist-perf.mjs', producer: 'G-24' },
  { lane: 'L1', path: 'story-glass gate', producer: 'G-10' },
  { lane: 'L1', path: 'packages/qa/test/no-committed-evidence.test.ts', producer: 'G-01' },
];

export default BUILTINS;
