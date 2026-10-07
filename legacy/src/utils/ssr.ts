/**
 * SSR (Server-Side Rendering) Utilities
 *
 * Shared helpers for safe browser API access across all components.
 * Prevents hydration mismatches and runtime errors during SSR.
 */

// Re-export existing browser detection utilities
export { isBrowser, isServer } from "./env";

/**
 * Check if DOM is available (alias for isBrowser)
 * React convention name
 */
export const canUseDOM =
  typeof window !== "undefined" && typeof document !== "undefined";

/**
 * Safely access window, returns undefined during SSR
 */
export const safeWindow = canUseDOM ? window : undefined;

/**
 * Safely access document, returns undefined during SSR
 */
export const safeDocument = canUseDOM ? document : undefined;

/**
 * Safely access navigator, returns undefined during SSR
 */
export const safeNavigator = canUseDOM ? navigator : undefined;

/**
 * Safe wrapper for code that requires browser APIs
 * Returns undefined during SSR, executes callback in browser
 *
 * @example
 * const userAgent = safeBrowserExec(() => navigator.userAgent);
 */
export function safeBrowserExec<T>(callback: () => T): T | undefined {
  if (!canUseDOM) return undefined;
  try {
    return callback();
  } catch {
    return undefined;
  }
}

/**
 * Get a browser API value with a fallback for SSR
 *
 * @example
 * const width = getBrowserValue(() => window.innerWidth, 1024);
 */
export function getBrowserValue<T>(getter: () => T, fallback: T): T {
  if (!canUseDOM) return fallback;
  try {
    return getter();
  } catch {
    return fallback;
  }
}

// Note: prefersReducedMotion is already exported from animations/accessible
// We don't re-export it here to avoid conflicts

/**
 * Get user agent string safely
 * Returns empty string during SSR
 */
export function getUserAgent(): string {
  return getBrowserValue(() => navigator.userAgent, "");
}

/**
 * Check if touch is supported
 * Returns false during SSR
 */
export function isTouchDevice(): boolean {
  return getBrowserValue(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    false
  );
}

/**
 * Get viewport dimensions
 * Returns default dimensions during SSR
 */
export function getViewportSize(): { width: number; height: number } {
  return getBrowserValue(
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    { width: 1024, height: 768 }
  );
}

/**
 * Get device pixel ratio
 * Returns 1 during SSR
 */
export function getDevicePixelRatio(): number {
  return getBrowserValue(() => window.devicePixelRatio, 1);
}

/**
 * Check if WebGL is supported
 * Returns false during SSR
 */
export function isWebGLSupported(): boolean {
  return getBrowserValue(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  }, false);
}

/**
 * Check if localStorage is available
 * Returns false during SSR and in privacy mode
 */
export function isLocalStorageAvailable(): boolean {
  return getBrowserValue(() => {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, false);
}

/**
 * SSR-safe event listener helper
 * No-op during SSR, works normally in browser
 */
export function addBrowserEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!canUseDOM) return () => {};

  window.addEventListener(type, listener, options);
  return () => window.removeEventListener(type, listener, options);
}

/**
 * SSR-safe requestAnimationFrame
 * Uses setTimeout fallback during SSR
 */
export function safeRequestAnimationFrame(
  callback: FrameRequestCallback
): number {
  if (!canUseDOM) {
    return setTimeout(callback, 16) as unknown as number;
  }
  return requestAnimationFrame(callback);
}

/**
 * SSR-safe cancelAnimationFrame
 */
export function safeCancelAnimationFrame(handle: number): void {
  if (!canUseDOM) {
    clearTimeout(handle);
    return;
  }
  cancelAnimationFrame(handle);
}

/**
 * Create an SSR-safe ref callback that only runs in browser
 */
export function createBrowserRefCallback<T extends HTMLElement>(
  callback: (element: T) => void | (() => void)
): (element: T | null) => void {
  if (!canUseDOM) {
    return () => {};
  }

  let cleanup: void | (() => void);
  return (element) => {
    if (cleanup) {
      cleanup();
    }
    if (element) {
      cleanup = callback(element);
    }
  };
}

/**
 * Get connection information safely
 * Returns default values during SSR
 */
export function getConnectionInfo(): {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
} {
  return getBrowserValue(
    () => {
      const nav = navigator as any;
      const connection =
        nav.connection || nav.mozConnection || nav.webkitConnection;
      if (!connection) {
        return { effectiveType: "4g", downlink: 10, rtt: 50, saveData: false };
      }
      return {
        effectiveType: connection.effectiveType || "4g",
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false,
      };
    },
    { effectiveType: "4g", downlink: 10, rtt: 50, saveData: false }
  );
}

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === "production";
