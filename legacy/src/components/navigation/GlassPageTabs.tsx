"use client";

import React, { forwardRef, useId, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import styles from "./GlassPageTabs.module.css";

export interface GlassPageTab {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  badge?: React.ReactNode;
  panel?: React.ReactNode;
}

export interface GlassPageTabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: GlassPageTab[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  renderPanel?: boolean;
}

export const GlassPageTabs = forwardRef<HTMLDivElement, GlassPageTabsProps>(
  (
    {
      tabs,
      value,
      defaultValue,
      onChange,
      orientation = "horizontal",
      activationMode = "automatic",
      renderPanel = true,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const firstEnabled = tabs.find((tab) => !tab.disabled)?.value;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? value ?? firstEnabled ?? ""
    );
    const selectedValue = value ?? internalValue;
    const selectedIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.value === selectedValue)
    );
    const selectedTab = tabs[selectedIndex];
    const selectTab = (nextValue: string) => {
      if (value === undefined) setInternalValue(nextValue);
      onChange?.(nextValue);
    };

    const focusTab = (nextIndex: number, activate: boolean) => {
      const nextTab = tabs[nextIndex];
      if (!nextTab || nextTab.disabled) return;
      const trigger = document.getElementById(
        `${generatedId}-tab-${nextTab.value}`
      );
      trigger?.focus();
      if (activate) selectTab(nextTab.value);
    };

    const move = (currentIndex: number, delta: number, activate: boolean) => {
      if (!tabs.length) return;
      for (let step = 1; step <= tabs.length; step += 1) {
        const nextIndex =
          (currentIndex + delta * step + tabs.length) % tabs.length;
        if (!tabs[nextIndex]?.disabled) {
          focusTab(nextIndex, activate);
          return;
        }
      }
    };

    return (
      <div
        ref={ref}
        data-glass-component
        data-glass-page-tabs="true"
        data-orientation={orientation}
        className={cn(
          "glass-page-tabs",
          styles.root,
          orientation === "vertical" ? styles.vertical : styles.horizontal,
          className
        )}
        {...props}
      >
        <div
          role="tablist"
          aria-orientation={orientation}
          className={cn(
            "glass-page-tabs__list",
            styles.tabList,
            orientation === "vertical"
              ? styles.verticalList
              : styles.horizontalList
          )}
        >
          {tabs.map((tab, index) => {
            const selected = tab.value === selectedValue;
            return (
              <button
                key={tab.value}
                id={`${generatedId}-tab-${tab.value}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${generatedId}-panel-${tab.value}`}
                tabIndex={selected ? 0 : -1}
                disabled={tab.disabled}
                data-state={selected ? "active" : "inactive"}
                className={cn(
                  "glass-page-tabs__trigger",
                  styles.trigger,
                  selected && styles.selected
                )}
                onClick={() => !tab.disabled && selectTab(tab.value)}
                onKeyDown={(event) => {
                  const activate = activationMode === "automatic";
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    move(index, 1, activate);
                  }
                  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    move(index, -1, activate);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    const next = tabs.findIndex((item) => !item.disabled);
                    if (next >= 0) focusTab(next, activate);
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    const next = [...tabs]
                      .reverse()
                      .findIndex((item) => !item.disabled);
                    if (next >= 0) focusTab(tabs.length - next - 1, activate);
                  }
                  if (
                    activationMode === "manual" &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    selectTab(tab.value);
                  }
                }}
              >
                <span className={styles.triggerLabel}>{tab.label}</span>
                {tab.badge ? (
                  <span className={styles.badge}>{tab.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        {renderPanel && selectedTab ? (
          <div
            id={`${generatedId}-panel-${selectedTab.value}`}
            role="tabpanel"
            aria-labelledby={`${generatedId}-tab-${selectedTab.value}`}
            tabIndex={0}
            className={cn("glass-page-tabs__panel", styles.panel)}
          >
            {selectedTab.panel}
          </div>
        ) : null}
      </div>
    );
  }
);

GlassPageTabs.displayName = "GlassPageTabs";
