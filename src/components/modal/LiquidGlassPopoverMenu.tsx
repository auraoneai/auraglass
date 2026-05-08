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
        "liquid-glass-popover-menu glass-min-w-56 glass-p-2",
        className
      )}
      data-liquid-glass-popover-menu="true"
      data-source-id={sourceId}
      {...props}
    >
      <style>{`
          .liquid-glass-popover-menu button {
            background-color: rgba(15, 23, 42, 0.72) !important;
            border: 1px solid rgba(255, 255, 255, 0.24) !important;
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-popover-menu button span {
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .liquid-glass-popover-menu button .glass-text-secondary {
            color: rgba(255, 255, 255, 0.78) !important;
          }
        `}</style>
      <div role="menu" className="glass-flex glass-flex-col glass-gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            aria-checked={item.selected}
            className={cn(
              "glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",
              item.selected && "glass-surface-primary"
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
