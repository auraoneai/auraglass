"use client";

import React from "react";

export type PositionerSide = "top" | "right" | "bottom" | "left";
export type PositionerAlign = "start" | "center" | "end";

export interface PositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  anchorRef?: React.RefObject<HTMLElement>;
  side?: PositionerSide;
  align?: PositionerAlign;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  strategy?: "fixed" | "absolute";
  contained?: boolean;
}

const getTopLeft = (
  anchor: DOMRect,
  floating: DOMRect,
  side: PositionerSide,
  align: PositionerAlign,
  sideOffset: number,
  alignOffset: number
) => {
  let top = 0;
  let left = 0;

  if (side === "top") top = anchor.top - floating.height - sideOffset;
  if (side === "bottom") top = anchor.bottom + sideOffset;
  if (side === "left") left = anchor.left - floating.width - sideOffset;
  if (side === "right") left = anchor.right + sideOffset;

  if (side === "top" || side === "bottom") {
    if (align === "start") left = anchor.left + alignOffset;
    if (align === "center")
      left = anchor.left + anchor.width / 2 - floating.width / 2;
    if (align === "end") left = anchor.right - floating.width - alignOffset;
  } else {
    if (align === "start") top = anchor.top + alignOffset;
    if (align === "center")
      top = anchor.top + anchor.height / 2 - floating.height / 2;
    if (align === "end") top = anchor.bottom - floating.height - alignOffset;
  }

  return { top, left };
};

export const Positioner = React.forwardRef<HTMLDivElement, PositionerProps>(
  (
    {
      anchorRef,
      side = "bottom",
      align = "center",
      sideOffset = 0,
      alignOffset = 0,
      collisionPadding = 8,
      strategy = "fixed",
      contained = false,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = React.useState<React.CSSProperties>(() =>
      contained
        ? {}
        : {
            position: strategy,
            top: -9999,
            left: -9999,
          }
    );

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

    const updatePosition = React.useCallback(() => {
      if (contained) return;
      const anchor = anchorRef?.current;
      const floating = localRef.current;
      if (!anchor || !floating) return;

      const anchorRect = anchor.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      const next = getTopLeft(
        anchorRect,
        floatingRect,
        side,
        align,
        sideOffset,
        alignOffset
      );

      const maxLeft = window.innerWidth - floatingRect.width - collisionPadding;
      const maxTop =
        window.innerHeight - floatingRect.height - collisionPadding;

      setPosition({
        position: strategy,
        top: Math.max(collisionPadding, Math.min(maxTop, next.top)),
        left: Math.max(collisionPadding, Math.min(maxLeft, next.left)),
      });
    }, [
      align,
      alignOffset,
      anchorRef,
      collisionPadding,
      contained,
      side,
      sideOffset,
      strategy,
    ]);

    React.useLayoutEffect(() => {
      updatePosition();
    }, [children, updatePosition]);

    React.useEffect(() => {
      if (contained) return;

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [contained, updatePosition]);

    return (
      <div
        ref={setRef}
        data-side={side}
        data-align={align}
        style={{
          ...position,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Positioner.displayName = "Positioner";

export const GlassPositioner = Positioner;

export default Positioner;
