/* MAT-267: the preference store. One per provider (the module singleton covers
   provider-less use). Merges defaults <- legacy migration <- persisted user
   values <- app props, resolves floors (never below OS/capability), persists
   user values, and writes the effective data-ag-* + --ag-glass-opacity to the
   target only when they change. */
import {
  SERVER_SNAPSHOT, STORAGE_KEY, LEGACY_STORAGE_KEY,
} from '../../contracts/preferences';
import type {
  Contrast, PreferenceKey, PreferenceValues, ResolvedPreferences,
  UserSettableKey, PreferenceStorage,
} from '../../contracts/preferences';
import { readOsSignals, subscribeOsSignals } from './media';
import { createLocalStorageAdapter } from './storage';
import { resolvePreferences } from './resolve';
import { detectEngine } from './engine';
import type { OsSignals, CapabilitySignals, PersistedPreferences, PreferenceInput, ResolvedDetail } from './types';

const USER_KEYS = [
  'transparency', 'glassOpacity', 'contrast', 'motion', 'scheme', 'density', 'allowContinuous',
] as const satisfies readonly UserSettableKey[];

type PersistedRecord = PersistedPreferences & { tier?: 'auto' | ResolvedPreferences['tier'] };

export interface PreferenceStore {
  getSnapshot(): PreferenceValues;
  getServerSnapshot(): PreferenceValues;
  resolved(): ResolvedDetail;
  getResolvedServerSnapshot(): ResolvedDetail;
  subscribe(listener: () => void): () => void;
  set<K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void;
  reset(): void;
  setApp(input: PreferenceInput): void;
  /** Point attribute writes at an element once it exists (provider mount).
      A list makes the first element the primary target (every data-ag-*
      attribute plus --ag-glass-opacity); each further element is a mirror
      that receives only the resolved data-ag-scheme and data-ag-transparency
      (REQ-MAT-56: a nested provider mirrors onto [data-ag-portal-root] so
      portaled overlays resolve like the provider's subtree). A mirror dropped
      by a later call loses the attributes this store wrote to it. */
  setTarget(el: HTMLElement | readonly HTMLElement[] | null): void;
}

export interface StoreSignals {
  os?: () => OsSignals;
  cap?: () => CapabilitySignals;
  subscribe?: (notify: () => void) => () => void;
  engine?: () => string;
}

export type PreferenceStoreOptions = {
  storage?: PreferenceStorage | null;
  storageKey?: string;
  legacyStorageKey?: string;
  app?: PreferenceInput;
  target?: HTMLElement | null;
  window?: Window | null;
  signals?: StoreSignals;
};

const DEFAULT_OS: OsSignals = {
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false,
};
const DEFAULT_CAP: CapabilitySignals = { backdropFilter: true, saveData: false, deviceMemory: null };

const capabilityFromWindow = (win: Window | null): CapabilitySignals => {
  if (!win) return DEFAULT_CAP;
  let backdropFilter = false;
  try {
    const css = (win as Window & { CSS?: { supports?: (q: string) => boolean } }).CSS;
    backdropFilter = typeof css?.supports === 'function'
      && (css.supports('(backdrop-filter: blur(1px))') || css.supports('(-webkit-backdrop-filter: blur(1px))'));
  } catch { backdropFilter = false; }
  const nav = (win.navigator ?? {}) as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return {
    backdropFilter,
    saveData: nav.connection?.saveData === true,
    deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
  };
};

const parsePersisted = (raw: string | null): PersistedRecord => {
  if (raw === null || raw === '') return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return {};
    return v as PersistedRecord;
  } catch {
    return {};
  }
};

/** One-time migration of the 4.x accessibility settings (never written back). */
const migrateLegacy = (raw: string | null): PersistedRecord => {
  const v = parsePersisted(raw) as Record<string, unknown> & {
    highContrast?: boolean; reducedTransparency?: boolean;
  };
  const out: PersistedRecord = {};
  if (v.highContrast === true) out.contrast = 'more';
  if (v.reducedTransparency === true) out.transparency = 'tinted';
  return out;
};

