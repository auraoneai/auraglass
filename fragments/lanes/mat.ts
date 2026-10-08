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
  // MAT-309: APG coverage — ratchet on every PR (advisory; fails only on
  // absent specs at beta via the release --enforce row).
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-apg-coverage.mjs',
    scope: 'pr',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-apg-coverage.mjs --enforce',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  // MAT-316/318/324: manual SR record validation (manual-upload job).
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-a11y-manual.mjs',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  // MAT-323: beta gate — §9 removals + css enforce-zero + apg enforce.
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/verify-a11y-removals.mjs',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  // MAT-325: GA certification summary (reads all a11y artifacts).
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/mat/a11y-cert-summary.mjs',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  // MAT-283..313: remote a11y e2e cells (GitLab browsers only).
  {
    lane: 'L5',
    kind: 'playwright',
    path: 'tests/e2e/mat',
    scope: 'pr',
    remote: true,
    failClosed: true,
  },
] satisfies LaneRegistration[];
