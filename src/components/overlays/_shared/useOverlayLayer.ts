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
   and routing Base UI's onOpenChange through `emit`. Overlays that register
   from the popup (Popover, Menu, ContextMenu, Tooltip) or whose Base UI root
   has no imperative close (Select, Combobox) create the close path at the
   root with `useRoutedRootActions` and hand it to the popup's registration
   as `actions`; the root then reports the stack-dispatched close as
   'escape-key' through `takeEscape()`. An entry without any actions returns
   `false` from onEscape and Base UI's own dismiss closes the popup.

   Outside press stays Base UI-owned: it is pointer-targeted (the press lands
   outside exactly one popup's tree), so it cannot double-dismiss a stack the
   way a document-level Escape can; Base UI reports it as 'outside-press'.

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
  /** Close path supplied by the root (useRoutedRootActions) when the
      registration lives in the popup or Base UI has no imperative close. */
  actions?: React.RefObject<OverlayRootActions | null> | undefined;
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

export function useOverlayLayer({ kind, modal, open, onOpenChange, element, actions: externalActions }: OverlayLayerOptions): OverlayLayerHandle {
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
    const actions = externalActions?.current ?? actionsRef.current;
    if (!actions) return false; // root not wired yet: Base UI's dismiss closes it
    escapePending.current = true;
    actions.close();
    // close() reports synchronously in Base UI; clear the flag if it did not.
    queueMicrotask(() => { escapePending.current = false; });
    return true;
  }, [externalActions]);

  const { id, depth, isTop } = useLayer({
    kind,
    modal,
    open,
    element: element ?? null,
    lockScroll: modal,
    onEscape,
  });

  /* S-01: data-ag-overlay-depth is CMP's marker (setter CMP); the stack
     supplies the open order, the overlay writes it on its popup. */
  React.useLayoutEffect(() => {
    if (!element) return undefined;
    if (!open || depth < 0) {
      element.removeAttribute('data-ag-overlay-depth');
      return undefined;
    }
    element.setAttribute('data-ag-overlay-depth', String(depth));
    return () => element.removeAttribute('data-ag-overlay-depth');
  }, [element, open, depth]);

  return { id, depth, isTop, emit, actionsRef };
}

export interface RoutedRootActions {
  /** Pass to the popup's useOverlayLayer({ actions }). */
  actions: React.RefObject<OverlayRootActions | null>;
  /** True (once) when the close now being reported came from the stack's Escape. */
  takeEscape: () => boolean;
}

/** Root-side close path for overlays whose LayerStack entry is registered by
    the popup, or whose Base UI root exposes no imperative close. `close`
    performs the actual close (Base UI actionsRef.close(), or the root's
    controlled open state); the close it triggers is then reported by the
    root's onOpenChange as reason 'escape-key' via takeEscape(). */
export function useRoutedRootActions(close: () => void): RoutedRootActions {
  const closeRef = React.useRef(close);
  closeRef.current = close;
  const escape = React.useRef(false);
  const actions = React.useRef<OverlayRootActions | null>(null);
  if (actions.current === null) {
    actions.current = {
      close: () => {
        escape.current = true;
        closeRef.current();
        queueMicrotask(() => { escape.current = false; });
      },
    };
  }
  const takeEscape = React.useCallback(() => {
    const was = escape.current;
    escape.current = false;
    return was;
  }, []);
  return { actions, takeEscape };
}
