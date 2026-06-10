"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassSegment {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface LiquidGlassSegmentedControlProps
  extends React.HTMLAttributes<HTMLDivElement> {
  segments: LiquidGlassSegment[];
  value?: string;
  onValueChange?: (value: string) => void;
  density?: "compact" | "comfortable" | "spacious";
}

export const LiquidGlassSegmentedControl = forwardRef<
  HTMLDivElement,
  LiquidGlassSegmentedControlProps
>(
  (
    {
      segments,
      value,
      onValueChange,
      density = "comfortable",
      className,
      ...props
    },
    ref
  ) => (
    <LiquidGlassMaterial
      ref={ref}
      material="liquid"
      radius="full"
      className={cn(
        "liquid-glass-segmented-control glass-inline-flex",
        className
      )}
      data-density={density}
      {...props}
    >
      <LiquidGlassEffectGroup
        className="glass-flex glass-gap-1 glass-p-1"
        role="group"
      >
        {segments.map((segment) => {
          const selected = segment.id === value;
          return (
            <button
              key={segment.id}
              type="button"
              disabled={segment.disabled}
              aria-pressed={selected}
              className={cn(
                "glass-flex glass-items-center glass-gap-1 glass-radius-full glass-px-3 glass-py-1 glass-text-sm glass-text-secondary",
                selected &&
                  "glass-surface-subtle/20 glass-border-white/30 glass-text-primary"
              )}
              onClick={() => onValueChange?.(segment.id)}
            >
              {segment.icon}
              <span>{segment.label}</span>
            </button>
          );
        })}
      </LiquidGlassEffectGroup>
    </LiquidGlassMaterial>
  )
);

LiquidGlassSegmentedControl.displayName = "LiquidGlassSegmentedControl";
