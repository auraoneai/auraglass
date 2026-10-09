/* fragments/lanes/cmp.ts — CMP owns this file on both branches (§3.4).
   REQ-CMP-138: full lane registration; remote browser/perf rows carry
   remote:true and are failClosed only on their subjects. */
import type { LaneRegistration } from "../../src/contracts/fragments";

export default [
  // L1 — lint + foundation-pattern verifier
  {
    lane: "L1",
    kind: "node-script",
    path: "scripts/cmp/verify-foundation-pattern.mjs",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  {
    lane: "L1",
    kind: "jest",
    path: "tests/lint/cmp/**",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  // L5 — a11y APG specs
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/a11y/apg/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L6–L8 — visual specs
  {
    lane: "L6",
    kind: "playwright",
    path: "tests/visual/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  {
    lane: "L7",
    kind: "playwright",
    path: "tests/visual/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  {
    lane: "L8",
    kind: "playwright",
    path: "tests/visual/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L9 — motion spec
  {
    lane: "L9",
    kind: "playwright",
    path: "tests/e2e/cmp/motion.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L10 — browser perf
  {
    lane: "L10",
    kind: "playwright",
    path: "tests/perf/browser/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L11 — canaries
  {
    lane: "L11",
    kind: "playwright",
    path: "canaries/*/cmp/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L12 — Jest CMP dirs
  {
    lane: "L12",
    kind: "jest",
    path: "tests/{foundation,controls,forms,overlays,content,layout,primitives}/cmp/**",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  {
    lane: "L12",
    kind: "jest",
    path: "tests/contract/cmp/**",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  // L13 — manual a11y records
  {
    lane: "L13",
    kind: "manual-record",
    path: "tests/a11y/manual/records/cmp/**",
    scope: "nightly",
    remote: false,
    failClosed: true,
  },
] satisfies LaneRegistration[];
