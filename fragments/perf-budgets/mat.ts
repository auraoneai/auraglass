/* fragments/perf-budgets/mat.ts — MAT owns this file on both branches (§3.4). */
import type { PerfBudgetRow } from '../../src/contracts/fragments';
export default [
  // --- lane 2e-B begin ---
  // MAT-359: MAT runtime rows (provisional until the alpha.1 calibration PR,
  // D-26; afterwards ratchet-down only). Surface count ceilings are per
  // pointer profile: fine ≤ 6 blurred surfaces, coarse ≤ 3; refracting ≤ 2 and
  // each ≤ 25% of the viewport; nesting depth 1 (2 with allowNested); 0
  // attributable long tasks; frame targets 55/50 fps.
  { subject: 'mat:surface (pointer:fine)', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 6, provisional: true },
  { subject: 'mat:surface (pointer:coarse)', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 3, provisional: true },
  { subject: 'mat:surface refracting', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 2, provisional: true },
  { subject: 'mat:surface', profile: 'mid-mobile', metric: 'long-tasks', max: 0, provisional: true },
  { subject: 'mat:surface', profile: 'mid-mobile', metric: 'frame-p95-ms', max: 20, provisional: true },
  { subject: 'mat:surface', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 18, provisional: true },
  // --- lane 2e-B end ---
] satisfies PerfBudgetRow[];
