/* fragments/lanes/plat.ts — PLAT owns this file on both branches (§3.4).
   Subject lists are pre-declared in the prompt index; a missing subject is
   `pending` (the lane runner reports it, failClosed only on the subjects). */
import type { LaneRegistration } from '../../src/contracts/fragments';

export default [
  // L1 — lint rules and their tests
  { lane: 'L1', kind: 'jest', path: 'lint/rules/plat/*.cjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/lint/plat/**', scope: 'pr', remote: false, failClosed: true },
  // L2 — artifact/pack gates
  { lane: 'L2', kind: 'jest', path: 'tests/{pack,build,exports,deps,side-effects,css}/**', scope: 'pr', remote: false, failClosed: true },
  // L3 — release classification and deprecation register gates
  { lane: 'L3', kind: 'jest', path: 'tests/release/classify-change.test.ts', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L3', kind: 'jest', path: 'tests/deprecations/prior-deprecation.test.ts', scope: 'pr', remote: false, failClosed: true },
  // L11 — consumer canaries
  { lane: 'L11', kind: 'playwright', path: 'canaries/{next16,next15,vite,vite-tailwind4,vite-compiler,types-strict,jest-cjs}', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'jest', path: 'tests/fixtures/consumer-4x', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/codemod-canary.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/registry-render.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/dx/quickstart.spec.ts', scope: 'pr', remote: true, failClosed: true },
] satisfies LaneRegistration[];
