/* packages/qa/src/perf/surfaceBudget.ts — REQ-QUAL-38 surface budgets per cell (QUAL). Pure evaluator used by
   tests/perf/qual/surface-budget.spec.ts (Chromium, WebKit, Gecko; 3 viewports × 3 scroll positions, every overlay open).

   Inputs are the bci.ts layer snapshot (`collectBlurLayers`) plus host facts read in the same page state. Checks
   (thresholds.json#perf.ceilings; blurred surfaces and BCI use the subject's resolved budget, which an owner row may tighten):
     blurred surfaces ≤ budget (fine 6 / coarse 3) · BCI ≤ budget (fine 2.0 / coarse 1.2) · effective nesting ≤1 (≤2 only under
     [data-ag-allow-nested]) · blur radius ≤32 px · a layer covering ≥95 % of the viewport only on [data-ag-layer="scrim"] and ≤12 px ·
     enhanced refracting surfaces (url(#…) SVG lens in the backdrop chain) ≤2 fine / ≤1 coarse, each ≤25 % of the viewport ·
     live WebGL contexts ≤1. */
import { clippedArea, summarizeBlurCost, type BlurLayerSnapshot } from './bci.ts';
import type { PerfThresholds, Pointer } from './budgets.ts';

export interface HostFacts { host: number; scrim: boolean; allowNested: boolean }
export interface SurfaceCell { pointer: Pointer; snapshot: BlurLayerSnapshot; hosts: readonly HostFacts[]; liveWebglContexts: number }
export interface SurfaceBudgets { blurredSurfaces: number; bci: number }
export interface SurfaceMeasure { blurredSurfaces: number; bci: number; maxNesting: number; maxBlurPx: number; refracting: number; liveWebglContexts: number }

const URL_RE = /url\(/;

export function evaluateSurfaceCell(cell: SurfaceCell, budgets: SurfaceBudgets, t: PerfThresholds): { measure: SurfaceMeasure; violations: string[] } {
  const c = t.ceilings;
  const vp = cell.snapshot.viewport;
  const vpArea = vp.width * vp.height;
  const facts = new Map(cell.hosts.map((h) => [h.host, h]));
  const visible = cell.snapshot.layers.filter((l) => clippedArea(l.rect, vp) > 0);
  const cost = summarizeBlurCost(cell.snapshot);
  const v: string[] = [];
  if (cost.blurredSurfaces > budgets.blurredSurfaces) v.push(`blurred-surfaces ${cost.blurredSurfaces} > ${budgets.blurredSurfaces}`);
  if (cost.bci > budgets.bci + 1e-9) v.push(`bci ${cost.bci.toFixed(3)} > ${budgets.bci}`);
  const refractingHosts = new Set<number>();
  for (const l of visible) {
    const f = facts.get(l.host) ?? { host: l.host, scrim: false, allowNested: false };
    const where = `${l.tag}${l.part ? `[data-ag-part=${l.part}]` : ''}${l.kind === 'before' ? '::before' : ''}`;
    const maxNest = f.allowNested ? c.effectiveNesting.allowNested : c.effectiveNesting.default;
    if (l.nesting > maxNest) v.push(`effective nesting ${l.nesting} > ${maxNest} at ${where}`);
    if (l.blurPx > c.blurRadiusPx) v.push(`blur radius ${l.blurPx}px > ${c.blurRadiusPx}px at ${where}`);
    const share = clippedArea(l.rect, vp) / vpArea;
    if (share >= c.fullViewportBlur.minViewportShare) {
      if (!f.scrim) v.push(`full-viewport blur (${(share * 100).toFixed(0)}% of the viewport) outside data-ag-layer="${c.fullViewportBlur.layer}" at ${where}`);
      else if (l.blurPx > c.fullViewportBlur.maxPx) v.push(`full-viewport scrim blur ${l.blurPx}px > ${c.fullViewportBlur.maxPx}px at ${where}`);
    }
    if (URL_RE.test(l.backdropFilter)) {
      refractingHosts.add(l.host);
      if (share > c.refractingSurfaces.maxViewportShare) v.push(`refracting surface covers ${(share * 100).toFixed(1)}% > ${c.refractingSurfaces.maxViewportShare * 100}% of the viewport at ${where}`);
    }
  }
  const maxRefracting = c.refractingSurfaces[cell.pointer];
  if (refractingHosts.size > maxRefracting) v.push(`refracting surfaces ${refractingHosts.size} > ${maxRefracting} (${cell.pointer})`);
  if (cell.liveWebglContexts > c.liveWebglContexts) v.push(`live WebGL contexts ${cell.liveWebglContexts} > ${c.liveWebglContexts}`);
  return { measure: { blurredSurfaces: cost.blurredSurfaces, bci: cost.bci, maxNesting: cost.maxEffectiveNesting, maxBlurPx: cost.maxBlurPx,
    refracting: refractingHosts.size, liveWebglContexts: cell.liveWebglContexts }, violations: v };
}
