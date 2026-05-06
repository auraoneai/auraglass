"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "../lib/utilsComprehensive";
import { createGlassStyle } from "../core/mixins/glassMixins";

export type LiquidGlassScrollEdgeSide = "top" | "bottom" | "left" | "right";
export type LiquidGlassScrollEdgeStyle = "soft" | "hard" | "none";

export interface LiquidGlassScrollEdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  edge?: LiquidGlassScrollEdgeSide;
  styleMode?: LiquidGlassScrollEdgeStyle;
  active?: boolean;
  height?: number | string;
  targetRef?: React.RefObject<HTMLElement>;
  observeScroll?: boolean;
}

function getEdgeActive(target: HTMLElement, edge: LiquidGlassScrollEdgeSide) {
  if (edge === "top") return target.scrollTop > 0;
  if (edge === "bottom") return target.scrollTop + target.clientHeight < target.scrollHeight - 1;
  if (edge === "left") return target.scrollLeft > 0;
  return target.scrollLeft + target.clientWidth < target.scrollWidth - 1;
}

export const LiquidGlassScrollEdge = forwardRef<HTMLDivElement, LiquidGlassScrollEdgeProps>(
  (
    {
      edge = "top",
      styleMode = "soft",
      active,
      height = 32,
      targetRef,
      observeScroll = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [observedActive, setObservedActive] = useState(false);
    const isVertical = edge === "top" || edge === "bottom";
    const size = typeof height === "number" ? `${height}px` : height;
    const isActive = active ?? observedActive;

    useEffect(() => {
      if (!observeScroll || typeof window === "undefined" || active !== undefined) return;
      const target = targetRef?.current;
      if (!target) return;

      const update = () => setObservedActive(getEdgeActive(target, edge));
      update();
      target.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      return () => {
        target.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }, [active, edge, observeScroll, targetRef]);

    if (styleMode === "none") return null;

    const edgePosition: React.CSSProperties =
      edge === "top"
        ? { top: 0, left: 0, right: 0, height: size }
        : edge === "bottom"
          ? { bottom: 0, left: 0, right: 0, height: size }
          : edge === "left"
            ? { left: 0, top: 0, bottom: 0, width: size }
            : { right: 0, top: 0, bottom: 0, width: size };

    const gradientDirection =
      edge === "top" ? "to bottom" : edge === "bottom" ? "to top" : edge === "left" ? "to right" : "to left";
    const glassEdgeStyle = createGlassStyle({
      elevation: styleMode === "hard" ? "level3" : "level2",
      tier: styleMode === "hard" ? "high" : "medium",
    });

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "liquid-glass-scroll-edge glass-pointer-events-none glass-absolute glass-z-20",
          isActive ? "glass-opacity-100" : "glass-opacity-0",
          className
        )}
        style={{
          ...glassEdgeStyle,
          ...edgePosition,
          "--liquid-glass-scroll-edge-size": size,
          "--liquid-glass-scroll-edge-active": isActive ? 1 : 0,
          background:
            styleMode === "hard"
              ? "var(--liquid-glass-scroll-edge-hard-background, rgba(255,255,255,0.18))"
              : `linear-gradient(${gradientDirection}, var(--liquid-glass-scroll-edge-soft-background, rgba(255,255,255,0.2)), transparent)`,
          transition: "opacity var(--liquid-glass-scroll-edge-transition, 160ms ease)",
          ...style,
        } as React.CSSProperties}
        data-liquid-glass-scroll-edge={edge}
        data-liquid-glass-scroll-edge-style={styleMode}
        data-active={isActive ? "true" : "false"}
        {...props}
      />
    );
  }
);

LiquidGlassScrollEdge.displayName = "LiquidGlassScrollEdge";
