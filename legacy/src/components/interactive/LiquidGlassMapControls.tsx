"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassControlGroup } from "../input/LiquidGlassControlGroup";

export interface LiquidGlassMapControl {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface LiquidGlassMapControlsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  controls: LiquidGlassMapControl[];
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassMapControls = forwardRef<
  HTMLDivElement,
  LiquidGlassMapControlsProps
>(
  (
    {
      controls,
      placement = "top-right",
      materialVariant = "clear",
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-map-controls glass-absolute glass-z-30",
        className
      )}
      data-liquid-glass-map-controls="true"
      data-placement={placement}
      {...props}
    >
      <LiquidGlassControlGroup
        orientation="vertical"
        materialVariant={materialVariant}
        aria-label="Map controls"
        className="glass-map-control-material"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.12))",
        }}
      >
        {controls.map((control) => (
          <button
            key={control.id}
            type="button"
            disabled={control.disabled}
            aria-label={control.label}
            className="glass-radius-full glass-p-2 glass-mb-1 last:glass-mb-0"
            onClick={control.onClick}
          >
            {control.icon ?? control.label}
          </button>
        ))}
      </LiquidGlassControlGroup>
    </div>
  )
);

LiquidGlassMapControls.displayName = "LiquidGlassMapControls";
