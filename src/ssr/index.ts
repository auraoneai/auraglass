/**
 * SSR (Server-Side Rendering) Module
 *
 * Utilities and helpers for using AuraGlass with server-side rendering frameworks
 * like Next.js, Remix, Gatsby, etc.
 */

export * from "./StyleSheetManager";

// Re-export SSR utilities (selective to avoid conflicts)
export {
  isBrowser,
  isServer,
  canUseDOM,
  safeWindow,
  safeDocument,
  safeNavigator,
  safeBrowserExec,
  getBrowserValue,
  getUserAgent,
  isTouchDevice,
  getViewportSize,
  getDevicePixelRatio,
  isWebGLSupported,
  isLocalStorageAvailable,
  addBrowserEventListener,
  safeRequestAnimationFrame,
  safeCancelAnimationFrame,
  createBrowserRefCallback,
  getConnectionInfo,
  isDevelopment,
  isProduction,
} from "../utils/ssr";
