/* REQ-QUAL-38 render-cost ceiling as an L6 gate (`cost`), used by the REQ-QUAL-32 known-failures proof (QUAL, FIN-434).

   Visible blurred surfaces: every element and `::before` box with computed backdrop-filter ≠ none
   (`collectBackdropRects`, G-13) whose box intersects the viewport. Ceiling per pointer class from
   certification/thresholds.json `layers` — ≤6 at (hover:hover) and (pointer:fine), ≤3 at (pointer:coarse)
   (PRD-QUAL REQ-QUAL-38, §9 row "Visible blurred surfaces"). A missing or mistyped key throws: the gate never falls
   back to a built-in number. The 4.1 modal (12 visible filters at 1440×900) must fail it. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BackdropRect } from '../pixel/density';
import type { GateResult } from '../pixel/gate';

export const COST_THRESHOLDS_FILE = 'certification/thresholds.json';

export type PointerClass = 'fine' | 'coarse';
export interface CostCeilings { fine: number; coarse: number }

const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0;

/** Validates the `layers` section of a parsed thresholds document. */
export function parseCostCeilings(raw: unknown, file = COST_THRESHOLDS_FILE): CostCeilings {
  const layers = (raw as { layers?: Record<string, unknown> } | null)?.layers;
  const errors: string[] = [];
  if (!layers || typeof layers !== 'object') errors.push('layers missing');
  else for (const k of ['fine', 'coarse'] as const) if (!isCount(layers[k])) errors.push(`layers.${k} must be a non-negative integer`);
  if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`);
  return { fine: layers!.fine as number, coarse: layers!.coarse as number };
}

export function loadCostCeilings(root: string): CostCeilings {
  return parseCostCeilings(JSON.parse(readFileSync(join(root, COST_THRESHOLDS_FILE), 'utf8')));
}

/** Rects whose box has positive area inside the viewport (CSS px, viewport-relative). */
export function visibleBlurred(rects: readonly BackdropRect[], viewport: { width: number; height: number }): BackdropRect[] {
  return rects.filter((r) => Math.min(viewport.width, r.x + r.w) - Math.max(0, r.x) > 0 && Math.min(viewport.height, r.y + r.h) - Math.max(0, r.y) > 0);
}

export function costGate(rects: readonly BackdropRect[], viewport: { width: number; height: number }, pointer: PointerClass, ceilings: CostCeilings): GateResult {
  const visible = visibleBlurred(rects, viewport);
  const limit = ceilings[pointer];
  const sample = visible.slice(0, 6).map((r) => `${r.selector}${r.pseudo} ${r.filter}`).join('; ');
  return {
    gate: 'cost',
    status: visible.length <= limit ? 'pass' : 'fail',
    value: visible.length,
    limit,
    detail: `${visible.length} visible blurred surface(s) at ${viewport.width}×${viewport.height} (pointer:${pointer}, ≤${limit} allowed)${sample ? `: ${sample}${visible.length > 6 ? '; …' : ''}` : ''}`,
  };
}
