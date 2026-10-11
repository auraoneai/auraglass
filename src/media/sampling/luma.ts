'use client';
/* REQ-SURF-151/152 — BT.709 relative luminance over raw RGBA bytes.
 * SURF owns its own luma (src/theme/color.ts is MAT's). Pure: no DOM. */

/** BT.709 luminance of one sRGB pixel (0..1). */
export function pixelLuma(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export interface LumaStats {
  mean: number;
  p10: number;
  p90: number;
  stdev: number;
}

/** computeLumaStats(data, width, height): percentile luma stats over an RGBA
 * buffer (getImageData shape). Alpha <128 pixels are ignored. */
export function computeLumaStats(data: Uint8ClampedArray | number[], width: number, height: number): LumaStats {
  const lumas: number[] = [];
  const px = width * height;
  for (let i = 0; i < px; i++) {
    const o = i * 4;
    const a = data[o + 3] ?? 255;
    if (a < 128) continue;
    lumas.push(pixelLuma(data[o] ?? 0, data[o + 1] ?? 0, data[o + 2] ?? 0));
  }
  if (!lumas.length) return { mean: 0, p10: 0, p90: 0, stdev: 0 };
  lumas.sort((a, b) => a - b);
  const mean = lumas.reduce((n, l) => n + l, 0) / lumas.length;
  const stdev = Math.sqrt(lumas.reduce((n, l) => n + (l - mean) ** 2, 0) / lumas.length);
  const pct = (p: number) => lumas[Math.min(lumas.length - 1, Math.floor((p / 100) * lumas.length))] ?? 0;
  return { mean, p10: pct(10), p90: pct(90), stdev };
}
