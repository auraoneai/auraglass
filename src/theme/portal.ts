/* S-23: portal-root context + usePortalContainer. The outermost provider renders
   PORTAL_ROOT_MARKUP once per document and publishes the element here; nested
   providers forward the same root. Returns null without a provider so Base UI
   falls back to its own default container. */
'use client';
import * as React from 'react';
import type { PortalLayerRoot } from '../contracts/preferences';

export interface PortalRootState {
  /** The element that owns the layer roots (the portal root itself). */
  root: HTMLElement | null;
}

export const PortalRootContext = React.createContext<PortalRootState | null>(null);

export const queryLayerRoot = (
  host: HTMLElement | Document | null, name: PortalLayerRoot,
): HTMLElement | null =>
  host?.querySelector<HTMLElement>(`[data-ag-layer-root="${name}"]`) ?? null;

export const findPortalRoot = (doc: Document | null): HTMLElement | null =>
  doc?.querySelector<HTMLElement>('[data-ag-portal-root]') ?? null;

export function usePortalContainer(root: PortalLayerRoot = 'overlay'): HTMLElement | null {
  const ctx = React.useContext(PortalRootContext);
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    if (ctx?.root) {
      setEl(queryLayerRoot(ctx.root, root));
      return;
    }
    // No provider in this tree: fall back to any portal root already in the
    // document (e.g. mounted by another copy of the library), else null.
    const host = findPortalRoot(typeof document === 'undefined' ? null : document);
    setEl(host ? queryLayerRoot(host, root) : null);
  }, [ctx, root]);
  return el;
}
