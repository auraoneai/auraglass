/* fragments/lanes/mat.ts — MAT owns this file on both branches (§3.4). */
import type { LaneRegistration } from '../../src/contracts/fragments';
export default [
  // MAT-300/MAT-370: the a11y css PostCSS gate runs in L1 Static on every PR;
  // the release/beta invocation adds --enforce-zero behind the beta gate.
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-a11y-css.mjs',
    scope: 'pr',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-a11y-css.mjs --enforce-zero',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
] satisfies LaneRegistration[];
