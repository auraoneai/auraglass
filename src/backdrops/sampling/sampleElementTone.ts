/* REQ-SURF-153 — when to sample a library-owned media element:
 *  - <img>: after decode() (or load where decode() is missing);
 *  - <video> with a poster: the poster wins — it is decoded through a
 *    detached Image (same URL, same crossOrigin; served from the HTTP cache)
 *    and sampled once, so playback frames are never read;
 *  - <video> without a poster: at the first loadeddata (immediately when
 *    readyState >= HAVE_CURRENT_DATA).
 * Results go through the tone LRU (one getImageData per source). The
 * returned cleanup stops a pending sample from applying. */
import { getOrSampleTone } from './toneCache';
import type { MediaTone } from './classifyTone';

export type ToneApply = (tone: MediaTone, luma: number | null) => void;

const HAVE_CURRENT_DATA = 2;

function whenDecoded(img: HTMLImageElement, run: () => void, signal: AbortSignal): void {
  if (typeof img.decode === 'function') {
    // A decode failure still runs the sampler: it returns null and emits the
    // single CORS/decoding dev warning instead of failing silently.
    img.decode().then(run, run);
  } else if (img.complete && img.naturalWidth > 0) {
    run();
  } else {
    img.addEventListener('load', run, { once: true, signal });
    img.addEventListener('error', run, { once: true, signal });
  }
}

export function sampleElementTone(el: HTMLImageElement | HTMLVideoElement, apply: ToneApply): () => void {
  const ac = new AbortController();
  let live = true;
  const guarded: ToneApply = (tone, luma) => { if (live) apply(tone, luma); };

  if (el instanceof HTMLImageElement) {
    whenDecoded(el, () => { if (live) getOrSampleTone(el, undefined, guarded); }, ac.signal);
  } else if (el.poster) {
    const poster = new Image();
    if (el.crossOrigin !== null) poster.crossOrigin = el.crossOrigin;
    poster.decoding = 'async';
    poster.src = el.poster;
    whenDecoded(poster, () => { if (live) getOrSampleTone(poster, undefined, guarded); }, ac.signal);
  } else {
    const onData = () => { if (live) getOrSampleTone(el, undefined, guarded); };
    if (el.readyState >= HAVE_CURRENT_DATA) onData();
    else el.addEventListener('loadeddata', onData, { once: true, signal: ac.signal });
  }

  return () => { live = false; ac.abort(); };
}
