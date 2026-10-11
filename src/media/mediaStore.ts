'use client';
/* REQ-SURF-130/12/18 — per-element external store (WeakMap keyed by the
 * HTMLMediaElement). subscribe/getSnapshot/getServerSnapshot per
 * useSyncExternalStore; one AbortController per element owns every listener;
 * snapshots publish at most snapshotHz/s during timeupdate with immediate
 * publish for play/pause/seeked/ended/error/volumechange. */

export interface MediaTextTrack { id: string; label: string; language: string; kind: string; mode: string }
export interface MediaError { code: number; message: string }

export interface MediaState {
  paused: boolean;
  ended: boolean;
  waiting: boolean;
  seeking: boolean;
  /** readyState ≥ HAVE_CURRENT_DATA */
  ready: boolean;
  currentTime: number;
  duration: number;
  buffered: [number, number][];
  volume: number;
  muted: boolean;
  playbackRate: number;
  pictureInPicture: boolean;
  textTracks: MediaTextTrack[];
  error: MediaError | null;
  tone: 'light' | 'dark' | undefined;
}

export const SERVER_SNAPSHOT: MediaState = {
  paused: true, ended: false, waiting: false, seeking: false, ready: false,
  currentTime: 0, duration: NaN, buffered: [], volume: 1, muted: false,
  playbackRate: 1, pictureInPicture: false, textTracks: [], error: null,
  tone: undefined,
};

/** Every HTMLMediaElement event the store listens to (PRD-SURF §4.6 plus the
 * readiness events that move `ready`/`waiting`). Exported for the event-matrix
 * test only; not part of the ./media barrel. */
export const MEDIA_EVENTS = [
  'play', 'playing', 'pause', 'ended', 'waiting', 'seeking', 'seeked', 'timeupdate',
  'durationchange', 'progress', 'volumechange', 'ratechange', 'error',
  'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'emptied',
  'enterpictureinpicture', 'leavepictureinpicture',
] as const;
/** TextTrackList events: tracks added/removed, or a track's mode changed. */
export const TEXT_TRACK_EVENTS = ['addtrack', 'removetrack', 'change'] as const;
const IMMEDIATE = new Set(['play', 'pause', 'seeked', 'ended', 'error', 'volumechange']);
/** Events after which the element is no longer stalled waiting for data. */
const CLEARS_WAITING = new Set(['playing', 'canplay', 'canplaythrough', 'pause', 'ended', 'emptied', 'error']);

interface Store {
  state: MediaState;
  listeners: Set<() => void>;
  abort: AbortController;
  lastPublish: number;
  timer: ReturnType<typeof setTimeout> | null;
}
const stores = new WeakMap<HTMLMediaElement, Store>();

function snapshot(el: HTMLMediaElement, prev: MediaState): MediaState {
  const buffered: [number, number][] = [];
  try {
    for (let i = 0; i < el.buffered.length; i++) buffered.push([el.buffered.start(i), el.buffered.end(i)]);
  } catch { /* detached */ }
  const tracks: MediaTextTrack[] = [];
  const tt = el.textTracks;
  for (let i = 0; i < (tt?.length ?? 0); i++) {
    const t = tt![i]!;
    tracks.push({ id: (t as TextTrack & { id?: string }).id ?? String(i), label: t.label, language: t.language, kind: t.kind, mode: t.mode });
  }
  const err = (el as HTMLMediaElement & { error?: MediaError | null }).error ?? null;
  return {
    paused: el.paused, ended: el.ended, waiting: prev.waiting,
    seeking: el.seeking, ready: el.readyState >= 2,
    currentTime: el.currentTime, duration: el.duration,
    buffered, volume: el.volume, muted: el.muted,
    playbackRate: el.playbackRate,
    pictureInPicture: typeof document !== 'undefined' && (document as Document & { pictureInPictureElement?: Element | null }).pictureInPictureElement === el,
    textTracks: tracks,
    error: err ? { code: err.code, message: err.message } : null,
    tone: prev.tone,
  };
}

export function ensureStore(el: HTMLMediaElement, snapshotHz: number): Store {
  let s = stores.get(el);
  if (s) return s;
  const store: Store = {
    state: snapshot(el, SERVER_SNAPSHOT),
    listeners: new Set(),
    abort: new AbortController(),
    lastPublish: 0,
    timer: null,
  };
  const minMs = 1000 / Math.min(15, Math.max(1, snapshotHz));
  const publish = (ev: string) => {
    const now = Date.now();
    const immediate = IMMEDIATE.has(ev);
    if (!immediate && now - store.lastPublish < minMs) {
      if (!store.timer) {
        store.timer = setTimeout(() => { store.timer = null; store.lastPublish = Date.now(); notify(); }, minMs - (now - store.lastPublish));
      }
      return;
    }
    store.lastPublish = now;
    notify();
  };
  const notify = () => { for (const l of store.listeners) l(); };
  const on = (ev: string) => {
    const next = snapshot(el, store.state);
    if (ev === 'waiting') next.waiting = true;
    else if (CLEARS_WAITING.has(ev)) next.waiting = false;
    store.state = next;
    publish(ev);
  };
  const { signal } = store.abort;
  for (const ev of MEDIA_EVENTS) el.addEventListener(ev, () => on(ev), { signal });
  // textTracks is absent in some non-browser DOMs; when present, track list
  // changes (and mode toggles) refresh state.textTracks on the same signal.
  const tracks = el.textTracks as TextTrackList | undefined;
  if (tracks && typeof tracks.addEventListener === 'function') {
    for (const ev of TEXT_TRACK_EVENTS) tracks.addEventListener(ev, () => on(ev), { signal });
  }
  stores.set(el, store);
  return store;
}

/** The element's single AbortSignal (creating its store if needed). Every
 * listener the ./media hook adds to the element must carry it (REQ-SURF-133). */
export function getSignal(el: HTMLMediaElement, snapshotHz: number): AbortSignal {
  return ensureStore(el, snapshotHz).abort.signal;
}

export function subscribe(el: HTMLMediaElement, cb: () => void, snapshotHz: number): () => void {
  const store = ensureStore(el, snapshotHz);
  store.listeners.add(cb);
  return () => { store.listeners.delete(cb); };
}

export function getSnapshot(el: HTMLMediaElement, snapshotHz: number): MediaState {
  return ensureStore(el, snapshotHz).state;
}

export function getServerSnapshot(): MediaState { return SERVER_SNAPSHOT; }

export function destroyStore(el: HTMLMediaElement): void {
  const s = stores.get(el);
  if (!s) return;
  s.abort.abort();
  if (s.timer) clearTimeout(s.timer);
  s.listeners.clear();
  stores.delete(el);
}

export function setError(el: HTMLMediaElement, error: MediaError | null): void {
  const s = stores.get(el);
  if (s) {
    s.state = { ...s.state, error };
    for (const l of s.listeners) l();
  }
}

export function setTone(el: HTMLMediaElement, tone: MediaState['tone']): void {
  const s = stores.get(el);
  if (s && s.state.tone !== tone) {
    s.state = { ...s.state, tone };
    for (const l of s.listeners) l();
  }
}
