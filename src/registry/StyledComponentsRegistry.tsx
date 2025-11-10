'use client';

import type { ReactNode } from 'react';

/**
 * Deprecated compatibility component. Styling is now driven by
 * CSS variables generated from AuraGlass design tokens, so no runtime
 * registry is required. This component simply renders its children.
 */
export function StyledComponentsRegistry({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
