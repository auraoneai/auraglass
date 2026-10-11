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
  // REQ-QUAL-46 dist JS scans (G-24): L1 = static scans over dist (LANE=L1 → --mode scan) plus the scanner's own tests;
  // L2 = scans + per-export esbuild bundles (banned modules, min+gzip-9 bytes map for the lane manifest).
  { lane: 'L1', kind: 'node-script', path: 'scripts/qual/verify-dist-perf.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/perf/qual/dist-perf.test.ts', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/perf/qual/node-cold-import-eval.test.ts', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L2', kind: 'node-script', path: 'scripts/qual/verify-dist-perf.mjs', scope: 'pr', remote: false, failClosed: true },
  // REQ-QUAL-47 node cold import (G-24): remote L2 only (tarball, Node 20.19.0 + 22 LTS, runner tag required).
  { lane: 'L2', kind: 'jest', path: 'tests/perf/qual/node-cold-import.test.mjs', scope: 'pr', remote: true, failClosed: true },
] satisfies LaneRegistration[];
