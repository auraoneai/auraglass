/* MAT-266: shared MediaQueryList registry. One matchMedia call per (window,
   query) — never at import time, created lazily on the first subscriber, and the
   change listener is removed when the subscriber count returns to 0. */
import type { OsSignals } from './types';

export const MEDIA_QUERIES = {
  forcedColors: '(forced-colors: active)',
  contrastMore: '(prefers-contrast: more)',
  reducedTransparency: '(prefers-reduced-transparency: reduce)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  schemeDark: '(prefers-color-scheme: dark)',
  coarsePointer: '(pointer: coarse)',
} as const;

export type OsSignalKey = keyof typeof MEDIA_QUERIES;

/** Input-capability queries read by the motion runtime (pointer light,
   magnetic). Kept out of MEDIA_QUERIES so the store's OS-signal set and its
   change subscription are unchanged; they share the same lazy MQL registry. */
export const POINTER_QUERIES = {
  fineHover: '(hover: hover) and (pointer: fine)',
  fine: '(pointer: fine)',
} as const;

export type PointerSignalKey = keyof typeof POINTER_QUERIES;

interface MediaEntry {
  mql: MediaQueryList | null;
  listeners: Set<() => void>;
  onChange: () => void;
}

const registry = new WeakMap<Window, Map<string, MediaEntry>>();

const matches = (entry: MediaEntry): boolean => entry.mql?.matches ?? false;

const entryFor = (win: Window, query: string): MediaEntry => {
  let perWin = registry.get(win);
  if (!perWin) {
    perWin = new Map();
    registry.set(win, perWin);
  }
  let entry = perWin.get(query);
  if (!entry) {
    const listeners = new Set<() => void>();
    entry = {
      mql: null,
      listeners,
      onChange: () => listeners.forEach((l) => l()),
    };
    perWin.set(query, entry);
  }
  if (entry.mql === null) {
    try {
      entry.mql = typeof win.matchMedia === 'function' ? win.matchMedia(query) : null;
    } catch {
      entry.mql = null;
    }
    // late-arriving matchMedia (shims, first real read after construction)
    // attaches to the same entry; subscribers registered meanwhile still work
    // because their listeners live on the entry, not the MQL handle.
    if (entry.mql && entry.listeners.size > 0) {
      try { entry.mql.addEventListener('change', entry.onChange); }
      catch { entry.mql.addListener?.(entry.onChange); }
    }
  }
  return entry;
};

/** Current value of one signal for a window; creates the shared MQL lazily. */
export const readOsSignal = (win: Window, key: OsSignalKey): boolean =>
  matches(entryFor(win, MEDIA_QUERIES[key]));

/** Current value of one input-capability signal (shared MQL, created lazily). */
export const readPointerSignal = (win: Window, key: PointerSignalKey): boolean =>
  matches(entryFor(win, POINTER_QUERIES[key]));

/** All six signals for a window (shared MQLs, lazily created per call). */
export const readOsSignals = (win: Window): OsSignals => ({
  forcedColors: readOsSignal(win, 'forcedColors'),
  contrastMore: readOsSignal(win, 'contrastMore'),
  reducedTransparency: readOsSignal(win, 'reducedTransparency'),
  reducedMotion: readOsSignal(win, 'reducedMotion'),
  schemeDark: readOsSignal(win, 'schemeDark'),
  coarsePointer: readOsSignal(win, 'coarsePointer'),
});

/** Subscribe to one signal; returns an unsubscribe that drops the MQL listener
   when the last subscriber leaves. */
export const subscribeOsSignal = (
  win: Window, key: OsSignalKey, listener: () => void,
): (() => void) => {
  const entry = entryFor(win, MEDIA_QUERIES[key]);
  entry.listeners.add(listener);
  if (entry.listeners.size === 1) {
    try { entry.mql?.addEventListener('change', entry.onChange); }
    catch { entry.mql?.addListener?.(entry.onChange); }
  }
  return () => {
    entry.listeners.delete(listener);
    if (entry.listeners.size === 0) {
      try { entry.mql?.removeEventListener('change', entry.onChange); }
      catch { entry.mql?.removeListener?.(entry.onChange); }
    }
  };
};

/** Subscribe to every signal at once; `notify` fires on any change. */
export const subscribeOsSignals = (win: Window, notify: () => void): (() => void) => {
  const offs = (Object.keys(MEDIA_QUERIES) as OsSignalKey[]).map((k) =>
    subscribeOsSignal(win, k, notify));
  return () => offs.forEach((off) => off());
};
