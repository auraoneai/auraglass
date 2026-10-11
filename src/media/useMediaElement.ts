'use client';
/* REQ-SURF-130..133 — the ./media driver hook. Never sets src, never calls
 * load(), never creates AudioContext, never fetches; one AbortController per
 * element (mediaStore); optional Media Session; tone sampling only of the
 * ref-bound element via the LRU cache. */
import * as React from 'react';
import { useSyncExternalStore } from 'react';
import { destroyStore, getServerSnapshot, getSignal, getSnapshot, setError, setTone, subscribe, type MediaState } from './mediaStore';
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
  /** Set a text track's mode by MediaTextTrack id (REQ-SURF-134 captions). */
  setTextTrackMode(id: string, mode: TextTrackMode): void;
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

  // --_ag-media-progress: one subscribeFrame, held only while playing +
  // visible + intersecting (one IntersectionObserver per root); released in
  // the same callback that observes the change, so 0 frames run otherwise.
  React.useEffect(() => {
    if (!el || state.paused || state.ended) return;
    const root = el.closest('[data-ag-media-root]') as HTMLElement | null;
    if (!root) return;
    // Without an IntersectionObserver the root is treated as intersecting;
    // with one, nothing runs until it reports the root on screen.
    let intersecting = typeof IntersectionObserver === 'undefined';
    let unsub: (() => void) | null = null;
    const frame = () => {
      const total = el.duration;
      const p = Number.isFinite(total) && total > 0 ? el.currentTime / total : 0;
      root.style.setProperty('--_ag-media-progress', p.toFixed(4));
    };
    const sync = () => {
      const run = intersecting && !document.hidden && !el.paused;
      if (run && !unsub) unsub = subscribeFrame(frame);
      else if (!run && unsub) { unsub(); unsub = null; }
    };
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        if (e) { intersecting = e.isIntersecting; sync(); }
      })
      : null;
    io?.observe(root);
    const ac = new AbortController();
    document.addEventListener('visibilitychange', sync, { signal: ac.signal });
    sync();
    return () => { ac.abort(); io?.disconnect(); unsub?.(); unsub = null; };
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
      else {
        // on the element's single AbortSignal (aborted with its store), and
        // removed early if sampling is switched off while still pending.
        el.addEventListener('loadeddata', onData, { once: true, signal: getSignal(el, hz) });
        return () => { el.removeEventListener('loadeddata', onData); };
      }
    }
    return undefined;
  }, [el, sampleTone, hz]);

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
    setTextTrackMode: (id: string, mode: TextTrackMode) => {
      const tt = ref.current?.textTracks;
      for (let i = 0; i < (tt?.length ?? 0); i++) {
        const t = tt![i]!;
        // matches the store snapshot id (TextTrack.id) or, for id-less
        // tracks, their index
        if (t.id === id || (!t.id && String(i) === id)) { t.mode = mode; return; }
      }
    },
  }), [state, ref]);
}
