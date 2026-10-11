/* WCAG 2.x math (luminance, contrast ratio, composite, sRGB transfer) lives in
   ./wcag.mjs, the one module shared with the tokens build (scripts/tokens/color.mjs
   re-exports it for the contrast solver). REQ-FIN-03 / REQ-MAT-10: never
   re-implement it in this file. */
import {
  srgbChannelFromLinear,
  srgbChannelToLinear,
  wcagComposite,
  wcagContrastRatio,
  wcagRelativeLuminance,
} from './wcag.mjs';

export interface GlassRgb {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, Math.round(value)));

export const normalizeHexColor = (input: string): string => {
  const value = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return `#${value.toLowerCase()}`;
  }
  return "#7dd3fc"; // @ag-literal-allowed: color-math
};

export const hexToRgb = (input: string): GlassRgb => {
  const hex = normalizeHexColor(input).slice(1);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

export const rgbToHex = ({ r, g, b }: GlassRgb): string =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;

export const mixHex = (from: string, to: string, amount: number): string => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = Math.min(1, Math.max(0, amount));
  return rgbToHex({
    r: a.r + (b.r - a.r) * mix,
    g: a.g + (b.g - a.g) * mix,
    b: a.b + (b.b - a.b) * mix,
  });
};

export const relativeLuminance = (input: string): number => {
  const { r, g, b } = hexToRgb(input);
  return wcagRelativeLuminance([r / 255, g / 255, b / 255]);
};

export const contrastRatio = (
  foreground: string,
  background: string
): number => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  return wcagContrastRatio([fg.r / 255, fg.g / 255, fg.b / 255], [bg.r / 255, bg.g / 255, bg.b / 255]);
};

export const bestTextColor = (
  background: string,
  light = "#f8fafc", // @ag-literal-allowed: color-math
  dark = "#06111f" // @ag-literal-allowed: color-math
): string =>
  contrastRatio(light, background) >= contrastRatio(dark, background)
    ? light
    : dark;

/* ------------------------------------------------------------------ */
/* 5.0 additions (MAT-045): parseColor + OKLCH math + WCAG 2.2/APCA/dE2K.  */
/* ------------------------------------------------------------------ */

export interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha?: number;
}

export interface Srgb {
  r: number; // 0..1
  g: number;
  b: number;
  alpha?: number;
}

// OKLab <-> LMS' (Oklab spec)
type Mat3 = [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
const OKLAB_TO_LMSPRIME: Mat3 = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092],
];
const LIN_SRGB_TO_LMS: Mat3 = [
  [0.41222147079999993, 0.5363325363, 0.0514459929],
  [0.2119034981999999, 0.6806995450999999, 0.1073969566],
  [0.08830246189999998, 0.2817188376, 0.6299787005],
];

const matVec = (m: Mat3, v: readonly number[]): [number, number, number] =>
  [0, 1, 2].map((i) => {
    const r = m[i]!;
    return r[0] * v[0]! + r[1] * v[1]! + r[2] * v[2]!;
  }) as [number, number, number];

const srgbTransfer = srgbChannelFromLinear;
const srgbTransferInv = srgbChannelToLinear;

const invert3 = (m: Mat3): Mat3 => {
  const [a, b, c] = m;
  const det =
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0]);
  return [
    [
      (b[1] * c[2] - b[2] * c[1]) / det,
      (a[2] * c[1] - a[1] * c[2]) / det,
      (a[1] * b[2] - a[2] * b[1]) / det,
    ],
    [
      (b[2] * c[0] - b[0] * c[2]) / det,
      (a[0] * c[2] - a[2] * c[0]) / det,
      (a[2] * b[0] - a[0] * b[2]) / det,
    ],
    [
      (b[0] * c[1] - b[1] * c[0]) / det,
      (a[1] * c[0] - a[0] * c[1]) / det,
      (a[0] * b[1] - a[1] * b[0]) / det,
    ],
  ];
};
const LMS_TO_LIN_SRGB = invert3(LIN_SRGB_TO_LMS);
const LMSPRIME_TO_OKLAB = invert3(OKLAB_TO_LMSPRIME);

