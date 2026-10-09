/* fragments/lanes/cmp.ts — CMP owns this file on both branches (§3.4). */
import type { LaneRegistration } from '../../src/contracts/fragments';
export default [
  // REQ-CMP-130: T2 page quietness (perf browser lane)
  { lane: 'L10', kind: 'playwright', path: 'tests/perf/browser/cmp/t2-page.spec.ts', scope: 'pr', remote: true, failClosed: true },
  // REQ-CMP-130: next16 cmp server canary (hydration warnings = 0)
  { lane: 'L11', kind: 'playwright', path: 'canaries/next16/tests/cmp-server.spec.ts', scope: 'pr', remote: true, failClosed: true },
] satisfies LaneRegistration[];
