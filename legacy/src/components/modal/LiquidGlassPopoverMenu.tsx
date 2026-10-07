"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassPopoverMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface LiquidGlassPopoverMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  items: LiquidGlassPopoverMenuItem[];
  onOpenChange?: (open: boolean) => void;
  sourceId?: string;
}

export const LiquidGlassPopoverMenu = forwardRef<
  HTMLDivElement,
  LiquidGlassPopoverMenuProps
>(({ open, items, onOpenChange, sourceId, className, ...props }, ref) => {
  if (!open) return null;
  return (
    <LiquidGlassMaterial
      ref={ref}
      material="liquid"
      radius="xl"
      className={cn(
        "liquid-glass-popover-menu glass-on-light glass-min-w-56 glass-p-2",
        className
      )}
      intent="neutral"
      tintMode="light"
      adaptToContent={false}
      environmentAdaptation={false}
      style={
        {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.16)), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
          "--glass-theme-text": "rgb(15,23,42)",
          "--glass-text-primary": "rgb(15,23,42)",
          "--glass-text-secondary": "rgba(15,23,42,0.76)",
          "--glass-text-tertiary": "rgba(15,23,42,0.72)",
        } as React.CSSProperties
      }
      data-liquid-glass-popover-menu="true"
      data-source-id={sourceId}
      {...props}
    >
      <style>{`
          .liquid-glass-popover-menu button {
            background-color: rgba(var(--glass-color-white) / 0.12) !important;
            border: 1px solid rgba(255, 255, 255, 0.28) !important;
            color: rgb(15, 23, 42) !important;
            min-height: 44px;
          }

          .liquid-glass-popover-menu button span {
            color: rgb(15, 23, 42) !important;
          }

          .liquid-glass-popover-menu button .glass-text-secondary {
            color: rgb(51, 65, 85) !important;
          }
        `}</style>
      <div role="menu" className="glass-flex glass-flex-col glass-gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            aria-checked={item.selected}
            className={cn(
              "glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",
              item.selected && "glass-surface-overlay"
            )}
            onClick={() => {
              item.onSelect?.();
              onOpenChange?.(false);
            }}
          >
            {item.icon}
            <span className="glass-flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="glass-text-xs glass-text-secondary">
                {item.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>
    </LiquidGlassMaterial>
  );
});

LiquidGlassPopoverMenu.displayName = "LiquidGlassPopoverMenu";
