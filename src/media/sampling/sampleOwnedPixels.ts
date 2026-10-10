'use client';
/* REQ-SURF-151/153 — sample pixels from a media element the library owns into
 * a 32×32 canvas, read once via getImageData. Never samples arbitrary DOM. */
import { computeLumaStats, type LumaStats } from './luma';

export type ToneStats = LumaStats;
export type SampleRegion = { x: number; y: number; width: number; height: number };

const SIZE = 32;
const warned = new Set<string>();
const warnOnce = (src: string) => {
  if (process.env['NODE_ENV'] === 'production' || warned.has(src)) return;
  warned.add(src);
  console.warn(
    `[aura-glass] Cannot sample ${src}: add crossOrigin="anonymous" and CORS headers, or pass mediaTone="light|dark" to Backdrop.`,
  );
};

function canvasSize(el: HTMLImageElement | HTMLVideoElement): { w: number; h: number } | null {
  const w = el instanceof HTMLImageElement ? el.naturalWidth : el.videoWidth;
  const h = el instanceof HTMLImageElement ? el.naturalHeight : el.videoHeight;
  return w > 0 && h > 0 ? { w, h } : null;
}

/** Draw → getImageData once. Returns null (no tone) on tainted canvas, decode
 * failure or zero natural size — never throws. */
export function sampleOwnedPixels(
  el: HTMLImageElement | HTMLVideoElement,
  region?: SampleRegion,
): ToneStats | null {
  const src = el.currentSrc || el.src || 'media';
  const dims = canvasSize(el);
  if (!dims) { warnOnce(src); return null; }
  const canvas: HTMLCanvasElement | OffscreenCanvas =
    typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(SIZE, SIZE) : Object.assign(document.createElement('canvas'), { width: SIZE, height: SIZE });
  const ctx = (canvas as HTMLCanvasElement).getContext?.('2d') ?? (canvas as OffscreenCanvas).getContext('2d');
  if (!ctx) { warnOnce(src); return null; }
  const sx = region ? Math.max(0, Math.floor((region.x / 100) * dims.w)) : 0;
  const sy = region ? Math.max(0, Math.floor((region.y / 100) * dims.h)) : 0;
  const sw = region ? Math.max(1, Math.floor((region.width / 100) * dims.w)) : dims.w;
  const sh = region ? Math.max(1, Math.floor((region.height / 100) * dims.h)) : dims.h;
  try {
    ctx.drawImage(el as CanvasImageSource, sx, sy, sw, sh, 0, 0, SIZE, SIZE);
    const img = ctx.getImageData(0, 0, SIZE, SIZE);
    return computeLumaStats(img.data, SIZE, SIZE);
  } catch {
    warnOnce(src);
    return null;
  }
}
