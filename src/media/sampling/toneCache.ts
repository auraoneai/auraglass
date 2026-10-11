'use client';
/* REQ-SURF-153 — LRU(64) keyed by `${currentSrc}|${region}` so each source is
 * sampled at most once across 30 s of playback with seeks. Sampling is
 * deferred into requestIdleCallback (500 ms timeout; setTimeout(0) fallback). */
import { sampleOwnedPixels, type SampleRegion, type ToneStats } from './sampleOwnedPixels';
import { classifyTone, type MediaTone } from './classifyTone';

const MAX = 64;
const cache = new Map<string, ToneStats | null>();
const keyOf = (el: HTMLImageElement | HTMLVideoElement, region?: SampleRegion) =>
  `${el.currentSrc || el.src || 'media'}|${region ? `${region.x},${region.y},${region.width},${region.height}` : 'full'}`;

const idle = (cb: () => void) => {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(() => cb(), { timeout: 500 });
  else setTimeout(cb, 0);
};

export function getOrSampleTone(
  el: HTMLImageElement | HTMLVideoElement,
  region: SampleRegion | undefined,
  apply: (tone: MediaTone, luma: number | null) => void,
): void {
  const key = keyOf(el, region);
  if (cache.has(key)) {
    const stats = cache.get(key) ?? null;
    apply(stats ? classifyTone(stats) : undefined, stats ? stats.mean : null);
    return;
  }
  idle(() => {
    let stats = cache.get(key);
    if (stats === undefined) {
      stats = sampleOwnedPixels(el, region);
      cache.set(key, stats);
      if (cache.size > MAX) cache.delete(cache.keys().next().value!);
    }
    apply(stats ? classifyTone(stats) : undefined, stats ? stats.mean : null);
  });
}

export function clearToneCache(): void { cache.clear(); }
export const TONE_CACHE_MAX = MAX;
