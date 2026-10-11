/* MAT-265: preference storage adapters. localStorage access is always guarded —
   one throw (private mode, blocked storage) permanently switches to memory so
   later reads never re-enter the throwing path. */
import type { PreferenceStorage } from '../../contracts/preferences';

export const createMemoryStorage = (): PreferenceStorage => {
  const map = new Map<string, string>();
  return {
    get: (key) => (map.has(key) ? map.get(key)! : null),
    set: (key, v) => { map.set(key, v); },
    remove: (key) => { map.delete(key); },
  };
};

export const createLocalStorageAdapter = (win?: Window | null): PreferenceStorage => {
  const fallback = createMemoryStorage();
  let backing: Storage | null | undefined; // undefined = untested
  const ls = (): Storage | null => {
    if (backing !== undefined) return backing;
    try {
      backing = (win ?? (typeof window !== 'undefined' ? window : null))?.localStorage ?? null;
      backing?.getItem('ag:probe'); // throws in blocked mode
    } catch {
      backing = null;
    }
    return backing;
  };
  return {
    get(key) {
      try {
        const store = ls();
        return store ? store.getItem(key) : fallback.get(key);
      } catch {
        backing = null;
        return fallback.get(key);
      }
    },
    set(key, v) {
      try {
        const store = ls();
        if (store) { store.setItem(key, v); return; }
      } catch {
        backing = null;
      }
      fallback.set(key, v);
    },
    remove(key) {
      try {
        const store = ls();
        if (store) { store.removeItem(key); return; }
      } catch {
        backing = null;
      }
      fallback.remove?.(key);
    },
  };
};
