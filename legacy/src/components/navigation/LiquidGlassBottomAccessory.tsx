"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassBottomAccessoryProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassBottomAccessory = forwardRef<HTMLDivElement, LiquidGlassBottomAccessoryProps>(
  ({ collapsed = false, materialVariant = "regular", className, children, ...props }, ref) => (
    <LiquidGlassMaterial
      ref={ref}
      material="liquid"
      variant={materialVariant}
      radius="full"
      className={cn("liquid-glass-bottom-accessory glass-w-full", collapsed && "glass-opacity-90", className)}
      data-liquid-glass-bottom-accessory="true"
      data-collapsed={collapsed ? "true" : "false"}
      {...props}
    >
      <div className="glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-2">{children}</div>
    </LiquidGlassMaterial>
  )
);

LiquidGlassBottomAccessory.displayName = "LiquidGlassBottomAccessory";
