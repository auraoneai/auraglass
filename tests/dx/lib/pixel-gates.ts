/* tests/dx/lib/pixel-gates.ts — PLAT-368/369, REQ-PLAT-97. PLAT's own
   implementation of the architecture §15.2 pixel gates for the registry render
   gate (never imports certification/** or packages/qa). Pure functions over
   RGBA captures (decoded in-page from Playwright screenshots, no PNG decoder
   dependency) and DOM-measured rects. Rects are device px unless noted.

   Gates and thresholds (§15.2 / REQ-QUAL-15 numbers):
     notBlank        max channel deviation from the subject-hidden capture ≥ 40 levels
     separation      ≥ 25 % of a surface's pixels differ by > 10 levels from the
                     capture with that surface hidden
     textContrast    rendered-pixel contrast of each DOM-located text run:
                     ≥ 4.5:1 body, ≥ 3:1 large text and glyphs (worst case wins)
     glassDensity    Σ visible area with computed backdrop-filter ≠ none ÷ viewport ≤ 0.3
     materialPresence glass: no surface is glass over nothing (σ(L) under the
                     hidden surface ≥ 4 levels when the backdrop itself varies,
                     σ ≥ 20); solid: no visible backdrop-filter at all */

export interface Frame { data: Uint8ClampedArray | number[]; width: number; height: number }
export interface Rect { x: number; y: number; w: number; h: number }
export type GateStatus = 'pass' | 'fail' | 'not-applicable';
export interface GateResult { gate: string; status: GateStatus; value?: number; limit?: number; detail: string }

export const THRESHOLDS = {
  notBlank: { minDeviation: 40 },
  separation: { minShare: 0.25, minDelta: 10 },
  density: { max: 0.3 },
  contrast: { body: 4.5, large: 3, glyph: 3 },
  presence: { maxStageSigma: 4, minSceneSigma: 20 },
} as const;

const clampRect = (f: Frame, r: Rect) => {
  const x0 = Math.max(0, Math.floor(r.x)), y0 = Math.max(0, Math.floor(r.y));
  const x1 = Math.min(f.width, Math.ceil(r.x + r.w)), y1 = Math.min(f.height, Math.ceil(r.y + r.h));
  return { x0, y0, x1, y1, n: Math.max(0, x1 - x0) * Math.max(0, y1 - y0) };
};
function forEachPx(f: Frame, r: Rect, fn: (o: number) => void): number {
  const c = clampRect(f, r);
  if (c.n === 0) return 0;
  for (let y = c.y0; y < c.y1; y++) for (let x = c.x0; x < c.x1; x++) fn((y * f.width + x) * 4);
  return c.n;
}
const same = (a: Frame, b: Frame, gate: string) => {
  if (a.width !== b.width || a.height !== b.height) throw new Error(`${gate}: captures differ in size (${a.width}x${a.height} vs ${b.width}x${b.height})`);
};

/** Luma in levels (0..255), Rec. 709 weights. */
const luma = (d: Frame['data'], o: number) => 0.2126 * d[o]! + 0.7152 * d[o + 1]! + 0.0722 * d[o + 2]!;
const channelDelta = (a: Frame['data'], b: Frame['data'], o: number) =>
  Math.max(Math.abs(a[o]! - b[o]!), Math.abs(a[o + 1]! - b[o + 1]!), Math.abs(a[o + 2]! - b[o + 2]!));

export function lumaStats(f: Frame, r: Rect): { mean: number; sigma: number; n: number } {
  let s = 0, s2 = 0;
  const n = forEachPx(f, r, (o) => { const l = luma(f.data, o); s += l; s2 += l * l; });
  if (!n) return { mean: 0, sigma: 0, n: 0 };
  const mean = s / n;
  return { mean, sigma: Math.sqrt(Math.max(0, s2 / n - mean * mean)), n };
}

/** CSS-px rect → device-px rect for a capture of a viewport `cssWidth` wide. */
export function toDevice(r: { x: number; y: number; width: number; height: number }, dpr: number): Rect {
  return { x: r.x * dpr, y: r.y * dpr, w: r.width * dpr, h: r.height * dpr };
}

export function notBlank(capture: Frame, subjectHidden: Frame, box: Rect, t = THRESHOLDS.notBlank): GateResult {
  same(capture, subjectHidden, 'not-blank');
  let max = 0;
  const n = forEachPx(capture, box, (o) => { const d = channelDelta(capture.data, subjectHidden.data, o); if (d > max) max = d; });
  if (!n) return { gate: 'not-blank', status: 'fail', value: 0, limit: t.minDeviation, detail: 'subject box lies outside the capture' };
  return { gate: 'not-blank', status: max >= t.minDeviation ? 'pass' : 'fail', value: max, limit: t.minDeviation,
    detail: `max deviation ${max} levels from the subject-hidden capture (≥${t.minDeviation} required)` };
}

export function separation(capture: Frame, surfaceHidden: Frame, box: Rect, t = THRESHOLDS.separation): GateResult {
  same(capture, surfaceHidden, 'separation');
  let diff = 0;
  const n = forEachPx(capture, box, (o) => { if (channelDelta(capture.data, surfaceHidden.data, o) > t.minDelta) diff++; });
  if (!n) return { gate: 'separation', status: 'fail', value: 0, limit: t.minShare, detail: 'surface box lies outside the capture' };
  const share = diff / n;
  return { gate: 'separation', status: share >= t.minShare ? 'pass' : 'fail', value: share, limit: t.minShare,
    detail: `${(share * 100).toFixed(1)} % of surface pixels differ by >${t.minDelta} levels from the surface-hidden capture (≥${t.minShare * 100} % required)` };
}

