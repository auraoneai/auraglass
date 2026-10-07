/**
 * AuraGlass server entrypoint.
 *
 * Exposes SSR-safe utilities without triggering the global 'use client' bundle.
 * Import from `aura-glass/server` inside frameworks like Next.js App Router layouts.
 */

export {
  AuraGlassSSRProvider,
  collectStyles,
  createStyleSheet,
  getStyledComponentsVersion,
  isStyledComponentsSSRReady,
} from "../ssr";

export {
  ensureStyledComponentsRegistry,
  hasStyledComponentsRegistry,
  markStyledRegistryHealthy,
  clearStyledRegistryHealth,
} from "./registryGuard";
