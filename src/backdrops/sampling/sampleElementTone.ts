/* REQ-SURF-153 — when to sample a library-owned media element:
 *  - <img>: after decode() (or load where decode() is missing);
 *  - <video> with a poster: the poster wins — it is decoded through a
 *    detached Image (same URL, same crossOrigin; served from the HTTP cache)
 *    and sampled once, so playback frames are never read;
 *  - <video> without a poster: at the first loadeddata (immediately when
 *    readyState >= HAVE_CURRENT_DATA).
 * Results go through the tone LRU (one getImageData per source). Listeners
 * register on `signal` when given (e.g. the media store's per-element
 * AbortSignal, REQ-SURF-133) and are removed early by the returned cleanup,
 * which also stops a pending sample from applying. */
import { getOrSampleTone } from './toneCache';
import type { MediaTone } from './classifyTone';

export type ToneApply = (tone: MediaTone, luma: number | null) => void;

const HAVE_CURRENT_DATA = 2;

function whenDecoded(img: HTMLImageElement, run: () => void, signal: AbortSignal, cleanups: Array<() => void>): void {
  if (typeof img.decode === 'function') {
    // A decode failure still runs the sampler: it returns null and emits the
    // single CORS/decoding dev warning instead of failing silently.
    img.decode().then(run, run);
  } else if (img.complete && img.naturalWidth > 0) {
    run();
  } else {
    img.addEventListener('load', run, { once: true, signal });
    img.addEventListener('error', run, { once: true, signal });
    cleanups.push(() => { img.removeEventListener('load', run); img.removeEventListener('error', run); });
  }
}

export function sampleElementTone(
  el: HTMLImageElement | HTMLVideoElement,
  apply: ToneApply,
  signal?: AbortSignal,
): () => void {
  const ac = signal ? null : new AbortController();
  const sig = signal ?? ac!.signal;
  const cleanups: Array<() => void> = [];
  let live = true;
  const guarded: ToneApply = (tone, luma) => { if (live) apply(tone, luma); };

  if (el instanceof HTMLImageElement) {
    whenDecoded(el, () => { if (live) getOrSampleTone(el, undefined, guarded); }, sig, cleanups);
  } else if (el.poster) {
    const poster = new Image();
    if (el.crossOrigin !== null) poster.crossOrigin = el.crossOrigin;
    poster.decoding = 'async';
    poster.src = el.poster;
    whenDecoded(poster, () => { if (live) getOrSampleTone(poster, undefined, guarded); }, sig, cleanups);
  } else {
    const onData = () => { if (live) getOrSampleTone(el, undefined, guarded); };
    if (el.readyState >= HAVE_CURRENT_DATA) onData();
    else {
      el.addEventListener('loadeddata', onData, { once: true, signal: sig });
      cleanups.push(() => { el.removeEventListener('loadeddata', onData); });
    }
  }

  return () => {
    live = false;
    for (const c of cleanups) c();
    ac?.abort();
  };
}