/** WCAG 2 relative luminance of an sRGB pixel (0..1). */
export function relativeLuminance(r: number, g: number, b: number): number {
  const c = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}
export function contrastRatio(lumA: number, lumB: number): number {
  const hi = Math.max(lumA, lumB), lo = Math.min(lumA, lumB);
  return (hi + 0.05) / (lo + 0.05);
}

export interface TextRun { rect: Rect; large: boolean; glyph: boolean; label: string }

/** Contrast of one text run on rendered pixels: the background is the median
    luminance of the run's box, the ink is whichever of the 2nd/98th luminance
    percentile lies further from it (anti-aliasing never reaches the extremes). */
export function textContrast(capture: Frame, run: TextRun, t = THRESHOLDS.contrast): GateResult & { required: number } {
  const required = run.glyph ? t.glyph : run.large ? t.large : t.body;
  const ls: number[] = [];
  forEachPx(capture, run.rect, (o) => ls.push(relativeLuminance(capture.data[o]!, capture.data[o + 1]!, capture.data[o + 2]!)));
  if (ls.length < 4) return { gate: 'text-contrast', status: 'fail', value: 0, limit: required, required, detail: `${run.label}: text box lies outside the capture` };
  ls.sort((a, b) => a - b);
  const q = (p: number) => ls[Math.min(ls.length - 1, Math.max(0, Math.round(p * (ls.length - 1))))]!;
  const bg = q(0.5);
  const ratio = Math.max(contrastRatio(q(0.02), bg), contrastRatio(q(0.98), bg));
  return { gate: 'text-contrast', status: ratio >= required ? 'pass' : 'fail', value: ratio, limit: required, required,
    detail: `${run.label}: ${ratio.toFixed(2)}:1 (≥${required}:1 ${run.glyph ? 'glyph' : run.large ? 'large text' : 'body text'})` };
}

/** Worst case over every run (no runs: not applicable — nothing to read). */
export function worstTextContrast(capture: Frame, runs: TextRun[]): GateResult {
  if (!runs.length) return { gate: 'text-contrast', status: 'not-applicable', detail: 'no visible text runs' };
  const rs = runs.map((r) => textContrast(capture, r));
  const fails = rs.filter((r) => r.status === 'fail');
  const worst = rs.reduce((w, r) => ((r.value ?? 0) / r.required < (w.value ?? 0) / w.required ? r : w));
  return { gate: 'text-contrast', status: fails.length ? 'fail' : 'pass', value: worst.value ?? 0, limit: worst.required,
    detail: fails.length ? `${fails.length}/${rs.length} runs below threshold; ${fails.slice(0, 5).map((f) => f.detail).join('; ')}` : `worst ${worst.detail}` };
}

/** Σ visible backdrop-filter area (CSS px rects, clipped to the viewport) ÷ viewport area. */
export function glassDensity(rects: Array<{ x: number; y: number; width: number; height: number }>, viewport: { width: number; height: number }, t = THRESHOLDS.density): GateResult {
  let area = 0;
  for (const r of rects) {
    const w = Math.min(viewport.width, r.x + r.width) - Math.max(0, r.x);
    const h = Math.min(viewport.height, r.y + r.height) - Math.max(0, r.y);
    if (w > 0 && h > 0) area += w * h;
  }
  const density = area / (viewport.width * viewport.height);
  return { gate: 'glass-density', status: density <= t.max ? 'pass' : 'fail', value: density, limit: t.max,
    detail: `${rects.length} blurred node(s), density ${density.toFixed(3)} (≤${t.max} required)` };
}

/** Glass over nothing: σ(L) under a surface with only that surface hidden. Not
    applicable when the backdrop itself is flat (σ < minSceneSigma). */
export function glassOverNothing(surfaceHidden: Frame, box: Rect, backdropSigma: number, label: string, t = THRESHOLDS.presence): GateResult {
  if (backdropSigma < t.minSceneSigma) {
    return { gate: 'material-presence', status: 'not-applicable', value: backdropSigma, limit: t.minSceneSigma, detail: `${label}: backdrop σ ${backdropSigma.toFixed(1)} < ${t.minSceneSigma} (flat backdrop)` };
  }
  const s = lumaStats(surfaceHidden, box);
  if (!s.n) return { gate: 'material-presence', status: 'fail', detail: `${label}: surface box lies outside the capture` };
  return { gate: 'material-presence', status: s.sigma >= t.maxStageSigma ? 'pass' : 'fail', value: s.sigma, limit: t.maxStageSigma,
    detail: `${label}: σ(L) under the hidden surface ${s.sigma.toFixed(2)} levels (<${t.maxStageSigma} = glass over an opaque stage)` };
}

/** Solid transparency removes every live blur. */
export function solidHasNoBlur(blurredVisible: number): GateResult {
  return { gate: 'material-presence', status: blurredVisible === 0 ? 'pass' : 'fail', value: blurredVisible, limit: 0,
    detail: `${blurredVisible} visible blurred node(s) under data-ag-transparency="solid" (0 required)` };
}

export const failed = (rs: GateResult[]) => rs.filter((r) => r.status === 'fail');
