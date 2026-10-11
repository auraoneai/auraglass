/* fragments/lanes/qual.ts — QUAL owns this file on both branches (§3.4). */
import type { LaneRegistration } from '../../src/contracts/fragments';
export default [
  // REQ-QUAL-31 (G-19): vacuous-assertion gate — error on QUAL paths, report-only elsewhere until RC-1,
  // error everywhere from RC-1 (phase from CI_COMMIT_TAG).
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/lint-tests.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/lint-tests.mjs', scope: 'release', remote: false, failClosed: true },
  // REQ-QUAL-71 (G-19, release gate G-04): flagship deliverables — pending per missing item before RC-1, fail at
  // RC-1; structural offenders outside certification/deliverables-baseline.json fail immediately.
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/deliverables/check.ts', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/deliverables/check.ts', scope: 'release', remote: false, failClosed: true },
] satisfies LaneRegistration[];
