/* REQ-FIN-07 (REQ-MAT-57, REQ-CMP-80): S-25 useLayer — registers the caller's
   layer with the document's LayerStack and returns {id, depth, isTop}.
   Works without a provider: the stack is a per-document singleton.

   The entry exists in the stack only while `open` is true: a closed layer
   holds no Escape, claims no inert pass, reports depth -1, and re-opening
   pushes it on top again, so depth is open order. */
'use client';
import * as React from 'react';
import type { LayerEntry } from '../../contracts/preferences';
import type { LayerItem, LayerItemInput, LayerStack } from './LayerStack';
import { layerStackFor } from './LayerStack';

export const LayerStackContext = React.createContext<LayerStack | null>(null);

export interface UseLayerInput extends LayerEntry {
  /** Return `false` to let the native Escape event through (see LayerItem). */
  onEscape: () => void | boolean;
  restoreFocusTo?: Element | false | null;
  lockScroll?: boolean;
  /** Inert below this layer without a scroll lock (replaces body inline-style
     writes for "disable outside pointer events"). */
  pointerLockOutside?: boolean;
  /** Outside pointerdown while this is the topmost open layer. */
  onPointerDownOutside?: (event: Event) => void;
  /** Outside focusin while this is the topmost open layer. */
  onFocusOutside?: (event: FocusEvent) => void;
}

const UNREGISTERED = -1;

export function useLayer(entry: UseLayerInput): { id: string; depth: number; isTop: boolean; isTopModal: boolean } {
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
      if (!stack || !id) return UNREGISTERED;
      const depth = stack.depth(id);
      return depth < 0 ? UNREGISTERED : depth * 4 + (stack.isTop(id) ? 2 : 0) + (stack.isTopModal(id) ? 1 : 0);
    },
    () => UNREGISTERED,
  );

  // Handlers are read through the ref so a re-render never re-registers.
  const toItem = React.useCallback((): LayerItemInput => {
    const e = entryRef.current;
    const item: LayerItemInput = {
      kind: e.kind,
      modal: e.modal,
      open: e.open,
      element: e.element,
      onEscape: () => entryRef.current.onEscape(),
      onPointerDownOutside: (ev) => entryRef.current.onPointerDownOutside?.(ev),
      onFocusOutside: (ev) => entryRef.current.onFocusOutside?.(ev),
    };
    item.lockScroll = e.lockScroll !== false;
    item.pointerLockOutside = e.pointerLockOutside === true;
    return item;
  }, []);

  const open = entry.open === true;
  React.useLayoutEffect(() => {
    if (!stack || !open) return undefined;
    const input = entryRef.current;
    const restoreFocusTo: LayerItem['restoreFocusTo'] = input.restoreFocusTo !== undefined
      ? input.restoreFocusTo
      : (typeof document !== 'undefined' ? document.activeElement : null);
    const id = stack.push({ ...toItem(), restoreFocusTo });
    idRef.current = id;
    return () => {
      stack.pop(id);
      idRef.current = null;
    };
  }, [stack, open, toItem]);

  // Keep the registered entry current (element, modality, scroll lock).
  const { kind, modal, element, lockScroll, pointerLockOutside, restoreFocusTo } = entry;
  React.useLayoutEffect(() => {
    const id = idRef.current;
    if (!stack || !id) return;
    const patch: Partial<LayerItemInput> = {
      kind, modal, element, open: true,
      // undefined means "default": lock for modals, no outside pointer lock.
      lockScroll: lockScroll !== false,
      pointerLockOutside: pointerLockOutside === true,
    };
    if (restoreFocusTo !== undefined) patch.restoreFocusTo = restoreFocusTo;
    stack.update(id, patch);
  }, [stack, kind, modal, element, lockScroll, pointerLockOutside, restoreFocusTo]);

  if (packed < 0) return { id: '', depth: -1, isTop: false, isTopModal: false };
  return { id: idRef.current ?? '', depth: Math.floor(packed / 4), isTop: (packed % 4) >= 2, isTopModal: packed % 2 === 1 };
}
