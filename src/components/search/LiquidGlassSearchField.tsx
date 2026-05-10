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

export interface LiquidGlassSearchFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "results"
> {
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
    color: rgba(248, 250, 252, 0.96);
  }

  .liquid-glass-search-field-control input::placeholder {
    color: rgba(226, 232, 240, 0.68);
  }

  .liquid-glass-search-field-dropdown {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.84)) !important;
    border: 1px solid rgba(148, 163, 184, 0.24);
    color: rgba(248, 250, 252, 0.96);
    box-shadow: 0 22px 56px rgba(2, 6, 23, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    overflow: hidden;
  }

  .liquid-glass-search-field-option {
    background: rgba(15, 23, 42, 0.62) !important;
    color: rgba(248, 250, 252, 0.96) !important;
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option span {
    color: rgba(248, 250, 252, 0.96) !important;
  }

  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option {
    background: rgba(15, 23, 42, 0.7) !important;
    color: rgba(248, 250, 252, 0.96) !important;
  }

  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option span,
  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option .glass-block,
  [data-liquid-glass-search-field="true"] button.liquid-glass-search-field-option .glass-text-secondary {
    color: rgba(248, 250, 252, 0.96) !important;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(56, 189, 248, 0.2) !important;
    border-color: rgba(125, 211, 252, 0.28);
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
          elevation="level1"
          sheen={0}
          adaptToContent={false}
          enableRefraction={false}
          enableReflection={false}
          performanceLevel="efficient"
          className="liquid-glass-search-field-control"
          style={{
            background:
              '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
            border: "1px solid rgba(148, 163, 184, 0.24)",
            boxShadow:
              "0 10px 28px rgba(2, 6, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
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
                style={{ ...searchControlStyle, minWidth: 0 }}
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
              elevation="level1"
              sheen={0}
              adaptToContent={false}
              enableRefraction={false}
              enableReflection={false}
              performanceLevel="efficient"
              className="liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2"
              style={{
                background:
                  '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
                border: "1px solid rgba(148, 163, 184, 0.2)",
                boxShadow: "0 18px 44px rgba(2, 6, 23, 0.34)",
              }}
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