/** Oklch -> sRGB channel floats 0..1 (may exceed gamut before mapping). */
export const oklchToSrgbRaw = (color: Oklch): [number, number, number] => {
  const hr = (color.h * Math.PI) / 180;
  const lab = [color.l, color.c * Math.cos(hr), color.c * Math.sin(hr)];
  const lms = matVec(OKLAB_TO_LMSPRIME, lab).map((x) => x ** 3) as [number, number, number];
  const [r, g, b] = matVec(LMS_TO_LIN_SRGB, lms);
  return [srgbTransfer(r), srgbTransfer(g), srgbTransfer(b)];
};

/** sRGB (0..1) -> Oklch. */
export const srgbToOklch = (input: Srgb | [number, number, number]): Oklch => {
  const arr = (Array.isArray(input) ? input : [input.r, input.g, input.b]) as [number, number, number];
  const lin = arr.map(srgbTransferInv) as [number, number, number];
  const lms = matVec(LIN_SRGB_TO_LMS, lin).map(Math.cbrt) as [number, number, number];
  const [l, a, bb] = matVec(LMSPRIME_TO_OKLAB, lms);
  const h = (((Math.atan2(bb, a) * 180) / Math.PI) + 360) % 360;
  return { l, c: Math.hypot(a, bb), h };
};

const inSrgbGamut = (o: Oklch) =>
  oklchToSrgbRaw(o).every((x) => x >= -1e-4 && x <= 1.0001);

/** CSS Color 4 gamut mapping: binary-search chroma reduction holding L,H.
 *  Guaranteed within dEOK < 0.02 of the CSS reference algorithm's result
 *  for the token/theme domain. */
export const oklchToSrgb = (
  color: Oklch
): Srgb & { inGamut: boolean } => {
  let mapped = color;
  let inGamut = inSrgbGamut(color);
  if (!inGamut) {
    let lo = 0;
    let hi = color.c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inSrgbGamut({ ...color, c: mid })) lo = mid;
      else hi = mid;
    }
    mapped = { ...color, c: lo };
  }
  const [r, g, b] = oklchToSrgbRaw(mapped).map((x) =>
    Math.min(1, Math.max(0, x))
  ) as [number, number, number];
  return { r, g, b, ...(color.alpha !== undefined ? { alpha: color.alpha } : {}), inGamut };
};

/** Parse hex / rgb() / hsl() / oklch() into Oklch. */
export const parseColor = (input: string | Oklch): Oklch => {
  if (typeof input === "object" && input !== null) return input;
  const s = input.trim().toLowerCase();
  const hex = normalizeHexColor(s);
  if (/^#[0-9a-f]{6}$/.test(hex) && /^#[0-9a-f]{3,8}$/.test(s)) {
    const { r, g, b } = hexToRgb(hex);
    return srgbToOklch([r / 255, g / 255, b / 255]);
  }
  let m = /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/.exec(s);
  if (m) {
    const alpha = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { ...srgbToOklch([Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255]), alpha };
  }
  m = /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+))?\s*\)$/.exec(s);
  if (m) {
    const h = ((Number(m[1]) % 360) + 360) % 360;
    const sat = Number(m[2]) / 100;
    const lig = Number(m[3]) / 100;
    const a = (sat * Math.min(lig, 1 - lig)) || 0;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return lig - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return srgbToOklch([f(0), f(8), f(4)]);
  }
  m = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)\s*(?:\/\s*([\d.]+|%|none))?\s*\)$/.exec(s);
  if (m) {
    const l = m[2] === "%" ? Number(m[1]) / 100 : Number(m[1]);
    const alpha = m[5] === undefined || m[5] === "none" ? 1 : m[5] === "%" ? 1 : Number(m[5]);
    return { l, c: Number(m[3]), h: m[4] === "none" ? 0 : Number(m[4]), alpha };
  }
  throw new Error(`parseColor: unsupported input '${input}'`);
};

