/* MAT-290: S-25 useLayer — registers the caller's layer with the document's
   LayerStack and returns {id, depth, isTop}. Works without a provider: the
   stack is a per-document singleton (provider-less layers still portal via
   Base UI's default container). */
'use client';
import * as React from 'react';
import type { LayerEntry } from '../../contracts/preferences';
import type { LayerItem, LayerStack } from './LayerStack';
import { layerStackFor } from './LayerStack';

export const LayerStackContext = React.createContext<LayerStack | null>(null);

export interface UseLayerInput extends LayerEntry {
  restoreFocusTo?: Element | false | null;
  lockScroll?: boolean;
}

export function useLayer(entry: UseLayerInput): { id: string; depth: number; isTop: boolean } {
  const ctxStack = React.useContext(LayerStackContext);
  const stack = ctxStack
    ?? (typeof document === 'undefined' ? null : layerStackFor(document));
  const idRef = React.useRef<string | null>(null);
  const entryRef = React.useRef<UseLayerInput>(entry);
  entryRef.current = entry;

  const packed = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => (stack ? stack.subscribe(cb) : () => {}), [stack]),
    () => {
      const id = idRef.current;
      if (!stack || !id) return -1;
      const depth = stack.depth(id);
      return depth * 2 + (stack.isTop(id) ? 1 : 0);
    },
    () => -1,
  );

  /* REQ-CMP-80: stack membership is open-gated — depth is open order. A layer
     mounts into the stack only while open=true; closing pops it so a closed
     earlier-mounted overlay never occupies a depth slot. Re-opening pushes it
     back to the top (reorder on open). */
  const pushRef = React.useRef<() => void>(() => {});
  React.useLayoutEffect(() => {
    pushRef.current = () => {
      if (!stack || idRef.current) return;
      const input = entryRef.current;
      const restoreFocusTo: LayerItem['restoreFocusTo'] = input.restoreFocusTo !== undefined
        ? input.restoreFocusTo
        : (typeof document !== 'undefined' ? document.activeElement : null);
      idRef.current = stack.push({ ...input, restoreFocusTo });
    };
  });

  React.useLayoutEffect(() => {
    if (!stack || !entry.open) return undefined;
    pushRef.current();
    return () => {
      const id = idRef.current;
      if (id) stack.pop(id);
      idRef.current = null;
    };
  }, [stack, entry.open]);

  React.useLayoutEffect(() => {
    const id = idRef.current;
    if (!stack || !id || !entry.open) return;
    const patch: Parameters<LayerStack['update']>[1] = {
      kind: entry.kind, modal: entry.modal, open: entry.open,
      onEscape: entry.onEscape, element: entry.element,
    };
    if (entry.lockScroll !== undefined) patch.lockScroll = entry.lockScroll;
    if (entry.restoreFocusTo !== undefined) patch.restoreFocusTo = entry.restoreFocusTo;
    stack.update(id, patch);
  });

  if (packed < 0) return { id: '', depth: -1, isTop: false };
  return { id: idRef.current ?? '', depth: Math.floor(packed / 2), isTop: packed % 2 === 1 };
}
