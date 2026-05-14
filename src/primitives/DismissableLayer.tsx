"use client";

import React from "react";

export type DismissableLayerOutsideEvent =
  | PointerEvent
  | MouseEvent
  | TouchEvent
  | FocusEvent;

export interface DismissableLayerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: () => void;
}

const withPreventedTracking = <EventType extends Event>(
  event: EventType,
  dispatch: (event: EventType) => void
) => {
  let prevented = false;
  const preventDefault = event.preventDefault.bind(event);
  event.preventDefault = () => {
    prevented = true;
    preventDefault();
  };

  dispatch(event);

  return prevented || event.defaultPrevented;
};

export const DismissableLayer = React.forwardRef<
  HTMLDivElement,
  DismissableLayerProps
>(
  (
    {
      disabled = false,
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const ignoreFocusOutsideRef = React.useRef(false);

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }
      },
      [forwardedRef]
    );

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

        if (!prevented) {
          onDismiss?.();
        }
      };

      const handleFocusIn = (event: FocusEvent) => {
        if (ignoreFocusOutsideRef.current) return;

        const target = event.target as Node | null;
        if (!target || localRef.current?.contains(target)) return;

        const prevented = withPreventedTracking(event, (trackedEvent) => {
          onFocusOutside?.(trackedEvent);
          onInteractOutside?.(trackedEvent);
        });

        if (!prevented) {
          onDismiss?.();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;

        const prevented = withPreventedTracking(event, (trackedEvent) => {
          onEscapeKeyDown?.(trackedEvent);
        });

        if (!prevented) {
          onDismiss?.();
        }
      };

      document.addEventListener("pointerdown", handlePointerDown, true);
      document.addEventListener("focusin", handleFocusIn, true);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown, true);
        document.removeEventListener("focusin", handleFocusIn, true);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      disabled,
      onDismiss,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onPointerDownOutside,
    ]);

    React.useEffect(() => {
      if (!disableOutsidePointerEvents) return;

      const previousPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = "none";

      return () => {
        document.body.style.pointerEvents = previousPointerEvents;
      };
    }, [disableOutsidePointerEvents]);

    return (
      <div
        ref={setRef}
        style={{
          pointerEvents: disableOutsidePointerEvents ? "auto" : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);

DismissableLayer.displayName = "DismissableLayer";

export const GlassDismissableLayer = DismissableLayer;

export default DismissableLayer;
