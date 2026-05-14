"use client";

import React from "react";

type AnyProps = Record<string, unknown>;
type AnyEventHandler = (event: unknown) => void;

const composeRefs = <T,>(
  forwardedRef: React.Ref<T> | undefined,
  childRef: React.Ref<T> | undefined
) => {
  return (node: T | null) => {
    if (typeof childRef === "function") {
      childRef(node);
    } else if (childRef) {
      (childRef as React.MutableRefObject<T | null>).current = node;
    }

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<T | null>).current = node;
    }
  };
};

const isEventHandler = (key: string, value: unknown) =>
  /^on[A-Z]/.test(key) && typeof value === "function";

const mergeProps = (slotProps: AnyProps, childProps: AnyProps) => {
  const mergedProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (isEventHandler(key, slotValue) && isEventHandler(key, childValue)) {
      mergedProps[key] = (event: unknown) => {
        (childValue as AnyEventHandler)(event);

        if (
          !(
            event &&
            typeof event === "object" &&
            "defaultPrevented" in event &&
            event.defaultPrevented
          )
        ) {
          (slotValue as AnyEventHandler)(event);
        }
      };
    } else if (key === "style") {
      mergedProps[key] = {
        ...(slotValue as React.CSSProperties),
        ...(childValue as React.CSSProperties),
      };
    } else if (key === "className") {
      mergedProps[key] = [slotValue, childValue].filter(Boolean).join(" ");
    }
  }

  return mergedProps;
};

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    const child = children as React.ReactElement<AnyProps>;
    const childRef = (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

    return React.cloneElement(child, {
      ...mergeProps(props as AnyProps, child.props),
      ref: composeRefs(forwardedRef, childRef),
    });
  }
);

Slot.displayName = "Slot";

export const GlassSlot = Slot;

export default Slot;
