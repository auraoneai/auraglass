"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { LiquidGlassToolbar } from "./LiquidGlassToolbar";

export interface GlassToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  sticky?: boolean;
  floating?: boolean;
  material?: "glass" | "liquid";
  materialVariant?: "regular" | "clear";
  scrollEdge?: "soft" | "hard" | false;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export const GlassToolbar = forwardRef<HTMLDivElement, GlassToolbarProps>(
  (
    {
      left,
      center,
      right,
      sticky = false,
      floating = false,
      material = "glass",
      materialVariant = "regular",
      scrollEdge = false,
      respectMotionPreference = true,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Accessibility and motion preferences
    const toolbarId = useA11yId("toolbar");
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;

    if (material === "liquid") {
      return (
        <LiquidGlassToolbar
          ref={ref}
          left={left}
          center={center}
          right={right}
          sticky={sticky}
          floating={floating}
          materialVariant={materialVariant}
          scrollEdge={scrollEdge}
          aria-label={ariaLabel || "Toolbar"}
          className={className}
          {...rest}
        />
      );
    }

    return (
      <OptimizedGlass
        ref={ref}
        elevation={floating ? "level2" : "level1"}
        animation={shouldReduceMotion ? "none" : "gentle"}
        role="navigation"
        aria-label={ariaLabel || "Toolbar"}
        id={toolbarId}
        className={cn(
          "w-full max-w-full flex flex-wrap items-center justify-between glass-gap-3 glass-px-3 glass-py-2 glass-radius-xl",
          sticky && "sticky top-0 z-30",
          floating && "shadow-xl",
          className
        )}
        {...rest}
      >
        <div className="glass-min-w-0 glass-flex glass-flex-1 glass-items-center glass-gap-2 sm:glass-flex-none">
          {left}
        </div>
        <div className="glass-min-w-0 glass-order-3 glass-flex glass-w-full glass-items-center glass-justify-start sm:glass-order-none sm:glass-w-auto sm:glass-flex-1 sm:glass-justify-center">
          {center}
        </div>
        <div className="glass-min-w-0 glass-flex glass-flex-wrap glass-items-center glass-justify-end glass-gap-2">
          {right}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassToolbar.displayName = "GlassToolbar";

export default GlassToolbar;