/** sRGB hex/parse -> {r,g,b,alpha} 0..1. */
const toSrgb = (input: string | Srgb | Oklch): Srgb => {
  if (typeof input === "string") {
    const ok = parseColor(input);
    return oklchToSrgb(ok);
  }
  if ("l" in input) return oklchToSrgb(input);
  return input;
};

const toSrgbFlat = (input: string | Srgb | Oklch): [number, number, number, number] => {
  const s = toSrgb(input);
  return [s.r, s.g, s.b, s.alpha ?? 1];
};

/** WCAG 2.2 contrast ratio between two colors (any parseable input). */
export const wcagContrast = (
  a: string | Srgb | Oklch,
  b: string | Srgb | Oklch
): number => {
  return wcagContrastRatio(toSrgbFlat(a).slice(0, 3), toSrgbFlat(b).slice(0, 3));
};

/** source-over composite: fg (with alpha) over opaque bg, returning opaque sRGB. */
export const compositeOver = (
  fg: string | Srgb | Oklch,
  bg: string | Srgb | Oklch
): Srgb => {
  const [fr, fgG, fb, fa] = toSrgbFlat(fg);
  const [br, bgG, bb] = toSrgbFlat(bg);
  const [r, g, b] = wcagComposite([fr, fgG, fb], fa, [br, bgG, bb]);
  return { r, g, b, alpha: 1 };
};

/** Advisory APCA Lc (W3 formula, polarity-aware). Positive = dark text on light bg. */
export const apcaLc = (
  text: string | Srgb | Oklch,
  background: string | Srgb | Oklch
): number => {
  const y = (s: string | Srgb | Oklch) => {
    const [r, g, b] = toSrgbFlat(s).map((x) => Math.pow(x, 2.2)) as [number, number, number];
    return Math.min(1.1, Math.max(0, 0.2126729 * r + 0.7151522 * g + 0.072175 * b));
  };
  const txtY = y(text);
  const bgY = y(background);
  const darkOnLight = bgY > txtY;
  const scale = (v: number) =>
    v <= 0.022 ? v + Math.pow(0.022 - v, 1.414) : v;
  const sapc = darkOnLight
    ? (Math.pow(scale(bgY), 0.56) - Math.pow(scale(txtY), 0.57)) * 1.14
    : (Math.pow(scale(bgY), 0.65) - Math.pow(scale(txtY), 0.62)) * 1.14;
  const lc = sapc * 100;
  if (Math.abs(lc) < 0.1) return 0;
  // polarity offset
  return lc > 0 ? lc - 2.7 : lc + 2.7;
};

/** Serialize Oklch as a CSS color string. Lives here because `oklch(` literals
 *  are only allowed in this file (MAT-056 line allowance). */
export const formatOklch = (o: Oklch): string => `oklch(${+o.l.toFixed(4)} ${+o.c.toFixed(4)} ${+o.h.toFixed(4)}${o.alpha !== undefined && o.alpha < 1 ? ` / ${o.alpha}` : ""})`; // @ag-literal-allowed: color-math

/** Serialize a light/dark pair as `light-dark(<light>, <dark>)`. */
export const formatLightDark = (light: string, dark: string): string =>
  `light-dark(${light}, ${dark})`;

/** @supports query probing relative-color syntax (oklch(from ...) support). */
export const RELATIVE_OKLCH_QUERY = "color: oklch(from red l c h)"; // @ag-literal-allowed: color-math

