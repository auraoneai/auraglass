"use client";

import React, { forwardRef } from "react";
import { LiquidGlassSearchField, type LiquidGlassSearchFieldProps } from "./LiquidGlassSearchField";

export interface LiquidGlassSearchTabProps extends LiquidGlassSearchFieldProps {
  active?: boolean;
  tabId?: string;
}

export const LiquidGlassSearchTab = forwardRef<HTMLDivElement, LiquidGlassSearchTabProps>(
  ({ active = true, tabId = "search", ...props }, ref) => {
    if (!active) return null;
    return (
      <LiquidGlassSearchField
        ref={ref}
        placement="bottom"
        data-liquid-glass-search-tab={tabId}
        {...props}
      />
    );
  }
);

LiquidGlassSearchTab.displayName = "LiquidGlassSearchTab";
