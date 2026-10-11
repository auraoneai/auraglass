'use client';
/* TopBar.EdgeRegistrar (SURF-035): per-shell edge registration. Registers
   its edge ('top' for TopBar, 'bottom' for TabBar) on the nearest
   .ag-app-shell root in a layout effect and warns when the SAME shell already
   has that edge (a second ScrollEdge on one edge would double-mask). One
   edge per scroll container: 'top' and 'bottom' never collide. Unregisters on
   unmount so a mount/unmount/remount cycle is silent. No shell root → a
   document-level bucket so two un-shelled bars still warn on the shared
   scroll container. */

import * as React from 'react';
import { appShellRoot } from './appShellStore';

export type ScrollEdgeSide = 'top' | 'bottom';

/* WeakMap<shellRoot|documentElement, Set<edge>> — module-level, never leaks
   DOM nodes. */
const registry = new WeakMap<HTMLElement, Set<ScrollEdgeSide>>();

export function TopBarEdgeRegistrar({ edge = 'top' }: { edge?: ScrollEdgeSide } = {}) {
  const marker = React.useRef<HTMLSpanElement | null>(null);

  React.useLayoutEffect(() => {
    const key: HTMLElement = appShellRoot(marker.current) ?? document.documentElement;
    let set = registry.get(key);
    if (!set) {
      set = new Set();
      registry.set(key, set);
    }
    if (set.has(edge)) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(
          `[auraglass] ${edge === 'top' ? 'TopBar' : 'TabBar'}: a second ScrollEdge edge="${edge}" was rendered for the same shell.`,
        );
      }
      // The first registrant owns the edge; a duplicate must not release it.
      return undefined;
    }
    set.add(edge);
    return () => {
      set!.delete(edge);
    };
  }, [edge]);

  return <span hidden ref={marker} data-ag-part="edge-registrar" data-ag-edge-registrar={edge} />;
}
