"use client";

import React, { forwardRef, type CSSProperties } from "react";
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

export interface LiquidGlassToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
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

const toolbarButtonStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
};

export const LiquidGlassToolbar = forwardRef<
  HTMLDivElement,
  LiquidGlassToolbarProps
>(
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
      {scrollEdge && (
        <LiquidGlassScrollEdge edge="top" styleMode={scrollEdge} active />
      )}
      <LiquidGlassMaterial
        material="liquid"
        variant={materialVariant}
        radius="xl"
        interactive={false}
        className="glass-w-full glass-max-w-full"
      >
        <style>{`
          .liquid-glass-toolbar button {
            background-color: rgba(15, 23, 42, 0.72) !important;
            border: 1px solid rgba(255, 255, 255, 0.24) !important;
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-toolbar button span {
            color: rgba(255, 255, 255, 0.95) !important;
          }
        `}</style>
        <div className="glass-flex glass-w-full glass-max-w-full glass-flex-wrap glass-items-center glass-justify-between glass-gap-3">
          <div className="glass-flex glass-min-w-0 glass-flex-1 glass-items-center glass-gap-2 sm:glass-flex-none">
            {left}
          </div>
          <div className="glass-order-3 glass-flex glass-min-w-0 glass-w-full glass-items-center glass-justify-start glass-gap-2 glass-overflow-x-auto sm:glass-order-none sm:glass-w-auto sm:glass-flex-1 sm:glass-justify-center">
            {center}
            {groups.map((group) => (
              <LiquidGlassEffectGroup
                key={group.id}
                className="glass-flex glass-min-w-max glass-items-center glass-gap-1"
                aria-label={group["aria-label"]}
              >
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={item.disabled}
                    aria-label={item.label}
                    className={cn(
                      "glass-relative glass-inline-flex glass-min-w-max glass-items-center glass-gap-1 glass-radius-full glass-px-2 glass-py-1 glass-text-sm glass-transition",
                      (item.primary || item.id === primaryActionId) &&
                        "glass-text-primary"
                    )}
                    style={toolbarButtonStyle}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="glass-text-xs">{item.badge}</span>
                    )}
                  </button>
                ))}
              </LiquidGlassEffectGroup>
            ))}
            {children}
          </div>
          <div className="glass-flex glass-min-w-0 glass-flex-wrap glass-items-center glass-justify-end glass-gap-2">
            {right}
          </div>
        </div>
      </LiquidGlassMaterial>
    </div>
  )
);

LiquidGlassToolbar.displayName = "LiquidGlassToolbar";
