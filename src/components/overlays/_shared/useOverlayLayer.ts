'use client';
/* CMP-196 (REQ-CMP-80): registers the open overlay with the S-25 LayerStack
   (src/theme/index.ts `useLayer`) so the stack sees it for ordering and Escape
   ownership.

   Escape path — documented per the task: the LayerStack entry's `onEscape`
   intentionally does NOT re-emit `onOpenChange`. Base UI's own dismiss
   (`useDismiss`, `escapeKey: isTopmost` in useDialogRoot) already fires
   `onOpenChange(reason:'escape-key')` for exactly its topmost floating element
   across every Base UI popup — including anchored popups this stack does not
   register (Select/Combobox inside a Dialog). If LayerStack forwarded Escape to
   our close too, one keypress would close two layers (BU's top plus ours) and
   desync uncontrolled state. So for Base-UI-backed overlays the LayerStack
   path is the one disabled: the entry still claims the Escape for layers
   below it (non-top entries never fire), while BU performs the close and
   emits the 'escape-key' reason once. Overlay rows close via BU, rows below
   stay put, mixed BU+LayerStack stacks stay consistent.

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

  const emit = React.useCallback((nextOpen: boolean, details: { event?: Event; reason?: unknown }) => {
    const reason = toOverlayReason(details.reason);
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
    onEscape: () => {
      /* See header: BU's dismiss owns the Escape close for BU-backed overlays;
         this entry exists so layers below never see the Escape while we're top. */
    },
  });

  return { id, depth, isTop, emit };
}
