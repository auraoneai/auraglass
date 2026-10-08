/* MAT-269: S-21 hooks. useSyncExternalStore over the provider's preference store
   (context), or a lazily created module singleton when no provider is mounted.
   Server snapshots always return SERVER_SNAPSHOT / resolved defaults so RSC and
   hydration agree (no flash, 0 hydration warnings). */
'use client';
import * as React from 'react';
import {
  SERVER_SNAPSHOT,
} from '../../contracts/preferences';
import type {
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
} from '../../contracts/preferences';
import { createPreferenceStore } from './store';
import type { PreferenceStore } from './store';

export const PreferenceStoreContext = React.createContext<PreferenceStore | null>(null);

const SERVER_RESOLVED: ResolvedPreferences = {
  transparency: 'glass', contrast: 'standard', motion: 'full', scheme: 'light',
  density: 'regular', glassOpacity: 0, tier: 'standard', allowContinuous: false,
  floors: { transparency: 'glass', motion: 'full' },
};

let singleton: PreferenceStore | null = null;
const defaultStore = (): PreferenceStore => {
  if (!singleton) singleton = createPreferenceStore();
  return singleton;
};

/** The store for the current tree: provider's when present, else the module one. */
export const usePreferenceStore = (): PreferenceStore => {
  const store = React.useContext(PreferenceStoreContext);
  return store ?? defaultStore();
};

export function usePreference<K extends PreferenceKey>(key: K): PreferenceValues[K] {
  const store = usePreferenceStore();
  const subscribe = React.useCallback(
    (listener: () => void) => store.subscribe(listener), [store]);
  return React.useSyncExternalStore(
    subscribe,
    () => store.getSnapshot()[key],
    () => SERVER_SNAPSHOT[key],
  );
}

export function useResolvedPreferences(): ResolvedPreferences {
  const store = usePreferenceStore();
  const subscribe = React.useCallback(
    (listener: () => void) => store.subscribe(listener), [store]);
  return React.useSyncExternalStore(
    subscribe,
    () => store.resolved(),
    () => SERVER_RESOLVED,
  );
}

export function usePreferenceActions(): {
  set<K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void;
  reset(): void;
} {
  const store = usePreferenceStore();
  return React.useMemo(() => ({
    set: <K extends UserSettableKey>(key: K, value: PreferenceValues[K]) => store.set(key, value),
    reset: () => store.reset(),
  }), [store]);
}
