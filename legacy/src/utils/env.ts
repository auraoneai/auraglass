import type { DependencyList, EffectCallback } from 'react';

/**
 * Environment helpers to centralize SSR/browser detection and safe global access.
 *
 * CRITICAL: These must check dynamically, NOT cache at module load time,
 * to handle polyfills and avoid locking in server environment values.
 */

/**
 * Dynamic check - re-evaluates on every call to support polyfills
 */
const hasWindow = (): boolean => typeof window !== 'undefined';
const hasDocument = (): boolean => typeof document !== 'undefined';
const hasNavigator = (): boolean => typeof navigator !== 'undefined';

/**
 * Returns true when executed in a browser-like environment.
 */
export const isBrowser = (): boolean => hasWindow() && hasDocument();

/**
 * Convenience inverse helper.
 */
export const isServer = (): boolean => !isBrowser();

/**
 * Safely access the `window` object when available.
 */
export const getSafeWindow = (): typeof window | undefined => (hasWindow() ? window : undefined);

/**
 * Safely access the `document` object when available.
 */
export const getSafeDocument = (): Document | undefined => (hasDocument() ? document : undefined);

/**
 * Safely access the `navigator` object when available.
 */
export const getSafeNavigator = (): Navigator | undefined => (hasNavigator() ? navigator : undefined);

/**
 * Helper to guard feature detection against SSR environments.
 */
export const safeMatchMedia = (query: string): MediaQueryList | undefined => {
  const win = getSafeWindow();
  return win?.matchMedia ? win.matchMedia(query) : undefined;
};

/**
 * Executes a side effect only when running in the browser. Returns a no-op cleanup on the server.
 */
export const runClientEffect = (effect: EffectCallback): ReturnType<EffectCallback> | undefined => {
  if (!isBrowser()) {
    return undefined;
  }
  return effect();
};

/**
 * React hook compatible helper to defer `useEffect` logic to the client.
 *
 * Example:
 *   useClientEffect(() => { /* browser only *\/ });
 */
export const useClientEffect = (
  useEffectImpl: (effect: EffectCallback, deps?: DependencyList) => void,
  effect: EffectCallback,
  deps?: DependencyList
): void => {
  useEffectImpl(() => runClientEffect(effect), deps);
};

/**
 * Creates a lazy accessor that only evaluates the factory on the client.
 */
export const lazyClientValue = <T>(factory: () => T, fallback: T): T => {
  return isBrowser() ? factory() : fallback;
};
