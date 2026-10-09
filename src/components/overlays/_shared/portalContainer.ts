'use client';
/* REQ-CMP-11: CMP portal seam — one hook over the S-23 provider portal root.
   usePortalContainer (src/theme) resolves [data-ag-portal-root] >
   [data-ag-layer-root=<root>]; when it returns null (no AuraGlassProvider
   mounted, or a foreign app) BU portals fall back to their own default
   container and we emit the one-time dev warning per page load. */
import * as React from 'react';
import { usePortalContainer, PortalRootContext } from '../../../theme/portal';
import type { PortalLayerRoot } from '../../../contracts/preferences';

let warnedNoProvider = false;

export function useCmpPortalContainer(root: PortalLayerRoot = 'overlay'): HTMLElement | null {
  const el = usePortalContainer(root);
  const inProvider = React.useContext(PortalRootContext) !== null;
  React.useEffect(() => {
    // Warn only with genuinely no provider mounted — while a provider's root
    // is still resolving (ctx present, el briefly null) there is nothing to
    // warn about.
    if (inProvider || el !== null || warnedNoProvider) return;
    warnedNoProvider = true;
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'aura-glass: no AuraGlassProvider mounted — portals fall back to the default container. ' +
        'Mount <AuraGlassProvider> at the app root for layered portal roots (S-23).',
      );
    }
  }, [el, inProvider]);
  // No provider: Base UI must still mount the popup — fall back to
  // document.body (the previous seam's contract). With a provider mounted the
  // root resolves shortly; until then null keeps the popup unmounted so it
  // appears directly in its layer root, not bouncing through body.
  if (!inProvider && typeof document !== 'undefined') return document.body;
  return el;
}
