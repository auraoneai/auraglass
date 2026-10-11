/* REQ-CMP-79 (CMP-194): which modal scrim is on top. Every open modal
   Backdrop (Dialog, AlertDialog, Sheet) reports its LayerStack depth here; the
   scrim with the greatest depth is the top one and carries
   data-ag-overlay-top (only that scrim keeps its blur). Non-modal layers
   (Popover, Menu, Tooltip, Toast) never render a scrim, so a menu or toast
   opened above a dialog does not take the marker away from the dialog's
   scrim. Depth comes from the LayerStack (useOverlayLayer); this module only
   compares the depths of mounted, open scrims. */
import * as React from 'react';

const depths = new Map<symbol, number>();
const listeners = new Set<() => void>();

const notify = (): void => {
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const topDepth = (): number => {
  let max = -1;
  depths.forEach((d) => {
    if (d > max) max = d;
  });
  return max;
};

/** True when this scrim is the open modal scrim with the greatest depth. */
export function useScrimTop(depth: number, open: boolean): boolean {
  const tokenRef = React.useRef<symbol | null>(null);
  if (tokenRef.current === null) tokenRef.current = Symbol('ag-scrim');
  const active = open && depth >= 0;

  React.useLayoutEffect(() => {
    const token = tokenRef.current!;
    if (!active) return undefined;
    depths.set(token, depth);
    notify();
    return () => {
      depths.delete(token);
      notify();
    };
  }, [active, depth]);

  const top = React.useSyncExternalStore(subscribe, topDepth, () => -1);
  return active && top === depth;
}
