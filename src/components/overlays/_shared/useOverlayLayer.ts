'use client';
/* CMP-196 (REQ-CMP-80): registers the open overlay with the S-25 LayerStack
   (src/theme/index.ts `useLayer`) so the stack sees it for ordering and Escape
   ownership.

   Escape path (REQ-CMP-12): the LayerStack owns the keypress. Each entry's
   `onEscape` emits close(false, 'escape-key') — the stack dispatches Escape
   to the top open entry only. Base UI's own dismiss still fires for BU's
   topmost floating element; emit() swallows that emission whenever the entry
   is registered but not stack-top, so mixed BU + DismissableLayer stacks
   perform exactly one close. `emit` (returned for the Root to wrap its own
   `onOpenChange`) dedupes identical (open, reason) emissions inside the same
   task — belt for any path that can fire twice in one dispatch. `lockScroll`
   is forwarded as `modal` so modal overlays take the stack's scroll lock.

   `emit` (returned for the Root to wrap its own `onOpenChange`) dedupes
   identical (open, reason) emissions inside the same task — belt for any
   path that can fire twice in one dispatch. */
import * as React from 'react';
import { useLayer } from '../../../theme';
import type { LayerKind } from '../../../contracts/preferences';
import type { OverlayOpenChangeDetails } from './overlayTypes';
import { toOverlayReason } from './overlayTypes';

export interface OverlayLayerOptions {
  kind: LayerKind;
  modal: boolean;
  open: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** Popup element once mounted (fed back by the root for LayerEntry.element). */
  element?: HTMLElement | null | undefined;
}

export interface OverlayLayerHandle {
  id: string;
  depth: number;
  isTop: boolean;
  emit: (open: boolean, details: { event?: Event; reason?: unknown }) => void;
}

export function useOverlayLayer({ kind, modal, open, onOpenChange, element }: OverlayLayerOptions): OverlayLayerHandle {
  const handlerRef = React.useRef(onOpenChange);
  handlerRef.current = onOpenChange;
  const lastEmit = React.useRef<{ open: boolean; reason: string } | null>(null);
  /* Mirror of the stack registration for emit()'s Escape guard — the
     callback is memoized, so it reads depth/topness through this ref. */
  const stackRef = React.useRef<{ id: string; isTop: boolean }>({ id: '', isTop: false });

  const emit = React.useCallback((nextOpen: boolean, details: { event?: Event; reason?: unknown }) => {
    const reason = toOverlayReason(details.reason);
    /* REQ-CMP-12: the LayerStack owns Escape ordering. BU's own dismiss still
       fires 'escape-key' for ITS topmost floating element — when our stack
       entry is registered but NOT the stack top (a non-BU layer, or a higher
       overlay, sits above), swallow that emission so the keypress performs
       exactly one close: the stack's top entry's onEscape. When we ARE top,
       BU's emission and the stack's onEscape both funnel here and the dedupe
       below collapses them to one. */
    if (nextOpen === false && reason === 'escape-key'
        && stackRef.current.id !== '' && !stackRef.current.isTop) return;
    const prev = lastEmit.current;
    if (prev && prev.open === nextOpen && prev.reason === reason) return;
    lastEmit.current = { open: nextOpen, reason };
    queueMicrotask(() => {
      if (lastEmit.current?.open === nextOpen && lastEmit.current.reason === reason) {
        lastEmit.current = null;
      }
    });
    handlerRef.current?.(nextOpen, { event: details.event, reason });
  }, []);

  const { id, depth, isTop } = useLayer({
    kind,
    modal,
    open,
    element: element ?? null,
    // REQ-CMP-12: modal layers scroll-lock via the stack's <html> attribute.
    lockScroll: modal,
    onEscape: () => emit(false, { reason: 'escape-key' }),
  });
  stackRef.current = { id, isTop };

  return { id, depth, isTop, emit };
}
