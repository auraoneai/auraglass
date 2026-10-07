"use client";

import React, { forwardRef } from "react";
import { Filter } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";
import { GlassButton } from "../button/GlassButton";

export interface GlassFilterBarFilter {
  id: string;
  label: string;
  value?: React.ReactNode;
  active?: boolean;
  onRemove?: () => void;
}

export interface GlassFilterBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  filters?: GlassFilterBarFilter[];
  actions?: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  label?: string;
}

export const GlassFilterBar = forwardRef<HTMLDivElement, GlassFilterBarProps>(
  (
    {
      filters = [],
      actions,
      onClear,
      clearLabel = "Clear filters",
      label = "Filters",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const activeFilters = filters.filter((filter) => filter.active !== false);

    return (
      <div
        ref={ref}
        data-glass-component
        role="region"
        aria-label={label}
        className={cn(
          "glass-flex glass-flex-wrap glass-items-center glass-gap-2 glass-rounded-lg glass-border glass-border-white/10 glass-bg-white/8 glass-p-3",
          className
        )}
        {...props}
      >
        <div className="glass-flex glass-items-center glass-gap-2 glass-text-sm glass-font-medium glass-text-primary">
          <Filter aria-hidden="true" className="glass-h-4 glass-w-4" />
          <span>{label}</span>
        </div>
        {children}
        {activeFilters.map((filter) => (
          <span
            key={filter.id}
            className="glass-inline-flex glass-items-center glass-gap-1 glass-rounded-full glass-border glass-border-white/10 glass-bg-white/10 glass-px-3 glass-py-1 glass-text-xs glass-text-primary"
          >
            <span>{filter.label}</span>
            {filter.value ? (
              <span className="glass-text-secondary">{filter.value}</span>
            ) : null}
            {filter.onRemove ? (
              <button
                type="button"
                onClick={filter.onRemove}
                className="glass-ml-1 glass-rounded-full glass-px-1 glass-text-secondary hover:glass-text-primary"
                aria-label={`Remove ${filter.label} filter`}
              >
                x
              </button>
            ) : null}
          </span>
        ))}
        <div className="glass-ml-auto glass-flex glass-items-center glass-gap-2">
          {actions}
          {onClear && activeFilters.length > 0 ? (
            <GlassButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={onClear}
            >
              {clearLabel}
            </GlassButton>
          ) : null}
        </div>
      </div>
    );
  }
);

GlassFilterBar.displayName = "GlassFilterBar";
