/**
 * Legacy SSR compatibility layer.
 *
 * The former styled-components integration offered helpers for collecting
 * styles during server-side rendering. AuraGlass has fully migrated to a
 * build-time CSS pipeline, so these utilities now no-op while keeping the API
 * surface for consumers that still import from `aura-glass/ssr`.
 */

import React from "react";

export interface StyleSheet {
  collectStyles: (children: React.ReactNode) => React.ReactElement;
  getStyleElement: () => React.ReactElement[];
  getStyleTags: () => string;
  seal: () => void;
  instance: null;
}

const createFallbackSheet = (): StyleSheet => ({
  collectStyles: (children: React.ReactNode) => <>{children}</>,
  getStyleElement: () => [],
  getStyleTags: () => "",
  seal: () => undefined,
  instance: null,
});

export function createStyleSheet(): StyleSheet {
  return createFallbackSheet();
}

export function collectStyles(): StyleSheet {
  return createFallbackSheet();
}

export const AuraGlassSSRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;

export function isStyledComponentsSSRReady(): boolean {
  return true;
}

export function getStyledComponentsVersion(): null {
  return null;
}
