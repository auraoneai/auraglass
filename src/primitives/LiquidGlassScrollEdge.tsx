"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utilsComprehensive";
import { createGlassStyle } from "../core/mixins/glassMixins";

export type LiquidGlassScrollEdgeSide = "top" | "bottom" | "left" | "right";
export type LiquidGlassScrollEdgeStyle = "soft" | "hard" | "none";

export interface LiquidGlassScrollEdgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  edge?: LiquidGlassScrollEdgeSide;
  styleMode?: LiquidGlassScrollEdgeStyle;
  active?: boolean;
  height?: number | string;
  targetRef?: React.RefObject<HTMLElement>;
  observeScroll?: boolean;
  /**
   * Renders children inside a relative scroll container and places the edge as
   * an internal overlay. This prevents the common preview/app misuse where
   * children were passed to the overlay-only primitive and disappeared.
   */
  asContainer?: boolean;
  /** Class applied to the visual edge when rendering as a container. */
  edgeClassName?: string;
  /** Style applied to the visual edge when rendering as a container. */
  edgeStyle?: React.CSSProperties;
  /** Additional class for the generated scroll container. */
  containerClassName?: string;
  /** Additional style for the generated scroll container. */
  containerStyle?: React.CSSProperties;
}

function getEdgeActive(target: HTMLElement, edge: LiquidGlassScrollEdgeSide) {
  if (edge === "top") return target.scrollTop > 0;
  if (edge === "bottom")
    return target.scrollTop + target.clientHeight < target.scrollHeight - 1;
  if (edge === "left") return target.scrollLeft > 0;
  return target.scrollLeft + target.clientWidth < target.scrollWidth - 1;
}

export const LiquidGlassScrollEdge = forwardRef<
  HTMLDivElement,
  LiquidGlassScrollEdgeProps
>(
  (
    {
      edge = "top",
      styleMode = "soft",
      active,
      height = 32,
      targetRef,
      observeScroll = true,
      asContainer = false,
      edgeClassName,
      edgeStyle,
      containerClassName,
      containerStyle,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [observedActive, setObservedActive] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isVertical = edge === "top" || edge === "bottom";
    const size = typeof height === "number" ? `${height}px` : height;
    const isActive = active ?? observedActive;
    const shouldRenderContainer = asContainer || children !== undefined;
    const setContainerNode = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (
        !observeScroll ||
        typeof window === "undefined" ||
        active !== undefined
      )
        return;
      const target = targetRef?.current ?? containerRef.current;
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

    if (styleMode === "none" && !shouldRenderContainer) return null;

    const edgePosition: React.CSSProperties =
      edge === "top"
        ? { top: 0, left: 0, right: 0, height: size }
        : edge === "bottom"
          ? { bottom: 0, left: 0, right: 0, height: size }
          : edge === "left"
            ? { left: 0, top: 0, bottom: 0, width: size }
            : { right: 0, top: 0, bottom: 0, width: size };

    const gradientDirection =
      edge === "top"
        ? "to bottom"
        : edge === "bottom"
          ? "to top"
          : edge === "left"
            ? "to right"
            : "to left";
    const glassEdgeStyle = createGlassStyle({
      elevation: styleMode === "hard" ? "level3" : "level2",
      tier: styleMode === "hard" ? "high" : "medium",
    });

    const renderEdge = (edgeRef?: React.ForwardedRef<HTMLDivElement>) => (
      <div
        ref={edgeRef}
        aria-hidden="true"
        className={cn(
          "liquid-glass-scroll-edge glass-pointer-events-none glass-absolute glass-z-20",
          isActive ? "glass-opacity-100" : "glass-opacity-0",
          shouldRenderContainer ? edgeClassName : className
        )}
        style={
          {
            ...glassEdgeStyle,
            ...edgePosition,
            "--liquid-glass-scroll-edge-size": size,
            "--liquid-glass-scroll-edge-active": isActive ? 1 : 0,
            background:
              styleMode === "hard"
                ? "var(--liquid-glass-scroll-edge-hard-background, rgba(255,255,255,0.18))"
                : `linear-gradient(${gradientDirection}, var(--liquid-glass-scroll-edge-soft-background, rgba(255,255,255,0.2)), transparent)`,
            transition:
              "opacity var(--liquid-glass-scroll-edge-transition, 160ms ease)",
            ...(shouldRenderContainer ? edgeStyle : style),
          } as React.CSSProperties
        }
        data-liquid-glass-scroll-edge={edge}
        data-liquid-glass-scroll-edge-style={styleMode}
        data-active={isActive ? "true" : "false"}
        {...(!shouldRenderContainer ? props : {})}
      />
    );

    if (!shouldRenderContainer) {
      return renderEdge(ref);
    }

    if (styleMode === "none") {
      return (
        <div
          ref={setContainerNode}
          className={cn(
            "liquid-glass-scroll-edge-container glass-relative glass-overflow-hidden",
            className,
            containerClassName
          )}
          style={{ ...style, ...containerStyle }}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={setContainerNode}
        className={cn(
          "liquid-glass-scroll-edge-container glass-relative glass-overflow-hidden",
          isVertical ? "glass-overflow-y-auto" : "glass-overflow-x-auto",
          className,
          containerClassName
        )}
        style={{ ...style, ...containerStyle }}
        data-liquid-glass-scroll-edge-container={edge}
        {...props}
      >
        {children}
        {renderEdge()}
      </div>
    );
  }
);

LiquidGlassScrollEdge.displayName = "LiquidGlassScrollEdge";
