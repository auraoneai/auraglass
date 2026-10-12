/* fragments/lanes/plat.ts — PLAT owns this file on both branches (§3.4).
   Subject lists are pre-declared in the prompt index; a missing subject is
   `pending` (the lane runner reports it, failClosed only on the subjects). */
import type { LaneRegistration } from '../../src/contracts/fragments';

export default [
  // L1 — lint rule tests (each suite requires its lint/rules/plat/*.cjs rule
  // module directly; a jest row on the .cjs sources themselves can only run
  // --findRelatedTests, which finds nothing because jest.config.js
  // moduleFileExtensions has no 'cjs' for the haste map to index)
  { lane: 'L1', kind: 'jest', path: 'tests/lint/plat/**', scope: 'pr', remote: false, failClosed: true },
  // L2 — artifact/pack gates
  { lane: 'L2', kind: 'jest', path: 'tests/{pack,build,exports,deps,side-effects,css}/**', scope: 'pr', remote: false, failClosed: true },
  // L3 — release classification and deprecation register gates
  { lane: 'L3', kind: 'jest', path: 'tests/release/classify-change.test.mjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L3', kind: 'jest', path: 'tests/deprecations/prior-deprecation.test.ts', scope: 'pr', remote: false, failClosed: true },
  // L11 — consumer canaries. One row per canary app: each app runs under its
  // own playwright.config.ts (its webServer/globalSetup installs and serves
  // the packed artifact), so a single braced row over every app collects
  // 0 tests under any one config.
  { lane: 'L11', kind: 'playwright', path: 'canaries/next16/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/next15/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/vite/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/vite-tailwind4/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/vite-compiler/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/types-strict/tests/**', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'canaries/jest-cjs/tests/**', scope: 'pr', remote: true, failClosed: true },
  // No jest row for tests/fixtures/consumer-4x: the fixture is frozen 4.x
  // consumer input data (0 test files by design), not a jest subject. Its
  // L11 executor is QUAL's built-in certification/lanes/canaries.spec.ts
  // (consumer-4x test, certification/lanes.config.ts); the per-stream cases
  // also run as jest in tests/dx/consumer-4x-cmp.test.ts and
  // tests/data/migrate-canary.test.ts under their own registrations.
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/codemod-canary.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/registry-render.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/quickstart.spec.ts', scope: 'pr', remote: true, failClosed: true },
] satisfies LaneRegistration[];
