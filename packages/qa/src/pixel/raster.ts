/* REQ-QUAL-13..18 (QUAL, FIN-430). Shared raster primitives for the L6 pixel gates.
   Every capture reaches node as straight RGBA bytes decoded by the browser under test (canvas `getImageData`,
   certification/lanes/_fixtures/pixel-gates.ts); this package never decodes PNG itself and adds no PNG-decoder
   dependency (REQ-QUAL-15). Coordinates are device pixels of the capture; DOM rects are converted with `toDeviceRect`. */

export interface Rgba {
  width: number;
  height: number;
  /** straight (non-premultiplied) RGBA, 4 bytes per pixel, row-major */
  data: Uint8ClampedArray | Uint8Array;
}

/** Axis-aligned rectangle; x/y/w/h in the unit of the raster it addresses (device pixels unless stated). */
export interface Rect { x: number; y: number; w: number; h: number }

export type Rgb = readonly [number, number, number];

export function createRaster(width: number, height: number, fill: Rgb = [0, 0, 0]): Rgba {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error(`raster: invalid size ${width}x${height}`);
  }
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) { data[i] = fill[0]; data[i + 1] = fill[1]; data[i + 2] = fill[2]; data[i + 3] = 255; }
  return { width, height, data };
}

export function assertSameSize(a: Rgba, b: Rgba, what: string): void {
  if (a.width !== b.width || a.height !== b.height) throw new Error(`${what}: raster size ${a.width}x${a.height} ≠ ${b.width}x${b.height}`);
  if (a.data.length !== a.width * a.height * 4 || b.data.length !== b.width * b.height * 4) throw new Error(`${what}: raster byte length does not match its size`);
}

/** CSS-pixel DOM rect → device-pixel rect at `dpr`, rounded outward. */
export function toDeviceRect(r: Rect, dpr: number): Rect {
  const x0 = Math.floor(r.x * dpr); const y0 = Math.floor(r.y * dpr);
  const x1 = Math.ceil((r.x + r.w) * dpr); const y1 = Math.ceil((r.y + r.h) * dpr);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** Intersection of `r` with the raster bounds as integer [x0, y0, x1, y1) (empty when it lies outside). */
export function clampRect(img: Pick<Rgba, 'width' | 'height'>, r: Rect): { x0: number; y0: number; x1: number; y1: number; area: number } {
  const x0 = Math.max(0, Math.floor(r.x)); const y0 = Math.max(0, Math.floor(r.y));
  const x1 = Math.min(img.width, Math.ceil(r.x + r.w)); const y1 = Math.min(img.height, Math.ceil(r.y + r.h));
  const area = x1 > x0 && y1 > y0 ? (x1 - x0) * (y1 - y0) : 0;
  return { x0, y0, x1, y1, area };
}

/** Shrinks a rect by `px` on every side (never below zero size). */
export function insetRect(r: Rect, px: number): Rect {
  const dx = Math.min(px, r.w / 2); const dy = Math.min(px, r.h / 2);
  return { x: r.x + dx, y: r.y + dy, w: r.w - 2 * dx, h: r.h - 2 * dy };
}

export function pixelAt(img: Rgba, x: number, y: number): Rgb {
  const i = (y * img.width + x) * 4;
  return [img.data[i]!, img.data[i + 1]!, img.data[i + 2]!];
}

/** Calls `fn(offset)` for every pixel of `r` (clamped). `offset` indexes `img.data` at the red byte. */
export function forEachOffset(img: Rgba, r: Rect, fn: (offset: number, x: number, y: number) => void): number {
  const c = clampRect(img, r);
  for (let y = c.y0; y < c.y1; y++) {
    for (let x = c.x0; x < c.x1; x++) fn((y * img.width + x) * 4, x, y);
  }
  return c.area;
}

/** Rec.709 luma on sRGB-encoded 8-bit values, 0..255 — the definition certification/scenes/scenes.manifest.json uses. */
export function luma709(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface LumaStats { mean: number; sigma: number; n: number }

/** Mean and population σ of Rec.709 luma over `r`. */
export function lumaStats(img: Rgba, r: Rect): LumaStats {
  let sum = 0; let sq = 0;
  const n = forEachOffset(img, r, (o) => {
    const l = luma709(img.data[o]!, img.data[o + 1]!, img.data[o + 2]!);
    sum += l; sq += l * l;
  });
  if (n === 0) return { mean: Number.NaN, sigma: Number.NaN, n: 0 };
  const mean = sum / n;
  return { mean, sigma: Math.sqrt(Math.max(0, sq / n - mean * mean)), n };
}

/** Largest per-channel absolute difference between two pixels, in 8-bit levels. */
export function channelDelta(a: Rgba['data'], b: Rgba['data'], o: number): number {
  return Math.max(Math.abs(a[o]! - b[o]!), Math.abs(a[o + 1]! - b[o + 1]!), Math.abs(a[o + 2]! - b[o + 2]!));
}

/** Per-channel median of a list of colours (each channel independently; deterministic for even counts: lower median). */
export function medianRgb(colours: readonly Rgb[]): Rgb {
  if (colours.length === 0) throw new Error('medianRgb: no colours');
  const ch = (k: 0 | 1 | 2): number => {
    const v = colours.map((c) => c[k]).sort((p, q) => p - q);
    return v[(v.length - 1) >> 1]!;
  };
  return [ch(0), ch(1), ch(2)];
}

/** Median colour of every pixel in `r`. */
export function medianRgbIn(img: Rgba, r: Rect): Rgb {
  // 256-bucket histograms: exact per-channel median without sorting the region
  const h = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)] as const;
  const n = forEachOffset(img, r, (o) => { h[0][img.data[o]!]!++; h[1][img.data[o + 1]!]!++; h[2][img.data[o + 2]!]!++; });
  if (n === 0) throw new Error('medianRgbIn: empty region');
  const target = (n - 1) >> 1;
  const med = (hist: Uint32Array): number => {
    let acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]!; if (acc > target) return v; }
    return 255;
  };
  return [med(h[0]), med(h[1]), med(h[2])];
}

// ---- WCAG 2.x relative luminance and contrast ------------------------------------------------------------------------
function linear(c8: number): number {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance of an sRGB colour, 0..1. */
export function relativeLuminance(c: Rgb): number {
  return 0.2126 * linear(c[0]) + 0.7152 * linear(c[1]) + 0.0722 * linear(c[2]);
}

/** WCAG 2.x contrast ratio, 1..21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a); const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Composites a straight-alpha colour over an opaque one. */
export function over(front: Rgb, alpha: number, back: Rgb): Rgb {
  return [front[0] * alpha + back[0] * (1 - alpha), front[1] * alpha + back[1] * (1 - alpha), front[2] * alpha + back[2] * (1 - alpha)];
}

/** Parses `#rrggbb` (used by fixtures and reports). */
export function hex(h: string): Rgb {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h);
  if (!m) throw new Error(`hex: '${h}' is not #rrggbb`);
  return [parseInt(m[1]!, 16), parseInt(m[2]!, 16), parseInt(m[3]!, 16)];
}

export function fillRect(img: Rgba, r: Rect, c: Rgb): void {
  forEachOffset(img, r, (o) => { img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255; });
}

export function cloneRaster(img: Rgba): Rgba {
  return { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data) };
}
