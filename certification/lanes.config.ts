/* certification/lanes.config.ts — QUAL built-in lane registrations (REQ-QUAL-05, -27).
   run.mjs merges these with every stream's `fragments/lanes/<stream>.ts` (loadFragments('lanes'), S-50).
   A built-in whose producing gate has not landed yet is listed in `PENDING_BUILTINS` with the producing G-id;
   the lane runner reports it as `pending` (never a skipped test, never a pass). */
import type { LaneRegistration } from '../src/contracts/fragments';

export const BUILTINS: LaneRegistration[] = [
  // QUAL-27: repo lint (eslint + stylelint on src/**/*.css), the same command as `npm run lint`.
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/lint.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/lint.mjs', scope: 'main', remote: false, failClosed: true },
  // QUAL-27: zero `!important` in stories, showcases and the Storybook shell.
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'certification/gates/no-important.mjs', scope: 'release', remote: false, failClosed: true },
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
