/* DismissableLayer (CMP-031): outside-interaction dismissal layer. Escape and
   outside pointer/focus dismissal route through the PRD-05 LayerStack's
   single document dispatcher — this layer attaches NO global listeners and
   never writes body inline styles (REQ-CMP-12). `disableOutsidePointerEvents`
   maps to a non-scroll-locking modal stack entry so the stack's inert covers
   outside hits. Ref-as-prop; restores focus on unmount. */
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

  // S-25: Escape + outside dismissal are dispatched only to the top open
  // layer entry, via the stack's single document listeners.
  const escapeRef = React.useRef<() => void>(() => {});
  const outsideRef = React.useRef({ onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss });
  React.useEffect(() => {
    escapeRef.current = () => {
      const synthetic = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      const prevented = withPreventedTracking(synthetic, (e) => onEscapeKeyDown?.(e as KeyboardEvent));
      if (!prevented) onDismiss?.();
    };
    outsideRef.current = { onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss };
  });
  useLayer({
    kind: layerKind,
    // disableOutsidePointerEvents → non-scroll-locking modal entry: the
    // stack's inert replaces the old body pointer-events write.
    modal: disableOutsidePointerEvents,
    lockScroll: false,
    open: !disabled,
    onEscape: () => escapeRef.current(),
    element,
    onPointerDownOutside: (event) => {
      const h = outsideRef.current;
      const prevented = withPreventedTracking(event as PointerEvent, (trackedEvent) => {
        h.onPointerDownOutside?.(trackedEvent);
        h.onInteractOutside?.(trackedEvent);
      });
      ignoreFocusOutsideRef.current = true;
      window.setTimeout(() => {
        ignoreFocusOutsideRef.current = false;
      }, 0);
      if (!prevented) h.onDismiss?.();
    },
    onFocusOutside: (event) => {
      if (ignoreFocusOutsideRef.current) return;
      const h = outsideRef.current;
      const prevented = withPreventedTracking(event, (trackedEvent) => {
        h.onFocusOutside?.(trackedEvent);
        h.onInteractOutside?.(trackedEvent);
      });
      if (!prevented) h.onDismiss?.();
    },
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
