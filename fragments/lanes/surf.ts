// lanes fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { LaneRegistration } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { lane: 'L1', kind: 'jest', path: 'src/app-shell/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/app-shell/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/app-shell/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/app-shell/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition}/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition}/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'tests/app-shell/jest.doubles.cjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/sidebar.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/splitter.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/tabs.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/tabbar.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/breadcrumbs-overflow.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/command.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/app-shell/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/app-shell/**/*.spec.ts', scope: 'main', remote: true, failClosed: true },
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/tabs-indicator.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/tabbar-minimize.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/source-transition.spec.ts', scope: 'pr', remote: true, failClosed: true },
  // REQ-SURF-190: every SURF subject idle 1,000 ms after load at full/calm/none.
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/idle.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/idle.spec.ts', scope: 'main', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/app-shell-scroll.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/sidebar-toggle.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/resizable-drag.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/command-5000.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'node-script', path: 'canaries/next16/app/surf/app-shell/page.tsx', scope: 'main', remote: true, failClosed: true },
  { lane: 'L11', kind: 'node-script', path: 'canaries/vite/src/surf/AppShell.page.tsx', scope: 'main', remote: true, failClosed: true },
  { lane: 'L11', kind: 'playwright', path: 'tests/rsc/surf/breadcrumbs-server.spec.ts', scope: 'pr', remote: true, failClosed: true },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { lane: 'L1', kind: 'jest', path: 'src/data/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/data/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/date/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/date/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/charts/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/components/timeline/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/{data,date,charts}/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/{calendar,date-picker,date-range-picker,filter-bar,tree-view,table-grid,activity-feed}.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/{data,date,charts}/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/{data-table-5000,data-tree-view,data-filter,date-picker-open,activity-feed-prepend}.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'node-script', path: 'canaries/next16/app/surf/data-server/page.tsx', scope: 'main', remote: true, failClosed: true },
  { lane: 'L11', kind: 'node-script', path: 'canaries/vite/src/surf/DataTable.page.tsx', scope: 'main', remote: true, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'tests/data/jest.doubles.cjs', scope: 'pr', remote: false, failClosed: true },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { lane: 'L1', kind: 'jest', path: 'src/ai/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/ai/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/{thread,message,composer,tool-call,citation}.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/ai/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/ai-streaming.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L11', kind: 'node-script', path: 'canaries/next16/app/surf/ai-rsc/page.tsx', scope: 'main', remote: true, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'tests/ai/jest.doubles.cjs', scope: 'pr', remote: false, failClosed: true },
] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
// SURF-405/523: W4 registrations — L1 jest (src/media + src/backdrops +
// tests/media + tests/backdrops incl. purity), L5 APG + media e2e, L6
// clear-over-media twice per scene (tone forced on vs off), L8 sampling
// engines under the surf:cert-media-sampling Playwright project, L9 motion,
// L10 scrub perf.
const w4 = [
  { lane: 'L1', kind: 'jest', path: 'src/media/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/media/**/*.test.{ts,tsx}', scope: 'main', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'src/backdrops/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/media/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L1', kind: 'jest', path: 'tests/backdrops/**/*.test.{ts,tsx}', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L12', kind: 'jest', path: 'tests/media/jest.doubles.cjs', scope: 'pr', remote: false, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/a11y/apg/surf/{media-controls,now-playing,image-viewer}.apg.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/{media,backdrops}/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L5', kind: 'playwright', path: 'tests/e2e/surf/{media,backdrops}/**/*.spec.ts', scope: 'main', remote: true, failClosed: true },
  { lane: 'L6', kind: 'playwright', path: 'tests/a11y/clear-over-media/**/*.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L8', kind: 'playwright', path: 'tests/e2e/surf/media/sampling-engines.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L9', kind: 'playwright', path: 'tests/e2e/surf/motion/{backdrop-drift,carousel-autoplay}.spec.ts', scope: 'pr', remote: true, failClosed: true },
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/surf/{media-scrub,now-playing-update,image-viewer-open}.spec.ts', scope: 'pr', remote: true, failClosed: true },
] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
// SURF-562: capability-ledger gate on L1 (QUAL qual:certify:l1 runs it);
// --diff uses `git merge-base HEAD origin/next` (no CI_MERGE_REQUEST_* on the
// mirror). SURF-633: labs admission gate on L1 with scopes pr + release, so a
// red run fails the tag pipeline whose plat:publish:npm job publishes labs
// (REQ-SURF-167). SURF-561: SURF purity gate on L1 (REQ-SURF-05).
const w5 = [
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-capability-ledger.mjs',
    scope: 'pr',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-capability-ledger.mjs',
    scope: 'main',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-capability-ledger.mjs',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-labs-admission.mjs',
    scope: 'pr',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-labs-admission.mjs',
    scope: 'release',
    remote: false,
    failClosed: true,
  },
  {
    lane: 'L1',
    kind: 'node-script',
    path: 'scripts/surf/verify-surf-purity.mjs',
    scope: 'pr',
    remote: false,
    failClosed: true,
  },
] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly LaneRegistration[];
