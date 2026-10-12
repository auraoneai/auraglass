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
  // REQ-CMP-139: the literals baseline is current and 0 for every CMP file
  {
    lane: "L1",
    kind: "node-script",
    path: "scripts/cmp/gen-literals-baseline.mjs --check --enforce-zero",
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
  // L5 — REQ-CMP-101: coarse-pointer Tooltip (tap never opens, long-press opens, outside tap closes)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/tooltip-touch.spec.ts",
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
  // L5 — REQ-CMP-12: mixed Dialog > Popover > DismissableLayer stack, one Escape per layer
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/overlays/overlay-stack.spec.ts",
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
  // L6 — REQ-CMP-13: disabled surfaces never take opacity < 1
  {
    lane: "L6",
    kind: "playwright",
    path: "tests/e2e/cmp/material/disabled-no-opacity.spec.ts",
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
  // L6 — REQ-CMP-36: controls e2e (IconButton 28/36/44 box sizes, sizing, focus,
  // axe, motion, overlay stack); was unregistered so icon-button-sizes never ran
  {
    lane: "L6",
    kind: "playwright",
    path: "tests/e2e/cmp/controls/**",
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
    path: "tests/{controls,foundation,overlays,compiler}/**/*.test.{ts,tsx,mjs}",
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
  // L5 — REQ-CMP-19: two-tone focus ring on every focusable part (kept on focusable-disabled)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/focus.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L5 — REQ-CMP-20/21/104: target sizes via elementFromPoint (24px fine, 44px coarse hit-area) + §4.4 control block sizes (±0.5 px)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/sizing.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L5 — REQ-CMP-104: material specs (disabled never dims with opacity, content layer)
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/material/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L5 — REQ-CMP-109: overlay e2e specs incl. toast swipe-dismiss on touch
  {
    lane: "L5",
    kind: "playwright",
    path: "tests/e2e/cmp/overlays/**",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L9 — REQ-CMP-42: indicator/thumb/popup motion frame strips
  {
    lane: "L9",
    kind: "playwright",
    path: "tests/e2e/cmp/controls/controls-motion.spec.ts",
    scope: "pr",
    remote: true,
    failClosed: true,
  },
  // L12 — REQ-CMP-17: renderAgServer → hydrate for every meta's default and defaultOpen stories
  {
    lane: "L12",
    kind: "jest",
    path: "tests/ssr/cmp/**",
    scope: "pr",
    remote: false,
    failClosed: true,
  },
  // L6 — REQ-CMP-68: Select popup width/height at 390 px (fine + coarse)
] satisfies LaneRegistration[];
