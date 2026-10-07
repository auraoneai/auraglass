'use client';
/* REQ-SURF-130..133 — the ./media driver hook. Never sets src, never calls
 * load(), never creates AudioContext, never fetches; one AbortController per
 * element (mediaStore); optional Media Session; tone sampling only of the
 * ref-bound element via the LRU cache. */
import * as React from 'react';
import { useSyncExternalStore } from 'react';
import { destroyStore, getServerSnapshot, getSnapshot, setError, setTone, subscribe, type MediaState } from './mediaStore';
import { getOrSampleTone } from './sampling/toneCache';
import { subscribeFrame } from '../motion';

export type { MediaState, MediaError, MediaTextTrack } from './mediaStore';

export interface MediaSessionMetadataInit {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: { src: string; sizes?: string; type?: string }[];
}

export interface UseMediaElementOptions {
  /** Sample the bound element for tone once per (src, region). */
  sampleTone?: boolean | undefined;
  /** Media Session metadata; false (default) leaves the session untouched. */
  mediaSession?: MediaSessionMetadataInit | false | undefined;
  /** Snapshot publishes/sec during timeupdate; 1–15, default 4. */
  snapshotHz?: number | undefined;
}

export interface MediaHandle {
  state: MediaState;
  play(): Promise<void>;
  pause(): void;
  toggle(): void;
  seek(seconds: number): void;
  seekBy(delta: number): void;
  setVolume(v: number): void;
  setMuted(m: boolean): void;
  setRate(r: number): void;
  requestPictureInPicture(): void;
  requestFullscreen(target?: Element | null): void;
}

export function useMediaElement(
  ref: React.RefObject<HTMLMediaElement | null>,
  options: UseMediaElementOptions = {},
): MediaHandle {
  const { sampleTone = false, mediaSession = false, snapshotHz = 4 } = options;
  const elRef = React.useRef<HTMLMediaElement | null>(null);
  const hz = Math.min(15, Math.max(1, snapshotHz));

  const state = useSyncExternalStore(
    React.useCallback((cb: () => void) => {
      const el = ref.current;
      if (!el) return () => {};
      return subscribe(el, cb, hz);
      // ref identity is stable by contract — see contract §4.9
    }, [hz, ref]),
    React.useCallback(() => {
      const el = ref.current;
      return el ? getSnapshot(el, hz) : getServerSnapshot();
    }, [hz, ref]),
    getServerSnapshot,
  );

  const el = ref.current;
  React.useEffect(() => {
    if (!el) return;
    elRef.current = el;
    return () => { destroyStore(el); };
  }, [el]);

  // --_ag-media-progress: one subscribeFrame while playing + visible +
  // intersecting; stops within one frame otherwise.
  React.useEffect(() => {
    if (!el || state.paused || state.ended) return;
    const root = el.closest('[data-ag-media-root]') as HTMLElement | null;
    if (!root) return;
    let intersecting = true;
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { intersecting = e!.isIntersecting; })
      : null;
    io?.observe(root);
    const unsub = subscribeFrame(() => {
      if (document.hidden || !intersecting || el.paused) return;
      const p = Number.isFinite(el.duration) && el.duration > 0 ? el.currentTime / el.duration : 0;
      root.style.setProperty('--_ag-media-progress', p.toFixed(4));
    });
    return () => { unsub(); io?.disconnect(); };
  }, [el, state.paused, state.ended]);

  // Tone sampling — only the ref-bound element, at most once per src.
  React.useEffect(() => {
    if (!el || !sampleTone) return;
    const root = el.closest('[data-ag-media-root]') as HTMLElement | null;
    if (!root) return;
    const mediaEl = el as HTMLImageElement | HTMLVideoElement;
    const apply = (tone: MediaState['tone'], luma: number | null) => {
      if (tone) root.setAttribute('data-ag-media-tone', tone);
      else root.removeAttribute('data-ag-media-tone');
      if (luma !== null) root.style.setProperty('--_ag-media-luma', luma.toFixed(3));
      setTone(el, tone);
    };
    if (el instanceof HTMLImageElement) {
      void el.decode().then(() => getOrSampleTone(mediaEl, undefined, apply)).catch(() => getOrSampleTone(mediaEl, undefined, apply));
    } else {
      const onData = () => getOrSampleTone(mediaEl, undefined, apply);
      if (el.readyState >= 2) onData();
      else el.addEventListener('loadeddata', onData, { once: true });
    }
  }, [el, sampleTone]);

  // Media Session
  React.useEffect(() => {
    if (!el || !mediaSession) return;
    const ms = (navigator as Navigator & { mediaSession?: MediaSession }).mediaSession;
    if (!ms) return;
    ms.metadata = new MediaMetadata(mediaSession as MediaMetadataInit);
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => { void el.play(); }],
      ['pause', () => { el.pause(); }],
      ['seekbackward', () => { el.currentTime = Math.max(0, el.currentTime - 10); }],
      ['seekforward', () => { el.currentTime = Math.min(el.duration || 0, el.currentTime + 10); }],
      ['seekto', (d) => { if (d.seekTime != null) el.currentTime = d.seekTime; }],
    ];
    for (const [a, h] of handlers) { try { ms.setActionHandler(a, h); } catch { /* unsupported action */ } }
    return () => {
      for (const [a] of handlers) { try { ms.setActionHandler(a, null); } catch { /* ignore */ } }
      ms.metadata = null;
    };
  }, [el, mediaSession]);

  return React.useMemo<MediaHandle>(() => ({
    state,
    play: async () => {
      const m = ref.current;
      if (!m) return;
      try {
        await m.play();
      } catch (e) {
        if (e instanceof DOMException && e.name === 'NotAllowedError') {
          setError(m, { code: 0, message: 'autoplay-blocked' });
        } else throw e;
      }
    },
    pause: () => { ref.current?.pause(); },
    toggle: () => { const m = ref.current; if (!m) return; if (m.paused) { void m.play().catch(() => {}); } else m.pause(); },
    seek: (seconds: number) => { const m = ref.current; if (m) m.currentTime = seconds; },
    seekBy: (delta: number) => { const m = ref.current; if (m) m.currentTime = Math.max(0, m.currentTime + delta); },
    setVolume: (v: number) => { const m = ref.current; if (m) m.volume = Math.min(1, Math.max(0, v)); },
    setMuted: (muted: boolean) => { const m = ref.current; if (m) m.muted = muted; },
    setRate: (r: number) => { const m = ref.current; if (m) m.playbackRate = r; },
    requestPictureInPicture: () => { void (ref.current as HTMLVideoElement | null)?.requestPictureInPicture?.(); },
    requestFullscreen: (target?: Element | null) => { void (target ?? ref.current)?.requestFullscreen?.(); },
  }), [state, ref]);
}
