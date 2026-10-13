/* REQ-QUAL-16 Preference modes must change something (QUAL, FIN-430) — pure measurements; the lane is
   certification/lanes/preference-modes.spec.ts. Versus the `default` cell (same scene, scheme, engine):
   - contrast-more changes ≥ `preference.contrastMoreMinShare` of surface pixels AND raises the worst OCR contrast or
     reaches ≥ `preference.contrastMoreTarget`:1;
   - tinted lowers σ(interior) ÷ σ(scene under it) by ≥ `preference.tintedMinSigmaCut`;
   - solid and forced-colors leave 0 elements (incl. ::before) with computed backdrop-filter ≠ none inside the subject;
   - a 0.000 delta between the mode and default fails `preference-noop` (NOOP_MAX_SHARE: a changed share that
     rounds to 0.000 at the REQ's three decimals — an exact-0 test would call re-render noise a response). */
import { assertSameSize, channelDelta, forEachOffset, lumaStats, type Rect, type Rgba } from './raster';
import type { GateResult } from './gate';
import type { BackdropRect } from './density';

/** Share of pixels inside `regions` (device px; overlapping regions counted once) that differ by > minDelta levels. */
export function changedShare(a: Rgba, b: Rgba, regions: readonly Rect[], minDelta: number): { share: number; changed: number; total: number; anyDelta: number } {
  assertSameSize(a, b, 'preference');
  const seen = new Uint8Array(a.width * a.height);
  let total = 0; let changed = 0; let any = 0;
  for (const r of regions) {
    forEachOffset(a, r, (o, x, y) => {
      const i = y * a.width + x;
      if (seen[i]) return;
      seen[i] = 1; total++;
      const d = channelDelta(a.data, b.data, o);
      if (d > 0) any++;
      if (d > minDelta) changed++;
    });
  }
  return { share: total ? changed / total : 0, changed, total, anyDelta: any };
}

/** REQ-QUAL-16 "a 0.000 delta": the largest changed share that still rounds to 0.000 at three decimals. */
export const NOOP_MAX_SHARE = 0.0005;

export function noop(mode: string, delta: { anyDelta: number; total: number }): GateResult {
  const share = delta.total > 0 ? delta.anyDelta / delta.total : 0;
  const isNoop = delta.total > 0 && share < NOOP_MAX_SHARE;
  return { gate: 'preference-noop', status: isNoop ? 'fail' : 'pass', value: share, limit: NOOP_MAX_SHARE,
    detail: isNoop ? `${mode}: 0.000 pixel delta vs default over ${delta.total} subject px (${delta.anyDelta} px differ, share ${share.toFixed(3)})` : `${mode}: ${delta.anyDelta} px differ from default` };
}

export function contrastMoreGate(delta: { share: number }, worstDefault: number | null, worstMore: number | null, t: { contrastMoreMinShare: number; contrastMoreTarget: number }): GateResult[] {
  const out: GateResult[] = [{ gate: 'contrast-more-change', status: delta.share >= t.contrastMoreMinShare ? 'pass' : 'fail', value: delta.share, limit: t.contrastMoreMinShare,
    detail: `contrast-more changes ${(delta.share * 100).toFixed(2)} % of surface pixels (≥${t.contrastMoreMinShare * 100} % required)` }];
  if (worstMore === null) {
    out.push({ gate: 'contrast-more-ocr', status: 'not-applicable', detail: 'no subject text measured by OCR' });
  } else {
    const raised = worstDefault !== null && worstMore > worstDefault;
    const ok = raised || worstMore >= t.contrastMoreTarget;
    out.push({ gate: 'contrast-more-ocr', status: ok ? 'pass' : 'fail', value: worstMore, limit: t.contrastMoreTarget,
      detail: `worst OCR contrast ${worstDefault === null ? 'n/a' : worstDefault.toFixed(2)}:1 default → ${worstMore.toFixed(2)}:1 contrast-more (must rise or reach ${t.contrastMoreTarget}:1)` });
  }
  return out;
}

/** σ(interior) ÷ σ(scene under it) per surface for one capture + its scene-only capture. */
export function sigmaRatio(capture: Rgba, sceneOnly: Rgba, interior: Rect): number | null {
  const c = lumaStats(capture, interior); const s = lumaStats(sceneOnly, interior);
  if (!c.n || !(s.sigma > 0)) return null;
  return c.sigma / s.sigma;
}

export function tintedGate(ratioDefault: number | null, ratioTinted: number | null, t: { tintedMinSigmaCut: number }, label: string): GateResult {
  if (ratioDefault === null || ratioTinted === null) return { gate: 'tinted-sigma-cut', status: 'not-applicable', detail: `${label}: the scene under the surface is flat (σ = 0)` };
  const cut = ratioDefault > 0 ? 1 - ratioTinted / ratioDefault : 0;
  return { gate: 'tinted-sigma-cut', status: cut >= t.tintedMinSigmaCut ? 'pass' : 'fail', value: cut, limit: t.tintedMinSigmaCut,
    detail: `${label}: σ(interior)/σ(scene) ${ratioDefault.toFixed(3)} default → ${ratioTinted.toFixed(3)} tinted, cut ${(cut * 100).toFixed(1)} % (≥${t.tintedMinSigmaCut * 100} % required)` };
}

export function noBackdropGate(mode: 'solid' | 'forced-colors', rects: readonly BackdropRect[]): GateResult {
  return { gate: `${mode}-no-backdrop`, status: rects.length ? 'fail' : 'pass', value: rects.length, limit: 0,
    detail: rects.length ? `${mode}: ${rects.length} element(s) keep backdrop-filter: ${rects.slice(0, 6).map((r) => `${r.selector}${r.pseudo} ${r.filter}`).join('; ')}` : `${mode}: 0 backdrop-filter elements` };
}
