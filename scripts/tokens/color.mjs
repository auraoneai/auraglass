/* Color math for the token compiler (MAT-042/046): OKLCH -> OKLab -> linear sRGB -> sRGB,
   plus relative luminance + WCAG contrast ratio. No dependencies.
   The WCAG math itself lives in src/theme/wcag.mjs, the one module shared with
   src/theme/color.ts (REQ-FIN-03 / REQ-MAT-10); this file only re-exports it. */
import {
  srgbChannelFromLinear,
  srgbChannelToLinear,
  wcagComposite,
  wcagContrastRatio,
  wcagRelativeLuminance,
} from '../../src/theme/wcag.mjs';

// OKLab <-> LMS' (nonlinear) : Oklab spec
const OKLAB_TO_LMSPRIME = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092],
];
// LMS (linear) <-> linear sRGB : Oklab spec
const LIN_SRGB_TO_LMS = [
  [0.41222147079999993, 0.5363325363, 0.0514459929],
  [0.2119034981999999, 0.6806995450999999, 0.1073969566],
  [0.08830246189999998, 0.2817188376, 0.6299787005],
];

const matVec = (m, v) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);

const srgbTransfer = srgbChannelFromLinear;
const srgbTransferInv = srgbChannelToLinear;

/** oklch {l,c,h} -> [r,g,b] floats 0..1 (may exceed gamut; use gamutMap to clamp). */
export function oklchToSrgb({ l, c, h }) {
  const hr = (h * Math.PI) / 180;
  const lab = [l, c * Math.cos(hr), c * Math.sin(hr)];
  const lms = matVec(OKLAB_TO_LMSPRIME, lab).map((x) => x ** 3);
  return matVec(LMS_TO_LIN_SRGB, lms).map(srgbTransfer);
}

/** [r,g,b] 0..1 -> oklch {l,c,h} */
export function srgbToOklch([r, g, b]) {
  const lin = [r, g, b].map(srgbTransferInv);
  const lms = matVec(LIN_SRGB_TO_LMS, lin).map(Math.cbrt);
  const [l, a, bb] = matVec(LMSPRIME_TO_OKLAB, lms);
  const h = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l, c: Math.hypot(a, bb), h };
}
const LMS_TO_LIN_SRGB = invert3(LIN_SRGB_TO_LMS);
const LMSPRIME_TO_OKLAB = invert3(OKLAB_TO_LMSPRIME);
function invert3(m) {
  const [a, b, c] = m;
  const det =
    a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
  const inv = [
    [(b[1] * c[2] - b[2] * c[1]) / det, (a[2] * c[1] - a[1] * c[2]) / det, (a[1] * b[2] - a[2] * b[1]) / det],
    [(b[2] * c[0] - b[0] * c[2]) / det, (a[0] * c[2] - a[2] * c[0]) / det, (a[2] * b[0] - a[0] * b[2]) / det],
    [(b[0] * c[1] - b[1] * c[0]) / det, (a[1] * c[0] - a[0] * c[1]) / det, (a[0] * b[1] - a[1] * b[0]) / det],
  ];
  return inv;
}

/** Reduce chroma until inside sRGB gamut (simple binary-search gamut mapping on C). */
export function gamutMapOklch({ l, c, h }) {
  const inGamut = (v) => oklchToSrgb(v).every((x) => x >= -1e-4 && x <= 1.0001);
  if (inGamut({ l, c, h })) return { l, c, h };
  let lo = 0, hi = c;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ l, c: mid, h })) lo = mid; else hi = mid;
  }
  return { l, c: lo, h };
}

export function clampSrgb([r, g, b]) {
  return [r, g, b].map((x) => Math.min(1, Math.max(0, x)));
}

export function srgbToHex([r, g, b]) {
  const f = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0');
  return `#${f(r)}${f(g)}${f(b)}`;
}

export function hexToSrgb(hex) {
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex);
  if (!m) throw new Error(`bad hex ${hex}`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
}

/** WCAG 2.x relative luminance / contrast ratio / source-over composite:
    re-exported from the shared module, never re-implemented here. */
export {
  wcagRelativeLuminance as relativeLuminance,
  wcagContrastRatio as contrastRatio,
  wcagComposite as composite,
};

/** Any DTCG colorValue -> {rgb:[0..1], alpha} in sRGB. Supports oklch + hex. */
export function colorToSrgb(cv) {
  if (cv?.hex) return { rgb: hexToSrgb(cv.hex), alpha: cv.alpha ?? 1 };
  if (cv?.colorSpace === 'oklch') {
    const { l, c, h } = { l: cv.components[0], c: cv.components[1], h: cv.components[2] };
    return { rgb: clampSrgb(oklchToSrgb(gamutMapOklch({ l, c, h }))), alpha: cv.alpha ?? 1 };
  }
  if (cv?.colorSpace === 'srgb') return { rgb: clampSrgb(cv.components.map(Number)), alpha: cv.alpha ?? 1 };
  throw new Error(`unsupported colorSpace ${JSON.stringify(cv)}`);
}

/** Serialize a DTCG colorValue to CSS (OKLCH authored stays OKLCH; hex stays hex). */
export function colorToCss(cv) {
  if (cv?.hex) {
    const a = cv.alpha ?? 1;
    return a >= 1 ? cv.hex.toLowerCase() : `${cv.hex.toLowerCase()}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
  }
  if (cv?.colorSpace === 'oklch') {
    const [l, c, h] = cv.components;
    const a = cv.alpha ?? 1;
    const fmt = (x) => (typeof x === 'number' ? +x.toFixed(4) : x);
    return a >= 1
      ? `oklch(${fmt(l)} ${fmt(c)} ${fmt(h)})`
      : `oklch(${fmt(l)} ${fmt(c)} ${fmt(h)} / ${fmt(a)})`;
  }
  if (cv?.colorSpace === 'srgb') {
    const [r, g, b] = cv.components.map((x) => Math.round(Number(x) * 255));
    const a = cv.alpha ?? 1;
    return a >= 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${a})`;
  }
  throw new Error(`unsupported colorSpace ${JSON.stringify(cv)}`);
}
