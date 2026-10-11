/* S-23 (REQ-FIN-07, REQ-MAT-56, REQ-CMP-11): portal-root context +
   usePortalContainer. The outermost provider renders PORTAL_ROOT_MARKUP once
   per document and publishes the element here; nested providers forward the
   same root. This is the only usePortalContainer in the package
   (src/foundation/portal.ts re-exports it). It returns null without a
   provider. Note for consumers: Base UI 1.x treats an explicit
   `container={null}` as "wait for the container", and `undefined` as "use
   the default container", so a consumer that must render without a provider
   maps null to undefined itself. */
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

/** S-23 (REQ-FIN-07): the single usePortalContainer implementation
   (`src/foundation/portal.ts` re-exports it). Returns the provider's
   `[data-ag-layer-root=<root>]`, resolved during render once the provider has
   published its portal root, or `null` when no provider is mounted (and on
   the server). Consumers decide what `null` means for their portal. */
export function usePortalContainer(root: PortalLayerRoot = 'overlay'): HTMLElement | null {
  const ctx = React.useContext(PortalRootContext);
  return ctx?.root ? queryLayerRoot(ctx.root, root) : null;
}
