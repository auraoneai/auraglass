"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassBadgeClusterItem {
  id: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface LiquidGlassBadgeClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LiquidGlassBadgeClusterItem[];
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  maxCollapsed?: number;
  selectionMode?: "none" | "single" | "multiple";
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassBadgeCluster = forwardRef<HTMLDivElement, LiquidGlassBadgeClusterProps>(
  (
    {
      items,
      expanded = false,
      onExpandedChange,
      maxCollapsed = 3,
      selectionMode = "none",
      materialVariant = "regular",
      className,
      ...props
    },
    ref
  ) => {
    const visible = expanded ? items : items.slice(0, maxCollapsed);
    const hiddenCount = Math.max(items.length - visible.length, 0);
    return (
      <LiquidGlassMaterial
        ref={ref}
        material="liquid"
        variant={materialVariant}
        radius="full"
        className={cn("liquid-glass-badge-cluster glass-inline-flex", className)}
        data-selection-mode={selectionMode}
        {...props}
      >
        <LiquidGlassEffectGroup className="glass-flex glass-items-center glass-gap-1 glass-p-1">
          {visible.map((item) => (
            <span
              key={item.id}
              aria-pressed={item.selected}
              className={cn("glass-radius-full glass-px-2 glass-py-1 glass-text-xs", item.selected && "glass-surface-primary")}
            >
              {item.label}
            </span>
          ))}
          {hiddenCount > 0 && (
            <button type="button" className="glass-radius-full glass-px-2 glass-py-1 glass-text-xs" onClick={() => onExpandedChange?.(!expanded)}>
              +{hiddenCount}
            </button>
          )}
        </LiquidGlassEffectGroup>
      </LiquidGlassMaterial>
    );
  }
);

LiquidGlassBadgeCluster.displayName = "LiquidGlassBadgeCluster";
