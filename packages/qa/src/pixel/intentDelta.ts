/* REQ-QUAL-15 intent (QUAL). `prominent` / `intent` fills must read as different from the default fill:
   CIEDE2000 ΔE between each such fill and the default fill of the same subject ≥ `intentDeltaE`.
   Fills are the median colour of each element's interior (inset to skip rim and edge antialiasing) in the capture. */
import { insetRect, medianRgbIn, type Rect, type Rgb, type Rgba } from './raster';
import type { GateResult } from './gate';

// ---- sRGB → CIELAB (D65) → CIEDE2000 -------------------------------------------------------------------------------
function lin(c8: number): number { const c = c8 / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }

export function srgbToLab(c: Rgb): { L: number; a: number; b: number } {
  const r = lin(c[0]); const g = lin(c[1]); const b = lin(c[2]);
  const X = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const Z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t: number): number => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(X); const fy = f(Y); const fz = f(Z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

const deg = (r: number): number => (r * 180) / Math.PI;
const rad = (d: number): number => (d * Math.PI) / 180;

/** CIEDE2000 colour difference (Sharma, Wu & Dalal 2005), kL = kC = kH = 1. */
export function deltaE2000(c1: Rgb, c2: Rgb): number {
  const l1 = srgbToLab(c1); const l2 = srgbToLab(c2);
  const C1 = Math.hypot(l1.a, l1.b); const C2 = Math.hypot(l2.a, l2.b);
  const Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1 = (1 + G) * l1.a; const a2 = (1 + G) * l2.a;
  const C1p = Math.hypot(a1, l1.b); const C2p = Math.hypot(a2, l2.b);
  const hp = (b: number, a: number): number => { if (a === 0 && b === 0) return 0; const h = deg(Math.atan2(b, a)); return h >= 0 ? h : h + 360; };
  const h1 = hp(l1.b, a1); const h2 = hp(l2.b, a2);
  const dL = l2.L - l1.L; const dC = C2p - C1p;
  let dh = 0;
  if (C1p * C2p !== 0) { dh = h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dh / 2));
  const Lm = (l1.L + l2.L) / 2; const Cpm = (C1p + C2p) / 2;
  let hm = h1 + h2;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1 - h2) <= 180) hm = (h1 + h2) / 2;
    else hm = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  }
  const T = 1 - 0.17 * Math.cos(rad(hm - 30)) + 0.24 * Math.cos(rad(2 * hm)) + 0.32 * Math.cos(rad(3 * hm + 6)) - 0.2 * Math.cos(rad(4 * hm - 63));
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cpm ** 7 / (Cpm ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2);
  const Sc = 1 + 0.045 * Cpm; const Sh = 1 + 0.015 * Cpm * T;
  const Rt = -Math.sin(rad(2 * dTheta)) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}

export interface FillBox { rect: Rect; label: string; role: 'default' | 'prominent' | 'intent' }

/** Measures every intent/prominent fill against the median default fill. `not-applicable` when the subject has no
    default or no intent fill to compare (the lane records it; the matrix still requires intent stories per meta). */
export function intentDelta(capture: Rgba, boxes: readonly FillBox[], t: { intentDeltaE: number }, insetPx = 3): GateResult & { pairs: Array<{ label: string; deltaE: number }> } {
  const defaults = boxes.filter((b) => b.role === 'default');
  const marked = boxes.filter((b) => b.role !== 'default');
  if (!defaults.length || !marked.length) {
    return { gate: 'intent-delta', status: 'not-applicable', detail: `${defaults.length} default and ${marked.length} prominent/intent fill(s) in the subject`, pairs: [] };
  }
  const fill = (b: FillBox): Rgb => medianRgbIn(capture, insetRect(b.rect, insetPx));
  const defaultFills = defaults.map(fill);
  const ref: Rgb = [0, 1, 2].map((k) => { const v = defaultFills.map((c) => c[k]!).sort((p, q) => p - q); return v[(v.length - 1) >> 1]!; }) as unknown as Rgb;
  const pairs = marked.map((b) => ({ label: b.label, deltaE: deltaE2000(ref, fill(b)) }));
  const worst = pairs.reduce((m, p) => (p.deltaE < m.deltaE ? p : m));
  const bad = pairs.filter((p) => p.deltaE < t.intentDeltaE);
  return {
    gate: 'intent-delta', status: bad.length ? 'fail' : 'pass', value: worst.deltaE, limit: t.intentDeltaE,
    detail: bad.length
      ? bad.map((p) => `${p.label} ΔE2000 ${p.deltaE.toFixed(2)} vs default (≥${t.intentDeltaE} required)`).join('; ')
      : `smallest ΔE2000 ${worst.deltaE.toFixed(2)} (${worst.label})`,
    pairs,
  };
}

/** In-page: interior boxes of the subject's material fills, classified by `data-ag-prominent` / `data-ag-intent`.
    Self-contained (serialised into the page). CSS px, viewport-relative. */
export function collectFillBoxes(rootSelector: string): FillBox[] {
  const root = document.querySelector(rootSelector);
  if (!root) return [];
  const out: FillBox[] = [];
  for (const el of root.querySelectorAll('[data-ag-surface]')) {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const intent = el.getAttribute('data-ag-intent');
    const role: FillBox['role'] = el.hasAttribute('data-ag-prominent') ? 'prominent' : intent && intent !== 'neutral' ? 'intent' : 'default';
    const part = el.getAttribute('data-ag-part');
    out.push({ rect: { x: r.left, y: r.top, w: r.width, h: r.height }, role,
      label: `${el.tagName.toLowerCase()}${part ? `[data-ag-part="${part}"]` : ''}${role === 'prominent' ? '[data-ag-prominent]' : ''}${role === 'intent' ? `[data-ag-intent="${intent}"]` : ''}` });
  }
  return out;
}
