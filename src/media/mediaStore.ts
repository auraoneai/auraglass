'use client';
/* REQ-SURF-130/12/18 — per-element external store (WeakMap keyed by the
 * HTMLMediaElement). subscribe/getSnapshot/getServerSnapshot per
 * useSyncExternalStore; one AbortController per element owns every listener;
 * snapshots publish at most snapshotHz/s during timeupdate with immediate
 * publish for play/pause/seeked/ended/error/volumechange. */
import { subscribeFrame } from '../motion/ticker';

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

const EVENTS = [
  'play', 'pause', 'ended', 'waiting', 'seeking', 'seeked', 'timeupdate',
  'durationchange', 'progress', 'volumechange', 'ratechange', 'error',
  'loadedmetadata', 'canplay', 'emptied', 'enterpictureinpicture' as const,
];
const IMMEDIATE = new Set(['play', 'pause', 'seeked', 'ended', 'error', 'volumechange']);

interface Store {
  state: MediaState;
  listeners: Set<() => void>;
  abort: AbortController;
  lastPublish: number;
  timer: { cancel: () => void } | null;
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
    paused: el.paused, ended: el.ended, waiting: false,
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
    // eslint-disable-next-line auraglass/no-random-in-render -- event-handler clock, not render
    const now = Date.now();
    const immediate = IMMEDIATE.has(ev);
    if (!immediate && now - store.lastPublish < minMs) {
      if (!store.timer) {
        // trailing publish on the first frame once minMs has elapsed — no timers.
        const due = store.lastPublish + minMs;
        let off = () => {};
        off = subscribeFrame(() => {
          // eslint-disable-next-line auraglass/no-random-in-render -- event-handler clock, not render
          if (Date.now() < due) return;
          // eslint-disable-next-line auraglass/no-random-in-render -- event-handler clock, not render
          store.timer = null; off(); store.lastPublish = Date.now(); notify();
        });
        store.timer = { cancel: off };
      }
      return;
    }
    store.lastPublish = now;
    notify();
  };
  const notify = () => { for (const l of store.listeners) l(); };
  const on = (ev: string) => {
    if (ev === 'waiting') store.state = { ...store.state, waiting: true };
    else store.state = snapshot(el, store.state);
    publish(ev);
  };
  for (const ev of EVENTS) el.addEventListener(ev, () => on(ev), { signal: store.abort.signal });
  stores.set(el, store);
  return store;
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
  if (s.timer) s.timer.cancel();
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
