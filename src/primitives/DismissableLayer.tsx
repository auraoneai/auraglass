'use client';
/* DismissableLayer (CMP-031, REQ-FIN-07): outside-interaction dismissal layer.
   It registers on the S-25 LayerStack via useLayer and receives Escape and
   outside pointerdown/focusin only while it is the topmost open layer. It
   attaches no document listener and never writes body inline styles:
   disableOutsidePointerEvents maps to the stack's inert pass below this layer.
   Ref-as-prop; restores focus to the previously focused element on unmount. */
import * as React from 'react';
import { useLayer } from '../theme/index';
import type { LayerKind } from '../contracts/preferences';

export type DismissableLayerOutsideEvent = PointerEvent | MouseEvent | TouchEvent | FocusEvent;

export interface DismissableLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** S-25 layer kind — attribution for the stack (defaults to 'popover'). */
  layerKind?: LayerKind;
  /** Stops all dismissal behaviour (outside events and Escape). */
  disabled?: boolean;
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const withPreventedTracking = <EventType extends Event>(event: EventType, dispatch: (event: EventType) => void): boolean => {
  let prevented = false;
  const preventDefault = event.preventDefault.bind(event);
  event.preventDefault = () => {
    prevented = true;
    preventDefault();
  };
  dispatch(event);
  return prevented || event.defaultPrevented;
};

export function DismissableLayer({
  layerKind = 'popover',
  disabled = false,
  disableOutsidePointerEvents = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onDismiss,
  style,
  ref,
  ...props
}: DismissableLayerProps): React.ReactElement {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const ignoreFocusOutsideRef = React.useRef(false);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      setElement(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  // S-25: Escape and outside pointer/focus events reach this layer only
  // while it is the topmost open entry, through the stack's single
  // per-document dispatcher. No document listener here (REQ-FIN-07).
  const handlersRef = React.useRef({ onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss });
  handlersRef.current = { onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss };

  const handleEscape = React.useCallback(() => {
    const h = handlersRef.current;
    const synthetic = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    const prevented = withPreventedTracking(synthetic, (e) => h.onEscapeKeyDown?.(e as KeyboardEvent));
    if (!prevented) h.onDismiss?.();
  }, []);

  const handlePointerDownOutside = React.useCallback((event: Event) => {
    const h = handlersRef.current;
    const prevented = withPreventedTracking(event as PointerEvent, (trackedEvent) => {
      h.onPointerDownOutside?.(trackedEvent);
      h.onInteractOutside?.(trackedEvent);
    });
    // A pointerdown moves focus next; that focusin is part of the same
    // interaction and must not dismiss a second time.
    ignoreFocusOutsideRef.current = true;
    window.setTimeout(() => {
      ignoreFocusOutsideRef.current = false;
    }, 0);
    if (!prevented) h.onDismiss?.();
  }, []);

  const handleFocusOutside = React.useCallback((event: FocusEvent) => {
    if (ignoreFocusOutsideRef.current) return;
    const h = handlersRef.current;
    const prevented = withPreventedTracking(event, (trackedEvent) => {
      h.onFocusOutside?.(trackedEvent);
      h.onInteractOutside?.(trackedEvent);
    });
    if (!prevented) h.onDismiss?.();
  }, []);

  // disableOutsidePointerEvents: no body.style write. The stack applies the
  // below-this-layer inert pass (without a scroll lock) while it is open.
  useLayer({
    kind: layerKind,
    modal: false,
    open: !disabled,
    onEscape: handleEscape,
    onPointerDownOutside: handlePointerDownOutside,
    onFocusOutside: handleFocusOutside,
    element,
    pointerLockOutside: disableOutsidePointerEvents && !disabled,
  });

  React.useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    return () => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body || localRef.current?.contains(active)) {
        previousFocusRef.current?.focus();
      }
    };
  }, []);

  return (
    <div
      ref={setRef}
      data-ag-part="root"
      style={{ pointerEvents: disableOutsidePointerEvents ? 'auto' : undefined, ...style }}
      {...props}
    />
  );
}

DismissableLayer.displayName = 'DismissableLayer';
