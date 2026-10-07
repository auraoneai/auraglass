"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassButtonStyleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  prominent?: boolean;
  materialVariant?: "regular" | "clear";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "glass-px-3 glass-py-1 glass-text-sm",
  md: "glass-px-4 glass-py-2",
  lg: "glass-px-5 glass-py-3",
  xl: "glass-px-6 glass-py-4 glass-text-lg",
};

export const LiquidGlassButtonStyle = forwardRef<HTMLButtonElement, LiquidGlassButtonStyleProps>(
  ({ prominent = false, materialVariant = "regular", size = "md", className, children, ...props }, ref) => (
    <LiquidGlassMaterial material="liquid" variant={materialVariant} radius="full" interactive>
      <button
        ref={ref}
        type="button"
        className={cn(
          "liquid-glass-button-style glass-inline-flex glass-items-center glass-justify-center glass-gap-2 glass-radius-full glass-bg-transparent glass-font-medium glass-outline-none",
          sizeClass[size],
          prominent && "glass-text-primary",
          className
        )}
        data-liquid-glass-button-style="true"
        {...props}
      >
        {children}
      </button>
    </LiquidGlassMaterial>
  )
);

LiquidGlassButtonStyle.displayName = "LiquidGlassButtonStyle";
