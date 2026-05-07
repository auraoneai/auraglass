"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface LiquidGlassTabBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: LiquidGlassTabItem[];
  activeTab?: string;
  onChange?: (id: string) => void;
  minimizeBehavior?: "never" | "on-scroll-down" | "on-scroll" | "auto";
  searchTabId?: string;
  bottomAccessory?: React.ReactNode;
  accessoryPlacement?: "above" | "collapsed" | "auto";
  scrollTargetRef?: React.RefObject<HTMLElement>;
  materialVariant?: "regular" | "clear";
}

const tabButtonStyle = (selected: boolean): CSSProperties => ({
  border: 0,
  background: selected ? "rgba(59, 130, 246, 0.14)" : "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
});

export const LiquidGlassTabBar = forwardRef<
  HTMLDivElement,
  LiquidGlassTabBarProps
>(
  (
    {
      tabs,
      activeTab,
      onChange,
      minimizeBehavior = "auto",
      searchTabId,
      bottomAccessory,
      accessoryPlacement = "auto",
      scrollTargetRef,
      materialVariant = "regular",
      className,
      ...props
    },
    ref
  ) => {
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
      if (minimizeBehavior === "never" || typeof window === "undefined") return;
      const target = scrollTargetRef?.current ?? window;
      let lastY = 0;
      const readY = () =>
        target === window ? window.scrollY : (target as HTMLElement).scrollTop;
      const onScroll = () => {
        const y = readY();
        setMinimized(
          minimizeBehavior === "on-scroll-down" ? y > lastY && y > 16 : y > 16
        );
        lastY = y;
      };
      target.addEventListener("scroll", onScroll as EventListener, {
        passive: true,
      });
      return () =>
        target.removeEventListener("scroll", onScroll as EventListener);
    }, [minimizeBehavior, scrollTargetRef]);

    return (
      <div
        ref={ref}
        className={cn(
          "liquid-glass-tab-bar glass-relative glass-z-40",
          className
        )}
        data-liquid-glass-tab-bar="true"
        data-minimized={minimized ? "true" : "false"}
        {...props}
      >
        {bottomAccessory && accessoryPlacement !== "collapsed" && (
          <div className="glass-mb-2">{bottomAccessory}</div>
        )}
        <LiquidGlassScrollEdge edge="bottom" styleMode="soft" active />
        <LiquidGlassMaterial
          material="liquid"
          variant={materialVariant}
          radius="full"
        >
          <LiquidGlassEffectGroup className="glass-flex glass-max-w-full glass-items-center glass-gap-1 glass-overflow-x-auto glass-p-1">
            {tabs.map((tab) => {
              const selected = tab.id === activeTab;
              const isSearch = tab.id === searchTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  disabled={tab.disabled}
                  className={cn(
                    "glass-flex glass-min-w-max glass-flex-shrink-0 glass-items-center glass-gap-1 glass-radius-full glass-px-3 glass-py-2",
                    selected && "glass-surface-primary glass-text-primary",
                    minimized && !selected && "glass-px-2"
                  )}
                  style={tabButtonStyle(selected)}
                  onClick={() => onChange?.(tab.id)}
                >
                  {tab.icon}
                  {!minimized && <span>{tab.label}</span>}
                  {isSearch && (
                    <span className="glass-sr-only">Search tab</span>
                  )}
                  {tab.badge && (
                    <span className="glass-text-xs">{tab.badge}</span>
                  )}
                </button>
              );
            })}
            {bottomAccessory && accessoryPlacement === "collapsed" && (
              <div>{bottomAccessory}</div>
            )}
          </LiquidGlassEffectGroup>
        </LiquidGlassMaterial>
      </div>
    );
  }
);

LiquidGlassTabBar.displayName = "LiquidGlassTabBar";
