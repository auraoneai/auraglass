'use client';
/* TopBar.EdgeRegistrar (SURF-035): per-shell edge registration. Registers
   edge 'top' on the nearest .ag-app-shell root in a layout effect and warns
   when the SAME shell already has a top edge (a second TopBar/ScrollEdge
   would double-mask). Unregisters on unmount so a mount/unmount/remount
   cycle is silent. No shell root → a document-level bucket so two un-shelled
   TopBars still warn on the shared scroll container. */

import * as React from 'react';
import { appShellRoot } from './appShellStore';

/* WeakMap<shellRoot|documentElement, Set<edge>> — module-level, never leaks
   DOM nodes. */
const registry = new WeakMap<HTMLElement, Set<string>>();

export function TopBarEdgeRegistrar() {
  const marker = React.useRef<HTMLSpanElement | null>(null);

  React.useLayoutEffect(() => {
    const key: HTMLElement = appShellRoot(marker.current) ?? document.documentElement;
    let set = registry.get(key);
    if (!set) {
      set = new Set();
      registry.set(key, set);
    }
    if (set.has('top') && process.env['NODE_ENV'] === 'development') {
      console.warn(
        '[auraglass] TopBar: a second ScrollEdge edge="top" was rendered for the same shell.',
      );
    }
    set.add('top');
    return () => {
      set!.delete('top');
    };
  }, []);

  return <span hidden ref={marker} data-ag-part="edge-registrar" />;
}
