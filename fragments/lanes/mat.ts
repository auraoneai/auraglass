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
  // --- lane 2e-B begin ---

  // MAT-330/331 (REQ-MAT-11): L4 Token contrast — MAT token provider. The
  // script runs `npm run tokens:build` (fails closed > 20 s), `git diff
  // --exit-code` on the generated token outputs, the contrast/transform jest
  // paths (contrast solve fails closed > 10 s) and publishes
  // dist/contrast-matrix.json into the lane evidence dir. Runs on every PR and
  // main push with no path filter (REQ-QA-29).
  { lane: 'L4', kind: 'node-script', path: 'scripts/mat/token-drift-l4.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L4', kind: 'node-script', path: 'scripts/mat/token-drift-l4.mjs', scope: 'main', remote: false, failClosed: true },
  // MAT-370 (L4 cell): a11y contrast matrix next to the DS contrast suite.
  { lane: 'L4', kind: 'jest', path: 'tests/a11y/**/*contrast*.test.ts', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L4', kind: 'jest', path: 'tests/a11y/**/*contrast*.test.ts', scope: 'main', remote: false, failClosed: true },

  // MAT-332: L1 Static — token gates (undefined-vars, dead-vars, tier-skip,
  // types-runtime, literals vs literals-baseline) + stylelint on src/**/*.css
  // after a remote build; the script enforces the ≤ 30 s gate budget.
  { lane: 'L1', kind: 'node-script', path: 'scripts/mat/token-gates-l1.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'node-script', path: 'scripts/mat/token-gates-l1.mjs', scope: 'main', remote: false, failClosed: true },
  // MAT-370 (L1 cell): a11y static rules auraglass/no-runtime-contrast +
  // auraglass/no-document-escape over src/** (verify-a11y-css.mjs and the APG
  // coverage check are registered by lane 2d-P's own rows).
  { lane: 'L1', kind: 'node-script', path: 'scripts/mat/a11y-eslint-l1.mjs', scope: 'pr', remote: false, failClosed: true },

  // MAT-370 (L5 Behaviour cells): floors, rungs, forced-colors, layer-stack,
  // prepaint, target-size, focus-not-obscured, zoom-reflow, text-spacing,
  // axe (AXE_SCOPE=pr), apg self-tests. Remote runners only.
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/floors.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/rungs.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/forced-colors.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/layer-stack.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/prepaint.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/target-size.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/focus-not-obscured.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/zoom-reflow.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/text-spacing.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/axe.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/**/*.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },

  // MAT-349 (D.3-02): the mat:material-{chromium,webkit,firefox} Playwright
  // projects (fragments/playwright/mat.json, testDir tests/e2e/mat/material). Chromium is
  // the L5 Behaviour cell; the WebKit/Gecko runs are the L8 Engine-specific cells
  // (SC-29). Replaces the retired mat:certify:l5-material job (rule 7).
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/mat/material/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L8', kind: 'playwright', path: 'tests/e2e/mat/material/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },

  // MAT-370/372 (L6 Environment visual cells): pixel-modes, focus-appearance,
  // color-vision; rungs re-run for the release screenshot evidence (photo,
  // flat-black, hf-pattern) consumed by the L14 sign-off.
  { lane: 'L6', kind: 'playwright', path: 'tests/e2e/mat/pixel-modes.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L6', kind: 'playwright', path: 'tests/e2e/mat/focus-appearance.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L6', kind: 'playwright', path: 'tests/e2e/mat/color-vision.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L6', kind: 'playwright', path: 'tests/e2e/mat/rungs.spec.ts', scope: 'release', remote: true, failClosed: true },

  // MAT-362 (L9 Motion cell): motion Playwright specs run under the
  // mat:motion-* projects; this row binds the suite to L9 for PR scope.
  { lane: 'L9', kind: 'playwright', path: 'tests/motion/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },

  // MAT-362/370 (L12 Unit cells): codemod fixture integrity + theme/a11y units.
  { lane: 'L12', kind: 'node-script', path: 'scripts/mat/codemod-fixtures-check.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'src/theme/**/__tests__/**', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'tests/a11y/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },

  // MAT-371 (L11 Consumer canaries): MAT canary fixtures (provider + script in
  // app/layout, 0 hydration warnings) exercised by QUAL's L11 harness on
  // Next 15/16 + Vite canaries.
  { lane: 'L11', kind: 'story-subjects', path: 'canaries/*/fixtures/mat/**', scope: 'pr', remote: true, failClosed: true },

  // MAT-374 (GA cert): collect the §16 numbers on the GA SHA from their lanes
  // and fail on any overrun; emits the budget-table artifact.
  { lane: 'L2', kind: 'node-script', path: 'scripts/mat/ga-cert.mjs', scope: 'release', remote: false, failClosed: true },
  // --- lane 2e-B end ---
] satisfies LaneRegistration[];
