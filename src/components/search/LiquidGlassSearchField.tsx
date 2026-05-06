"use client";

import React, { forwardRef, useMemo, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassSearchResult {
  id: string;
  label: string;
  description?: string;
  group?: string;
}

export interface LiquidGlassSearchFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "results"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (result: LiquidGlassSearchResult) => void;
  placeholder?: string;
  placement?: "bottom" | "top-trailing" | "center" | "auto";
  minimized?: boolean;
  onMinimizedChange?: (minimized: boolean) => void;
  suggestions?: string[];
  results?: LiquidGlassSearchResult[];
  scope?: string;
}

export const LiquidGlassSearchField = forwardRef<HTMLDivElement, LiquidGlassSearchFieldProps>(
  (
    {
      value,
      onValueChange,
      onSelect,
      placeholder = "Search",
      placement = "auto",
      minimized = false,
      onMinimizedChange,
      suggestions = [],
      results = [],
      scope,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const query = value ?? internalValue;
    const visibleResults = useMemo(
      () =>
        query
          ? results.filter((result) => result.label.toLowerCase().includes(query.toLowerCase()))
          : results.slice(0, 6),
      [query, results]
    );
    const updateQuery = (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn("liquid-glass-search-field glass-relative", className)}
        data-liquid-glass-search-field="true"
        data-placement={placement}
        data-minimized={minimized ? "true" : "false"}
        {...props}
      >
        <LiquidGlassMaterial material="liquid" radius="full" interactive>
          <label className="glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2">
            <span className="glass-sr-only">{placeholder}</span>
            {scope && <span className="glass-text-xs glass-text-secondary">{scope}</span>}
            {minimized ? (
              <button type="button" onClick={() => onMinimizedChange?.(false)} aria-label="Open search">
                Search
              </button>
            ) : (
              <input
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={placeholder}
                className="glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none"
                role="combobox"
                aria-expanded={visibleResults.length > 0}
              />
            )}
          </label>
        </LiquidGlassMaterial>
        {!minimized && (visibleResults.length > 0 || suggestions.length > 0) && (
          <LiquidGlassMaterial material="liquid" radius="xl" className="glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2">
            <div role="listbox" className="glass-flex glass-flex-col glass-p-2">
              {visibleResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  role="option"
                  className="glass-radius-lg glass-px-3 glass-py-2 glass-text-left"
                  onClick={() => onSelect?.(result)}
                >
                  <span className="glass-block">{result.label}</span>
                  {result.description && <span className="glass-text-xs glass-text-secondary">{result.description}</span>}
                </button>
              ))}
              {!query &&
                suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" className="glass-radius-lg glass-px-3 glass-py-2 glass-text-left" onClick={() => updateQuery(suggestion)}>
                    {suggestion}
                  </button>
                ))}
            </div>
          </LiquidGlassMaterial>
        )}
      </div>
    );
  }
);

LiquidGlassSearchField.displayName = "LiquidGlassSearchField";
