/* REQ-QUAL-14 Glass over nothing (QUAL, FIN-430).
   1. glass-over-nothing: for each visible [data-ag-surface] with data-ag-variant ∈ {regular, clear} and a non-content
      layer, the lane captures the page with only that surface `visibility:hidden`; if σ(L) of the scene region under its
      border box is < `materialPresence.maxStageSigma` levels while the scene's manifest σ ≥ `minSceneSigma`, something
      opaque (a stage, a card, a painted ancestor) sits between the glass and the scene → fail `glass-over-nothing`.
   2. white/black interior delta (standard-tier glass cells): the mean interior luminance of the surface over flat-white
      and over flat-black must differ by ≥ `regularMinDelta` levels for `regular` (the scene shows through), and by
      ≤ (1 − floorAlpha) × 255 + `floorSlack` levels for every glass variant (the tint floor bounds the show-through),
      floorAlpha read from the token manifest (dist/tokens/manifest.json, S-11 `glass-material` entries). While the
      manifest has no floor for the key, that half is `pending` — never a pass. */
import { lumaStats, type Rect, type Rgba } from './raster';
import type { GateResult } from './gate';
import type { TokenManifest } from '../../../../src/contracts/tokens';

export interface PresenceThresholds { maxStageSigma: number; minSceneSigma: number; regularMinDelta: number; floorSlack: number }

/** `surfaceHidden`: capture with only this surface hidden; `box`: its border box in device px. */
export function glassOverNothing(surfaceHidden: Rgba, box: Rect, sceneSigma: number | null, t: PresenceThresholds, label = 'surface'): GateResult {
  if (sceneSigma === null) {
    return { gate: 'glass-over-nothing', status: 'pending', detail: `${label}: scene σ unknown (certification/scenes/scenes.manifest.json has no luminanceSigma for this scene; producer G-11)` };
  }
  if (sceneSigma < t.minSceneSigma) {
    return { gate: 'glass-over-nothing', status: 'not-applicable', value: sceneSigma, limit: t.minSceneSigma, detail: `${label}: scene σ ${sceneSigma.toFixed(1)} < ${t.minSceneSigma} (flat scene: an empty stage is indistinguishable)` };
  }
  const s = lumaStats(surfaceHidden, box);
  if (s.n === 0) return { gate: 'glass-over-nothing', status: 'fail', detail: `${label}: border box lies outside the capture` };
  const pass = s.sigma >= t.maxStageSigma;
  return {
    gate: 'glass-over-nothing', status: pass ? 'pass' : 'fail', value: s.sigma, limit: t.maxStageSigma,
    detail: `${label}: σ(L) under the border box ${s.sigma.toFixed(2)} levels with the surface hidden (scene σ ${sceneSigma.toFixed(1)}; <${t.maxStageSigma} means glass over an opaque stage)`,
  };
}

export interface FloorKey { variant: 'regular' | 'clear'; thickness: 'thin' | 'regular' | 'thick' }

/** floorAlpha for a variant/thickness from the S-11 manifest's `glass-material` entries, or null while absent.
    Accepted shapes of an entry's JSON `value`: `{variants:{<variant>:{<thickness>:{floorAlpha}}}}` or `{floorAlpha}` on an
    entry whose name ends with `.<variant>.<thickness>`. */
export function readFloorAlpha(manifest: TokenManifest | null, key: FloorKey): number | null {
  if (!manifest || !Array.isArray(manifest.tokens)) return null;
  for (const e of manifest.tokens) {
    if (e.type !== 'glass-material') continue;
    let v: unknown;
    try { v = JSON.parse(e.value); } catch { continue; } // a non-JSON value carries no floor
    const nested = (v as { variants?: Record<string, Record<string, { floorAlpha?: unknown }>> })?.variants?.[key.variant]?.[key.thickness]?.floorAlpha;
    if (typeof nested === 'number' && nested >= 0 && nested <= 1) return nested;
    const flat = (v as { floorAlpha?: unknown })?.floorAlpha;
    if (e.name.endsWith(`.${key.variant}.${key.thickness}`) && typeof flat === 'number' && flat >= 0 && flat <= 1) return flat;
  }
  return null;
}

/** Mean interior luminance (device-px rect inset by the caller) over flat-white vs flat-black. Returns two results:
    `glass-shows-scene` (regular only) and `glass-tint-floor` (pending while floorAlpha is null). */
export function whiteBlackDelta(
  overWhite: Rgba, overBlack: Rgba, interior: Rect, key: FloorKey, floorAlpha: number | null, t: PresenceThresholds,
): GateResult[] {
  const w = lumaStats(overWhite, interior); const b = lumaStats(overBlack, interior);
  if (w.n === 0 || b.n === 0) return [{ gate: 'glass-shows-scene', status: 'fail', detail: 'interior box lies outside the capture' }];
  const delta = Math.abs(w.mean - b.mean);
  const out: GateResult[] = [];
  if (key.variant === 'regular') {
    out.push({ gate: 'glass-shows-scene', status: delta >= t.regularMinDelta ? 'pass' : 'fail', value: delta, limit: t.regularMinDelta,
      detail: `regular/${key.thickness}: interior mean ${w.mean.toFixed(1)} over flat-white vs ${b.mean.toFixed(1)} over flat-black, Δ ${delta.toFixed(1)} (≥${t.regularMinDelta} required)` });
  }
  if (floorAlpha === null) {
    out.push({ gate: 'glass-tint-floor', status: 'pending', detail: `${key.variant}/${key.thickness}: dist/tokens/manifest.json has no glass-material floorAlpha for this key (producer MAT, S-11)` });
  } else {
    const max = (1 - floorAlpha) * 255 + t.floorSlack;
    out.push({ gate: 'glass-tint-floor', status: delta <= max ? 'pass' : 'fail', value: delta, limit: max,
      detail: `${key.variant}/${key.thickness}: white/black interior Δ ${delta.toFixed(1)} ≤ (1 − ${floorAlpha}) × 255 + ${t.floorSlack} = ${max.toFixed(1)} required` });
  }
  return out;
}

/** In-page: visible glass surfaces of the subject that the presence gate measures (regular/clear, non-content layer).
    Each gets a temporary `data-qa-surface` index so the lane can hide exactly one. Self-contained. */
export function markPresenceSurfaces(rootSelector: string): Array<{ index: number; rect: Rect; variant: string; thickness: string; label: string }> {
  const root = document.querySelector(rootSelector);
  if (!root) return [];
  const out: Array<{ index: number; rect: Rect; variant: string; thickness: string; label: string }> = [];
  let i = 0;
  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (!el.hasAttribute('data-ag-surface')) continue;
    const variant = el.getAttribute('data-ag-variant') ?? 'regular';
    if (variant !== 'regular' && variant !== 'clear') continue;
    if (el.getAttribute('data-ag-layer') === 'content' || el.hasAttribute('data-ag-content')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    el.setAttribute('data-qa-surface', String(i));
    const part = el.getAttribute('data-ag-part');
    out.push({ index: i, rect: { x: r.left, y: r.top, w: r.width, h: r.height }, variant, thickness: el.getAttribute('data-ag-thickness') ?? 'regular',
      label: `${el.tagName.toLowerCase()}[data-ag-variant="${variant}"]${part ? `[data-ag-part="${part}"]` : ''}` });
    i++;
  }
  return out;
}
