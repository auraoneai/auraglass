"use client";

import React, { forwardRef, type CSSProperties } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassSidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface LiquidGlassInsetSidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  items: LiquidGlassSidebarItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  placement?: "left" | "right";
  collapsible?: boolean;
  collapsed?: boolean;
  backgroundExtension?: boolean;
  scrollEdge?: "soft" | "hard" | false;
  materialVariant?: "regular" | "clear";
}

const sidebarButtonStyle = (selected: boolean): CSSProperties => ({
  border: 0,
  background: selected ? "rgba(59, 130, 246, 0.14)" : "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  width: "100%",
});

export const LiquidGlassInsetSidebar = forwardRef<
  HTMLElement,
  LiquidGlassInsetSidebarProps
>(
  (
    {
      items,
      selectedId,
      onSelect,
      placement = "left",
      collapsible = true,
      collapsed = false,
      backgroundExtension = true,
      scrollEdge = "soft",
      materialVariant = "regular",
      className,
      ...props
    },
    ref
  ) => (
    <aside
      ref={ref}
      className={cn(
        "liquid-glass-inset-sidebar glass-relative glass-z-30 glass-p-3",
        placement === "right" && "glass-ml-auto",
        collapsed ? "glass-w-20" : "glass-w-72",
        className
      )}
      data-liquid-glass-inset-sidebar="true"
      data-background-extension={backgroundExtension ? "true" : "false"}
      {...props}
    >
      <LiquidGlassMaterial
        material="liquid"
        variant={materialVariant}
        radius="2xl"
        className="glass-h-full"
      >
        <style>{`
          .liquid-glass-inset-sidebar button {
            background-color: rgba(15, 23, 42, 0.72) !important;
            border: 1px solid rgba(255, 255, 255, 0.24) !important;
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-inset-sidebar button span {
            color: rgba(255, 255, 255, 0.95) !important;
          }
        `}</style>
        {scrollEdge && (
          <LiquidGlassScrollEdge edge="top" styleMode={scrollEdge} active />
        )}
        <nav
          aria-label={props["aria-label"] || "Sidebar"}
          className="glass-flex glass-flex-col glass-gap-1 glass-p-2"
        >
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                aria-current={selected ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",
                  selected && "glass-surface-primary glass-text-primary"
                )}
                style={sidebarButtonStyle(selected)}
                onClick={() => onSelect?.(item.id)}
              >
                {item.icon}
                {!collapsed && (
                  <span className="glass-min-w-0 glass-flex-1 glass-truncate">
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="glass-text-xs">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
        {!collapsible && (
          <span className="glass-sr-only">Sidebar is fixed</span>
        )}
      </LiquidGlassMaterial>
    </aside>
  )
);

LiquidGlassInsetSidebar.displayName = "LiquidGlassInsetSidebar";