const ATTRS = {
  transparency: 'data-ag-transparency',
  contrast: 'data-ag-contrast',
  motion: 'data-ag-motion',
  scheme: 'data-ag-scheme',
  density: 'data-ag-density',
  tier: 'data-ag-tier',
} as const;

/** REQ-MAT-56: the attributes mirrored onto secondary targets. */
const MIRRORED_ATTRS = [ATTRS.scheme, ATTRS.transparency] as const;

export const createPreferenceStore = (opts: PreferenceStoreOptions = {}): PreferenceStore => {
  const win = opts.window ?? (typeof window !== 'undefined' ? window : null);
  const storage = opts.storage === undefined
    ? createLocalStorageAdapter(win)
    : opts.storage;
  const storageKey = opts.storageKey ?? STORAGE_KEY;
  const legacyKey = opts.legacyStorageKey ?? LEGACY_STORAGE_KEY;
  const signals = opts.signals ?? {};
  let target: HTMLElement | null = opts.target ?? null;
  /** Element the lastAttr/lastOpacity diff cache describes. */
  let writtenTo: HTMLElement | null = target;
  /** Mirror targets and the values this store last wrote to each. */
  let mirrors = new Map<HTMLElement, Record<string, string>>();

  const readOs = signals.os ?? (() => (win ? readOsSignals(win) : { ...DEFAULT_OS }));
  const readCap = signals.cap ?? (() => capabilityFromWindow(win));
  const engine = signals.engine ?? (() => (win ? detectEngine(win.navigator) : 'unknown'));

  let app: PreferenceInput = { ...opts.app };

  // ---- persisted user values + one-time legacy migration ----
  let user: PersistedRecord = {};
  if (storage) {
    user = parsePersisted(storage.get(storageKey));
    if (Object.keys(user).length === 0) {
      const legacy = storage.get(legacyKey);
      if (legacy !== null) {
        user = migrateLegacy(legacy);
        if (Object.keys(user).length > 0) {
          try { storage.set(storageKey, JSON.stringify(user)); } catch { /* storage adapter guards */ }
        }
      }
    }
  }

  let snapshot: PreferenceValues;
  let resolvedValue: ResolvedDetail;
  let lastAttr: Record<string, string> = {};
  let lastOpacity = Number.NaN;
  const listeners = new Set<() => void>();
  let unsubscribeOs: (() => void) | null = null;

  const sanitizeContrast = (c: PreferenceInput['contrast']): Contrast | 'system' | undefined =>
    c === 'less' || c === 'custom' ? 'standard' : c;

  const buildSnapshot = (): PreferenceValues => {
    const os = readOs();
    return {
      transparency: user.transparency ?? app.transparency ?? 'system',
      glassOpacity: user.glassOpacity ?? app.glassOpacity ?? 0,
      contrast: sanitizeContrast(user.contrast ?? app.contrast) ?? 'system',
      motion: user.motion ?? app.motion ?? 'system',
      scheme: user.scheme ?? app.scheme ?? 'system',
      density: user.density ?? app.density ?? 'regular',
      allowContinuous: user.allowContinuous ?? app.allowContinuous ?? false,
      forcedColors: os.forcedColors,
      reducedMotionOS: os.reducedMotion,
      reducedTransparencyOS: os.reducedTransparency,
      contrastMoreOS: os.contrastMore,
      coarsePointer: os.coarsePointer,
    };
  };

  const writeAttributes = (r: ResolvedDetail): void => {
    if (!target) return;
    const next: Record<string, string> = {
      [ATTRS.transparency]: r.transparency,
      [ATTRS.contrast]: r.contrast,
      [ATTRS.motion]: r.motion,
      [ATTRS.scheme]: r.scheme,
      [ATTRS.density]: r.density,
      [ATTRS.tier]: r.tier,
    };
    for (const [name, value] of Object.entries(next)) {
      if (lastAttr[name] !== value) target.setAttribute(name, value);
    }
    const cont = r.allowContinuous ? 'on' : '';
    if ((lastAttr['data-ag-continuous'] ?? '') !== cont) {
      if (cont) target.setAttribute('data-ag-continuous', 'on');
      else target.removeAttribute('data-ag-continuous');
      lastAttr['data-ag-continuous'] = cont;
    }
    const eng = engine();
    if (eng !== 'unknown' && lastAttr['data-ag-engine'] !== eng) {
      target.setAttribute('data-ag-engine', eng);
      lastAttr['data-ag-engine'] = eng;
    }
    if (!Number.isNaN(r.glassOpacity) && r.glassOpacity !== lastOpacity) {
      target.style.setProperty('--ag-glass-opacity', String(r.glassOpacity));
      lastOpacity = r.glassOpacity;
    }
    lastAttr = { ...lastAttr, ...next };
  };

  const writeMirrors = (r: ResolvedDetail): void => {
    const values: Record<string, string> = {
      [ATTRS.scheme]: r.scheme,
      [ATTRS.transparency]: r.transparency,
    };
    for (const [el, written] of mirrors) {
      // A mirror (the document's single portal root) can be shared, so diff
      // against the live attribute rather than this store's cache.
      for (const name of MIRRORED_ATTRS) {
        if (el.getAttribute(name) !== values[name]) el.setAttribute(name, values[name]!);
        written[name] = values[name]!;
      }
    }
  };

  const releaseMirror = (el: HTMLElement, written: Record<string, string>): void => {
    // Leave values another writer has since put there untouched.
    for (const name of MIRRORED_ATTRS) {
      if (written[name] !== undefined && el.getAttribute(name) === written[name]) el.removeAttribute(name);
    }
  };

  const write = (r: ResolvedDetail): void => {
    writeAttributes(r);
    writeMirrors(r);
  };

  const update = (notify = true): void => {
    const os = readOs();
    const cap = readCap();
    resolvedValue = resolvePreferences({ os, cap, app, user });
    snapshot = buildSnapshot();
    write(resolvedValue);
    if (notify) listeners.forEach((l) => l());
  };
  update(false);

  const ensureOsSubscription = (): void => {
    if (unsubscribeOs !== null) return;
    unsubscribeOs = signals.subscribe
      ? signals.subscribe(() => update())
      : win ? subscribeOsSignals(win, () => update()) : () => {};
  };

  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => SERVER_SNAPSHOT,
    resolved: () => resolvedValue,
    getResolvedServerSnapshot: () => ({
      transparency: 'glass', contrast: 'standard', motion: 'full', scheme: 'light',
      density: 'regular', glassOpacity: 0, tier: 'standard', allowContinuous: false,
      floors: { transparency: 'glass', motion: 'full' }, reasons: [],
    }),
    subscribe(listener) {
      listeners.add(listener);
      ensureOsSubscription();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && unsubscribeOs) {
          unsubscribeOs();
          unsubscribeOs = null;
        }
      };
    },
    set(key, value) {
      (user as Record<string, unknown>)[key] = value;
      if (storage) {
        const record: Record<string, unknown> = {};
        for (const k of USER_KEYS) if (user[k] !== undefined) record[k] = user[k];
        if (user.tier !== undefined) record['tier'] = user.tier;
        try { storage.set(storageKey, JSON.stringify(record)); } catch { /* adapter guards */ }
      }
      update();
    },
    reset() {
      user = {};
      try { storage?.remove?.(storageKey); } catch { /* adapter guards */ }
      update();
    },
    setApp(input) {
      app = { ...input };
      update();
    },
    setTarget(el) {
      const list: readonly HTMLElement[] = el === null ? [] : Array.isArray(el) ? el : [el as HTMLElement];
      const primary = list[0] ?? null;
      const nextMirrors = new Map<HTMLElement, Record<string, string>>();
      for (const m of list.slice(1)) {
        if (m !== primary && !nextMirrors.has(m)) nextMirrors.set(m, mirrors.get(m) ?? {});
      }
      for (const [m, written] of mirrors) if (!nextMirrors.has(m)) releaseMirror(m, written);
      mirrors = nextMirrors;
      target = primary;
      // A different element has none of the cached values: write them all.
      if (primary !== null && primary !== writtenTo) {
        lastAttr = {};
        lastOpacity = Number.NaN;
        writtenTo = primary;
      }
      if (resolvedValue) write(resolvedValue);
    },
  };
};
