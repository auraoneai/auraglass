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
    color: var(--glass-text-primary);
    min-height: 44px;
    backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    transition-property: transform, box-shadow, border-color, background-color !important;
  }

  .liquid-glass-search-field-control > label {
    min-height: 44px;
  }

  .liquid-glass-search-field-control input::placeholder {
    color: var(--glass-text-tertiary);
  }

  .liquid-glass-search-field-dropdown {
    /* LiquidGlassMaterial owns the canonical white-frost fill, hairline
       border, and blur/filter chain; this selector only owns overflow. */
    color: var(--glass-theme-text, var(--glass-text-primary));
    overflow: hidden;
    backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.08) contrast(1.04) !important;
    transition-property: transform, box-shadow, border-color, background-color !important;
  }

  .liquid-glass-search-field-option {
    display: block;
    width: 100%;
    min-height: 44px;
    background: rgba(var(--glass-color-white) / var(--glass-opacity-10));
    color: var(--glass-theme-text, var(--glass-text-primary));
    border: 1px solid transparent;
  }

  .liquid-glass-search-field-option:hover,
  .liquid-glass-search-field-option:focus-visible {
    background: rgba(var(--glass-color-white) / var(--glass-opacity-20));
    border-color: var(--glass-border-hover);
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
          intent="neutral"
          radius="full"
          elevation="level1"
          tintMode="light"
          sheen={0}
          adaptToContent={false}
          enableRefraction={false}
          enableReflection={false}
          adaptToMotion={false}
          enableMicroInteractions={false}
          performanceLevel="efficient"
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
              intent="neutral"
              radius="xl"
              elevation="level1"
              tintMode="light"
              sheen={0}
              adaptToContent={false}
              enableRefraction={false}
              enableReflection={false}
              adaptToMotion={false}
              enableMicroInteractions={false}
              performanceLevel="efficient"
              className="liquid-glass-search-field-dropdown glass-absolute glass-left-0 glass-right-0 glass-top-full glass-z-50 glass-mt-2"
              style={{
                position: "absolute",
                insetInline: 0,
                top: "calc(100% + 8px)",
                zIndex: 50,
              }}
            >
              <div
                role="listbox"
                className="glass-flex glass-flex-col glass-p-2"
                style={{ maxHeight: 280, overflowY: "auto", gap: 8 }}
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
