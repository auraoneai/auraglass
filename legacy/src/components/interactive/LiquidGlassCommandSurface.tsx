"use client";

import React, { forwardRef, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassCommandItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface LiquidGlassCommandSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  items: LiquidGlassCommandItem[];
  placeholder?: string;
}

export const LiquidGlassCommandSurface = forwardRef<
  HTMLDivElement,
  LiquidGlassCommandSurfaceProps
>(
  (
    {
      open,
      onOpenChange,
      items,
      placeholder = "Search commands",
      className,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const filtered = useMemo(
      () =>
        items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        ),
      [items, query]
    );

    if (!open) return null;

    return (
      <div className="glass-fixed glass-inset-0 glass-z-1200 glass-grid glass-place-items-start glass-overflow-y-auto glass-px-4 glass-py-16 sm:glass-px-6 sm:glass-py-24">
        <div
          aria-hidden="true"
          data-glass-overlay="true"
          className="glass-absolute glass-inset-0 glass-bg-white/20 glass-backdrop-blur-md"
          onClick={() => onOpenChange?.(false)}
        />
        <LiquidGlassMaterial
          ref={ref}
          material="liquid"
          radius="2xl"
          className={cn(
            "liquid-glass-command-surface glass-relative glass-z-10 glass-mx-auto glass-w-full glass-max-w-2xl glass-overflow-hidden",
            className
          )}
          style={
            {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.12))",
              color: "var(--glass-theme-text, var(--glass-text-primary))",
              "--glass-theme-text": "rgba(15,23,42,0.94)",
              "--glass-theme-text-secondary": "rgba(15,23,42,0.76)",
            } as React.CSSProperties
          }
          {...props}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onOpenChange?.(false);
              if (event.key === "ArrowDown")
                setSelectedIndex((index) =>
                  Math.min(index + 1, filtered.length - 1)
                );
              if (event.key === "ArrowUp")
                setSelectedIndex((index) => Math.max(index - 1, 0));
              if (event.key === "Enter") filtered[selectedIndex]?.onSelect?.();
            }}
            role="combobox"
            aria-expanded
            placeholder={placeholder}
            className="glass-w-full glass-bg-transparent glass-p-4 glass-outline-none"
          />
          <div
            ref={listRef}
            role="listbox"
            className="glass-relative glass-max-h-[min(24rem,calc(100vh-12rem))] glass-overflow-y-auto glass-p-2 glass-space-y-2"
            data-liquid-glass-scroll-target
          >
            <LiquidGlassScrollEdge
              edge="top"
              styleMode="soft"
              targetRef={listRef}
            />
            {filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                disabled={item.disabled}
                className={cn(
                  "glass-flex glass-w-full glass-min-w-0 glass-items-center glass-gap-3 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",
                  index === selectedIndex && "glass-surface-primary/20"
                )}
                style={{
                  background:
                    index === selectedIndex
                      ? "rgba(255,255,255,0.24)"
                      : "rgba(255,255,255,0.12)",
                  color: "var(--glass-theme-text, var(--glass-text-primary))",
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={item.onSelect}
              >
                {item.icon}
                <span className="glass-min-w-0 glass-flex-1">
                  <span className="glass-block glass-truncate glass-text-primary">
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      className="glass-block glass-truncate glass-text-xs glass-text-secondary"
                      style={{ color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))" }}
                    >
                      {item.description}
                    </span>
                  )}
                </span>
                {item.shortcut && (
                  <span
                    className="glass-shrink-0 glass-text-xs glass-text-secondary"
                    style={{ color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))" }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </LiquidGlassMaterial>
      </div>
    );
  }
);

LiquidGlassCommandSurface.displayName = "LiquidGlassCommandSurface";
