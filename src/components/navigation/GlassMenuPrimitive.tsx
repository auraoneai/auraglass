"use client";

import React from "react";

import { cn } from "../../lib/utilsComprehensive";
import { DismissableLayer, FocusScope, OptimizedGlass } from "../../primitives";

export interface GlassMenuPrimitiveRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export const GlassMenuPrimitiveRoot = React.forwardRef<
  HTMLDivElement,
  GlassMenuPrimitiveRootProps
>(
  (
    {
      children,
      className,
      orientation = "horizontal",
      disabled = false,
      ...props
    },
    ref
  ) => (
    <OptimizedGlass
      ref={ref}
      data-glass-component
      intent="neutral"
      elevation="level2"
      intensity="medium"
      depth={2}
      tint="neutral"
      border="subtle"
      animation="none"
      performanceMode="medium"
      className={cn(
        "relative glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
        orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="menubar"
      aria-orientation={orientation}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </OptimizedGlass>
  )
);

GlassMenuPrimitiveRoot.displayName = "GlassMenuPrimitiveRoot";

export interface GlassMenuPrimitiveContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onDismiss?: () => void;
  positionStrategy?: "absolute" | "contained";
}

export const GlassMenuPrimitiveContent = React.forwardRef<
  HTMLDivElement,
  GlassMenuPrimitiveContentProps
>(
  (
    {
      children,
      className,
      open = true,
      onDismiss,
      positionStrategy = "absolute",
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    return (
      <DismissableLayer
        ref={ref}
        role="menu"
        data-position-strategy={positionStrategy}
        onDismiss={onDismiss}
        className={cn(
          "glass-backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl",
          "min-w-48 glass-py-1",
          className
        )}
        {...props}
      >
        <FocusScope loop>{children}</FocusScope>
      </DismissableLayer>
    );
  }
);

GlassMenuPrimitiveContent.displayName = "GlassMenuPrimitiveContent";

export interface GlassMenuPrimitiveItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export const GlassMenuPrimitiveItem = React.forwardRef<
  HTMLButtonElement,
  GlassMenuPrimitiveItemProps
>(({ children, className, inset = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "relative flex items-center justify-between w-full",
      "glass-text-primary/80 hover:glass-text-primary transition-colors duration-200",
      "hover:bg-white/10 glass-radius-md glass-hover--translate-y-0-5",
      "focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent",
      "disabled:opacity-50 glass-disabled-cursor-not-allowed",
      inset && "glass-pl-8",
      className
    )}
    {...props}
  >
    {children}
  </button>
));

GlassMenuPrimitiveItem.displayName = "GlassMenuPrimitiveItem";

export const GlassMenuPrimitive = {
  Root: GlassMenuPrimitiveRoot,
  Content: GlassMenuPrimitiveContent,
  Item: GlassMenuPrimitiveItem,
};
