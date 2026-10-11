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
  // QUAL-55 (G-10): story-glass gate — six AST checks; QUAL paths error, other streams' offenders in the expiring
  // baseline certification/baselines-gates/story-glass.json (per-stream counts in the row report). QUAL-54 (G-10): .storybook
  // is never imported by src/showcase/registry and never shipped (tarball from plat:package:pack's AURAGLASS_TARBALL).
  ...(['pr', 'main', 'release'] as const).flatMap((scope): BuiltinRegistration[] => [
    { lane: 'L1', kind: 'node-script', path: 'scripts/qual/lint-stories.mjs', scope, remote: false, failClosed: true },
    { lane: 'L1', kind: 'node-script', path: 'scripts/qual/verify-lab-not-shipped.mjs', scope, remote: false, failClosed: true },
    // story-rules imports the .mjs gate; the `jest` kind runs with --experimental-vm-modules, under which the shared
    // babel transform turns .mjs into CJS that cannot load, so the test runs through plain Jest (as qual:build:storybook does).
    { lane: 'L1', kind: 'node-script', path: 'node_modules/jest/bin/jest.js --ci tests/lint/qual/story-rules.test.ts', scope, remote: false, failClosed: true },
  ]),
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
  { lane: 'L1', path: 'packages/qa/test/no-committed-evidence.test.ts', producer: 'G-01' },
];

export default BUILTINS;
