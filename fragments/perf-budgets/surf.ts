// perf-budgets fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { PerfBudgetRow } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { subject: 'surf/appshell--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/appshell--default', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/appshell--default', profile: 'mid-mobile', metric: 'long-tasks', max: 0.02, provisional: true },
  { subject: 'surf/sidebar--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/sidebar--default', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/resizablepanels--default', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/resizablepanels--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/command--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/command--default', profile: 'desktop-120hz', metric: 'long-tasks', max: 0.02, provisional: true },
  { subject: 'surf/appshell--default', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 4, provisional: true },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { subject: 'surf/table--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/table--default', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/tree-view--default', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/date-picker--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/chart-frame--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/activity-feed--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { subject: 'surf/thread--streaming-200', profile: 'desktop-120hz', metric: 'long-tasks', max: 0, provisional: true },
  { subject: 'surf/thread--streaming-200', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/thread--virtualized-2000', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/composer--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
// SURF-510: media perf rows — scrub frame-p95 (≥55fps gate is AC-SURF-20),
// long-tasks ≤0.02 during playback, image-viewer open.
const w4 = [
  { subject: 'surf/media-controls--scrub', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/media-controls--scrub', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/media-controls--scrub', profile: 'mid-mobile', metric: 'long-tasks', max: 0.02, provisional: true },
  { subject: 'surf/now-playing--default', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 16.7, provisional: true },
  { subject: 'surf/image-viewer--open', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 8.3, provisional: true },
  { subject: 'surf/carousel-rail--autoplay', profile: 'mid-mobile', metric: 'long-tasks', max: 0.02, provisional: true },
] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly PerfBudgetRow[];
