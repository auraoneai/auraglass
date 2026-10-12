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
  // L5 — REQ-CMP-112: Grid responsive columns + masonry (cmp:layout-chromium)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/layout/**/*.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L5 — REQ-CMP-113: Card content layer + disabled-no-opacity (cmp:material-chromium)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/material/**/*.spec.ts",
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
  // L10 — REQ-CMP-130: T2 composite page quietness (<=1 blurred surface)
  {
    lane: "L10",
    kind: "playwright",
    path: "tests/perf/browser/cmp/t2-page.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L11 — REQ-CMP-130/138: next16 /cmp/server canary (0 hydration warnings, no
  // provider). The spec lives in canaries/next16/tests/ (the canary's playwright
  // testDir) so plat:integration:next collects it; the page stays under app/cmp/.
  {
    lane: "L11",
    kind: "playwright",
    path: "canaries/next16/tests/cmp-server.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L12 — Jest: where CMP's unit tests actually live (REQ-CMP-138). The
  // src/components glob excludes the SURF-owned dirs (contracts/ownership.json).
  {
    lane: "L12",
    kind: "jest",
    path: "src/components/!(breadcrumbs|command-palette|pagination|source-transition|tab-bar|tabs|timeline)/**/*.test.{ts,tsx}",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  {
    lane: "L12",
    kind: "jest",
    path: "src/primitives/**/*.test.{ts,tsx}",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  {
    lane: "L12",
    kind: "jest",
    path: "tests/{controls,foundation,overlays}/**/*.test.{ts,tsx,mjs}",
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