// sRGB -> CIE Lab (D50) for deltaE2000
const srgbToLab = (input: string | Srgb | Oklch): [number, number, number] => {
  const [r, g, b] = toSrgbFlat(input).map(srgbTransferInv) as [number, number, number];
  // linear sRGB -> XYZ (D65)
  const x = r * 0.41239079926595934 + g * 0.357584339383878 + b * 0.1804807884018343;
  const y = r * 0.21263900587151027 + g * 0.715168678767756 + b * 0.07219231536073371;
  const z = r * 0.01933081871559182 + g * 0.11919477979462598 + b * 0.9505321522496607;
  // XYZ (D65) -> XYZ (D50) via Bradford
  const x50 = x * 1.0479298208405488 + y * 0.022946793341019088 + z * -0.05019222954313557;
  const y50 = x * 0.029627815688419344 + y * 0.990434484573249 + z * -0.01707382502938514;
  const z50 = x * -0.009243082152497774 + y * 0.015055144896577895 + z * 0.7518742814281371;
  const f = (t: number) =>
    t > 0.008856451679035631 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29;
  const fx = f(x50 / 0.96422);
  const fy = f(y50);
  const fz = f(z50 / 0.82521);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

/** CIEDE2000 colour difference. */
export const deltaE2000 = (
  a: string | Srgb | Oklch,
  b: string | Srgb | Oklch
): number => {
  const [L1, a1, b1] = srgbToLab(a);
  const [L2, a2, b2] = srgbToLab(b);
  const rad = Math.PI / 180;
  const c1 = Math.hypot(a1, b1);
  const c2 = Math.hypot(a2, b2);
  const cBar = (c1 + c2) / 2;
  const g =
    0.5 * (1 - Math.sqrt(Math.pow(cBar, 7) / (Math.pow(cBar, 7) + Math.pow(25, 7))));
  const ap1 = a1 * (1 + g);
  const ap2 = a2 * (1 + g);
  const cp1 = Math.hypot(ap1, b1);
  const cp2 = Math.hypot(ap2, b2);
  const hp = (ap: number, bb: number) => {
    if (ap === 0 && bb === 0) return 0;
    const h = (Math.atan2(bb, ap) * 180) / Math.PI;
    return h >= 0 ? h : h + 360;
  };
  const hp1 = hp(ap1, b1);
  const hp2 = hp(ap2, b2);
  const dL = L2 - L1;
  const dC = cp2 - cp1;
  let dhp = 0;
  if (cp1 * cp2 !== 0) {
    dhp = hp2 - hp1;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dH = 2 * Math.sqrt(cp1 * cp2) * Math.sin((dhp / 2) * rad);
  const LBar = (L1 + L2) / 2;
  const cpBar = (cp1 + cp2) / 2;
  let hpBar = hp1 + hp2;
  if (cp1 * cp2 !== 0) {
    hpBar =
      Math.abs(hp1 - hp2) <= 180
        ? (hp1 + hp2) / 2
        : hp1 + hp2 < 360
        ? (hp1 + hp2 + 360) / 2
        : (hp1 + hp2 - 360) / 2;
  }
  const t =
    1 -
    0.17 * Math.cos((hpBar - 30) * rad) +
    0.24 * Math.cos(2 * hpBar * rad) +
    0.32 * Math.cos((3 * hpBar + 6) * rad) -
    0.2 * Math.cos((4 * hpBar - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hpBar - 275) / 25, 2));
  const rc =
    2 * Math.sqrt(Math.pow(cpBar, 7) / (Math.pow(cpBar, 7) + Math.pow(25, 7)));
  const sl = 1 + (0.015 * Math.pow(LBar - 50, 2)) / Math.sqrt(20 + Math.pow(LBar - 50, 2));
  const sc = 1 + 0.045 * cpBar;
  const sh = 1 + 0.015 * cpBar * t;
  const rt = -Math.sin(2 * dTheta * rad) * rc;
  return Math.sqrt(
    Math.pow(dL / sl, 2) +
      Math.pow(dC / sc, 2) +
      Math.pow(dH / sh, 2) +
      rt * (dC / sc) * (dH / sh)
  );
};
