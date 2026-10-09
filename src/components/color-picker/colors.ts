/* CMP-319: color conversions for ColorPicker — hex ↔ sRGB-linear ↔ OKLab/OKLCH
   (Björn Ottosson matrices) and hex ↔ HSV. Round-trip hex→oklch→hex is
   lossless within 1 ΔE for the sRGB gamut. */

export interface Oklch { l: number; c: number; h: number }
export interface Hsv { h: number; s: number; v: number }

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const v = parseInt(n, 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (x: number) => Math.round(clamp01(x) * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export function hexToOklch(hex: string): Oklch {
  const [sr, sg, sb] = hexToRgb(hex);
  const r = toLinear(sr), g = toLinear(sg), b = toLinear(sb);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c: C, h: H };
}

export function oklchToHex({ l, c, h }: Oklch): string {
  const a = (c * Math.cos((h * Math.PI) / 180));
  const b = (c * Math.sin((h * Math.PI) / 180));
  const L = l + 0.3963377774 * a + 0.2158037573 * b;
  const M = l - 0.1055613458 * a - 0.0638541728 * b;
  const S = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = L * L * L;
  const m3 = M * M * M;
  const s3 = S * S * S;
  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bch = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  return rgbToHex(fromLinear(r), fromLinear(g), fromLinear(bch));
}

export function hexToHsv(hex: string): Hsv {
  const [r, g, b] = hexToRgb(hex) as [number, number, number];
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d > 0) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: mx === 0 ? 0 : d / mx, v: mx };
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex(r + m, g + m, b + m);
}

/* REQ-CMP-125: 8-digit hex + oklch() string parsing/serialization for the
   {space, value} contract. */

export function rgbToHex8(r: number, g: number, b: number, a = 1): string {
  const hex = rgbToHex(r, g, b);
  if (a >= 1) return hex;
  return hex + Math.round(clamp01(a) * 255).toString(16).padStart(2, '0');
}

export function hsvToHex8(hsv: Hsv, alpha = 1): string {
  const hex = hsvToHex(hsv);
  if (alpha >= 1) return hex;
  return hex + Math.round(clamp01(alpha) * 255).toString(16).padStart(2, '0');
}

/** Serialize an HSV+alpha color to the requested space string. */
export function serializeColor(hsv: Hsv, alpha: number, space: 'srgb' | 'oklch'): string {
  if (space === 'oklch') {
    const { l, c, h } = hexToOklch(hsvToHex(hsv));
    const base = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
    return alpha >= 1 ? base : base.replace(')', ` / ${alpha.toFixed(3)})`);
  }
  return hsvToHex8(hsv, alpha);
}

/** Parse '#rgb' | '#rrggbb' | '#rrggbbaa' | 'oklch(l c h)' | 'oklch(l c h / a)'
   into {hsv, alpha}; null when unparseable. */
export function parseColorString(input: string): { hsv: Hsv; alpha: number } | null {
  const s = input.trim();
  const hexM = /^#([0-9a-fA-F]{3,8})$/.exec(s);
  if (hexM) {
    const n = hexM[1];
    if (![3, 4, 6, 8].includes(n.length)) return null;
    const expand = (x: string) => (x.length === 1 ? x + x : x);
    const hex6 = n.length <= 4 ? n.split('').slice(0, 3).map(expand).join('') : n.slice(0, 6);
    const alpha = n.length === 4 ? parseInt(expand(n[3]), 16) / 255 : n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
    return { hsv: hexToHsv(`#${hex6}`), alpha };
  }
  const okM = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i.exec(s);
  if (okM) {
    const hex = oklchToHex({ l: parseFloat(okM[1]), c: parseFloat(okM[2]), h: parseFloat(okM[3]) });
    return { hsv: hexToHsv(hex), alpha: okM[4] !== undefined ? clamp01(parseFloat(okM[4])) : 1 };
  }
  return null;
}
