"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassControlGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  density?: "compact" | "comfortable" | "spacious";
  selectionMode?: "none" | "single" | "multiple";
  rovingFocus?: boolean;
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassControlGroup = forwardRef<HTMLDivElement, LiquidGlassControlGroupProps>(
  (
    {
      orientation = "horizontal",
      density = "comfortable",
      selectionMode = "none",
      rovingFocus = true,
      materialVariant = "regular",
      className,
      children,
      ...props
    },
    ref
  ) => (
    <LiquidGlassMaterial
      ref={ref}
      material="liquid"
      variant={materialVariant}
      radius="full"
      className={cn("liquid-glass-control-group glass-inline-flex", className)}
      data-selection-mode={selectionMode}
      data-roving-focus={rovingFocus ? "true" : "false"}
      data-density={density}
      {...props}
    >
      <LiquidGlassEffectGroup
        className={cn("glass-flex glass-gap-1 glass-p-1", orientation === "vertical" && "glass-flex-col")}
      >
        {children}
      </LiquidGlassEffectGroup>
    </LiquidGlassMaterial>
  )
);

LiquidGlassControlGroup.displayName = "LiquidGlassControlGroup";
