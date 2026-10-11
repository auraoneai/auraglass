'use client';
/* REQ-FIN-07 (REQ-CMP-12, REQ-CMP-80): registers an open overlay with the S-25
   LayerStack (src/theme/index.ts `useLayer`), which is the single Escape
   dispatcher.

   Escape path. The stack receives Escape in the capture phase and hands it to
   the topmost OPEN entry only. For a Base-UI-backed overlay that entry closes
   the overlay through Base UI's imperative `actionsRef.current.close()`; the
   resulting onOpenChange is reported to the caller as
   `onOpenChange(false, { reason: 'escape-key' })`. Because the stack consumes
   the key (stopPropagation + preventDefault), Base UI's own document-level
   Escape dismissal never runs while a registered layer is open, so one
   keypress closes exactly one layer, including mixed Base UI +
   DismissableLayer stacks.

   Roots wire this by passing the returned `actionsRef` to their `Base.Root`
   and routing Base UI's onOpenChange through `emit`. A root that has not
   wired `actionsRef` yet keeps the previous behaviour: its entry returns
   `false` from onEscape, the stack leaves the native event alone and Base
   UI's dismiss closes the popup (it still claims the key against lower
   layers, because the stack stops at the topmost open entry).

   Scroll lock: modal overlays pass `lockScroll: modal`, so the stack's
   `<html data-ag-scroll-locked>` is the scroll-lock owner.

   `emit` dedupes identical (open, reason) emissions inside the same task —
   a belt for any path that can fire twice in one dispatch. */
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

/** The subset of Base UI's Root `actionsRef` the stack needs. */
export interface OverlayRootActions {
  close: () => void;
}

export interface OverlayLayerHandle {
  id: string;
  depth: number;
  isTop: boolean;
  emit: (open: boolean, details: { event?: Event; reason?: unknown }) => void;
  /** Pass to `Base.Root actionsRef` so the stack can close the overlay. */
  actionsRef: React.RefObject<OverlayRootActions | null>;
}

export function useOverlayLayer({ kind, modal, open, onOpenChange, element }: OverlayLayerOptions): OverlayLayerHandle {
  const handlerRef = React.useRef(onOpenChange);
  handlerRef.current = onOpenChange;
  const lastEmit = React.useRef<{ open: boolean; reason: string } | null>(null);
  const actionsRef = React.useRef<OverlayRootActions | null>(null);
  /* Set while a stack-dispatched Escape is closing the overlay through
     actionsRef, so the resulting Base UI change is reported as escape-key. */
  const escapePending = React.useRef(false);

  const emit = React.useCallback((nextOpen: boolean, details: { event?: Event; reason?: unknown }) => {
    let reason = toOverlayReason(details.reason);
    if (escapePending.current && nextOpen === false) {
      escapePending.current = false;
      reason = 'escape-key';
    }
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

  const onEscape = React.useCallback((): boolean => {
    const actions = actionsRef.current;
    if (!actions) return false; // root not wired yet: Base UI's dismiss closes it
    escapePending.current = true;
    actions.close();
    // close() reports synchronously in Base UI; clear the flag if it did not.
    queueMicrotask(() => { escapePending.current = false; });
    return true;
  }, []);

  const { id, depth, isTop } = useLayer({
    kind,
    modal,
    open,
    element: element ?? null,
    lockScroll: modal,
    onEscape,
  });

  return { id, depth, isTop, emit, actionsRef };
}
