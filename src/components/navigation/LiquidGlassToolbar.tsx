"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassToolbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void;
}

export interface LiquidGlassToolbarGroup {
  id: string;
  items: LiquidGlassToolbarItem[];
  "aria-label"?: string;
}

export interface LiquidGlassToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  groups?: LiquidGlassToolbarGroup[];
  floating?: boolean;
  sticky?: boolean;
  scrollEdge?: "soft" | "hard" | false;
  density?: "compact" | "comfortable" | "spacious";
  primaryActionId?: string;
  materialVariant?: "regular" | "clear";
}

const densityClass = {
  compact: "glass-gap-1 glass-px-2 glass-py-1",
  comfortable: "glass-gap-2 glass-px-3 glass-py-2",
  spacious: "glass-gap-3 glass-px-4 glass-py-3",
};

export const LiquidGlassToolbar = forwardRef<HTMLDivElement, LiquidGlassToolbarProps>(
  (
    {
      left,
      center,
      right,
      groups = [],
      floating = false,
      sticky = false,
      scrollEdge = false,
      density = "comfortable",
      primaryActionId,
      materialVariant = "regular",
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="toolbar"
      className={cn(
        "liquid-glass-toolbar glass-relative glass-flex glass-items-center glass-justify-between",
        sticky && "glass-sticky glass-top-0 glass-z-40",
        floating && "glass-z-40",
        densityClass[density],
        className
      )}
      data-liquid-glass-toolbar="true"
      data-density={density}
      {...props}
    >
      {scrollEdge && <LiquidGlassScrollEdge edge="top" styleMode={scrollEdge} active />}
      <LiquidGlassMaterial
        material="liquid"
        variant={materialVariant}
        radius="xl"
        interactive={false}
        className="glass-w-full"
      >
        <div className="glass-flex glass-w-full glass-items-center glass-justify-between glass-gap-3">
          <div className="glass-flex glass-min-w-0 glass-items-center glass-gap-2">{left}</div>
          <div className="glass-flex glass-min-w-0 glass-flex-1 glass-items-center glass-justify-center glass-gap-2">
            {center}
            {groups.map((group) => (
              <LiquidGlassEffectGroup
                key={group.id}
                className="glass-flex glass-items-center glass-gap-1"
                aria-label={group["aria-label"]}
              >
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={item.disabled}
                    aria-label={item.label}
                    className={cn(
                      "glass-relative glass-inline-flex glass-items-center glass-gap-1 glass-radius-full glass-px-2 glass-py-1 glass-text-sm glass-transition",
                      (item.primary || item.id === primaryActionId) && "glass-text-primary"
                    )}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && <span className="glass-text-xs">{item.badge}</span>}
                  </button>
                ))}
              </LiquidGlassEffectGroup>
            ))}
            {children}
          </div>
          <div className="glass-flex glass-min-w-0 glass-items-center glass-gap-2">{right}</div>
        </div>
      </LiquidGlassMaterial>
    </div>
  )
);

LiquidGlassToolbar.displayName = "LiquidGlassToolbar";
