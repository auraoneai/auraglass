"use client";

import React, {
  forwardRef,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
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

const searchControlStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  outline: "none",
};

const searchFieldStyles = `
  .liquid-glass-search-field,
  .liquid-glass-search-field * {
    box-sizing: border-box;
  }

  .liquid-glass-search-field-control {
    color: #0f172a;
  }

  .liquid-glass-search-field-control input::placeholder {
    color: rgba(51, 65, 85, 0.7);
  }

  .liquid-glass-search-field-dropdown {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.78)) !important;
    border: 1px solid rgba(15, 23, 42, 0.14);
    color: #0f172a;
    box-shadow: 0 22px 56px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.78);
    overflow: hidden;
  }

  .liquid-glass-search-field-option {
    color: #0f172a;
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(219, 234, 254, 0.78) !important;
    border-color: rgba(37, 99, 235, 0.18);
  }
`;

export const LiquidGlassSearchField = forwardRef<
  HTMLDivElement,
  LiquidGlassSearchFieldProps
>(
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
          ? results.filter((result) =>
              result.label.toLowerCase().includes(query.toLowerCase())
            )
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
        <style>{searchFieldStyles}</style>
        <LiquidGlassMaterial
          material="liquid"
          radius="full"
          interactive
          className="liquid-glass-search-field-control"
        >
          <label className="glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2">
            <span className="glass-sr-only">{placeholder}</span>
            {scope && (
              <span className="glass-text-xs glass-text-secondary">
                {scope}
              </span>
            )}
            {minimized ? (
              <button
                type="button"
                onClick={() => onMinimizedChange?.(false)}
                aria-label="Open search"
                style={{ ...searchControlStyle, cursor: "pointer" }}
              >
                Search
              </button>
            ) : (
              <input
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={placeholder}
                className="glass-min-w-0 glass-flex-1 glass-bg-transparent glass-outline-none"
                style={{ ...searchControlStyle, minWidth: 0, color: "#0f172a" }}
                role="combobox"
                aria-expanded={visibleResults.length > 0}
              />
            )}
          </label>
        </LiquidGlassMaterial>
        {!minimized &&
          (visibleResults.length > 0 || suggestions.length > 0) && (
            <LiquidGlassMaterial
              material="liquid"
              radius="xl"
              className="liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2"
            >
              <div
                role="listbox"
                className="glass-flex glass-flex-col glass-p-2"
                style={{ maxHeight: 280, overflowY: "auto" }}
              >
                {visibleResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    role="option"
                    className="liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left"
                    style={{ ...searchControlStyle, cursor: "pointer" }}
                    onClick={() => onSelect?.(result)}
                  >
                    <span className="glass-block">{result.label}</span>
                    {result.description && (
                      <span className="glass-text-xs glass-text-secondary">
                        {result.description}
                      </span>
                    )}
                  </button>
                ))}
                {!query &&
                  suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="liquid-glass-search-field-option glass-radius-lg glass-px-3 glass-py-2 glass-text-left"
                      style={{ ...searchControlStyle, cursor: "pointer" }}
                      onClick={() => updateQuery(suggestion)}
                    >
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
