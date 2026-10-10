/* CMP foundation portal (CMP-010): usePortalContainer() resolves the S-23
   provider portal-root ([data-ag-portal-root] > [data-ag-layer-root=<root>]).
   - null on the server and until mounted (hydration-safe: Portal renders nothing
     server-side, so markup matches and no portal mounts during hydration).
   - queries again after the first commit because AuraGlassProvider appends the
     portal-root markup in a layout effect that runs after children's effects.
   - document.body only once the DOM has settled without a provider (one dev
     warning); the hook never creates elements. */
import * as React from 'react';
import type { PortalLayerRoot } from '../contracts/preferences';

let warnedNoProvider = false;

const selectorFor = (root: PortalLayerRoot): string =>
  `[data-ag-portal-root] [data-ag-layer-root="${root}"]`;

export function usePortalContainer(root: PortalLayerRoot = 'overlay'): HTMLElement | null {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [settled, setSettled] = React.useState(false);

  React.useLayoutEffect(() => {
    if (el || settled) return;
    if (typeof document === 'undefined') return;
    const found = document.querySelector<HTMLElement>(selectorFor(root));
    if (found) {
      setEl(found);
      return;
    }
    // Not found in this commit — the provider may still be appending the
    // portal-root in its own layout effect; re-check after the flush.
    queueMicrotask(() => {
      const later = document.querySelector<HTMLElement>(selectorFor(root));
      if (later) setEl(later);
      else setSettled(true);
    });
  });

  if (el) return el;
  if (typeof document === 'undefined') return null;
  if (!settled) return null;
  if (process.env.NODE_ENV !== 'production' && !warnedNoProvider) {
    warnedNoProvider = true;
    // eslint-disable-next-line no-console
    console.warn(
      'aura-glass: no AuraGlassProvider mounted — portals fall back to document.body. ' +
      'Mount <AuraGlassProvider> at the app root for layered portal roots (S-23).',
    );
  }
  return document.body;
}
