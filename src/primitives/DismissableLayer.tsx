/* DismissableLayer (CMP-031): outside-interaction dismissal layer. Escape is no
   longer a private document listener — the layer registers on the PRD-05
   LayerStack via useLayer({kind, modal:false, open, onEscape, element}) and only
   the top open layer receives it. Outside pointer/focus dismissal stays local.
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

  // S-25: Escape is dispatched only to the top open layer entry.
  const escapeRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    escapeRef.current = () => {
      const synthetic = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      const prevented = withPreventedTracking(synthetic, (e) => onEscapeKeyDown?.(e as KeyboardEvent));
      if (!prevented) onDismiss?.();
    };
  });
  useLayer({ kind: layerKind, modal: false, open: !disabled, onEscape: () => escapeRef.current(), element });

  React.useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    return () => {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body || localRef.current?.contains(active)) {
        previousFocusRef.current?.focus();
      }
    };
  }, []);

  React.useEffect(() => {
    if (disabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || localRef.current?.contains(target)) return;
      const prevented = withPreventedTracking(event, (trackedEvent) => {
        onPointerDownOutside?.(trackedEvent);
        onInteractOutside?.(trackedEvent);
      });
      ignoreFocusOutsideRef.current = true;
      window.setTimeout(() => {
        ignoreFocusOutsideRef.current = false;
      }, 0);
      if (!prevented) onDismiss?.();
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (ignoreFocusOutsideRef.current) return;
      const target = event.target as Node | null;
      if (!target || localRef.current?.contains(target)) return;
      const prevented = withPreventedTracking(event, (trackedEvent) => {
        onFocusOutside?.(trackedEvent);
        onInteractOutside?.(trackedEvent);
      });
      if (!prevented) onDismiss?.();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [disabled, onDismiss, onFocusOutside, onInteractOutside, onPointerDownOutside]);

  React.useEffect(() => {
    if (!disableOutsidePointerEvents) return;
    const previousPointerEvents = document.body.style.pointerEvents;
    document.body.style.pointerEvents = 'none';
    return () => {
      document.body.style.pointerEvents = previousPointerEvents;
    };
  }, [disableOutsidePointerEvents]);

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
