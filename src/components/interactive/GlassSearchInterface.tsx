"use client";
import { GlassButton } from "../button/GlassButton";
import { GlassInput } from "../input/GlassInput";

import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { FocusTrap } from "../../primitives/focus/FocusTrap";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { GlassBadge } from "../data-display/GlassBadge";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  highlighted?: {
    title?: string;
    description?: string;
  };
}

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface SearchCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface GlassSearchInterfaceProps {
  /**
   * Search placeholder text
   */
  placeholder?: string;
  /**
   * Search value
   */
  value?: string;
  /**
   * Search change handler
   */
  onChange?: (value: string) => void;
  /**
   * Search submit handler
   */
  onSearch?: (query: string, filters: Record<string, string[]>) => void;
  /**
   * Search results
   */
  results?: SearchResult[];
  /**
   * Search suggestions
   */
  suggestions?: string[];
  /**
   * Recent searches
   */
  recentSearches?: string[];
  /**
   * Available filters
   */
  filters?: Record<string, SearchFilter[]>;
  /**
   * Selected filters
   */
  selectedFilters?: Record<string, string[]>;
  /**
   * Filter change handler
   */
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  /**
   * Search categories
   */
  categories?: SearchCategory[];
  /**
   * Active category
   */
  activeCategory?: string;
  /**
   * Category change handler
   */
  onCategoryChange?: (categoryId: string) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Result click handler
   */
  onResultClick?: (result: SearchResult) => void;
  /**
   * Custom result renderer
   */
  renderResult?: (result: SearchResult) => React.ReactNode;
  /**
   * Search interface variant
   */
  variant?: "default" | "modal" | "inline" | "compact";
  /**
   * Whether to show filters
   */
  showFilters?: boolean;
  /**
   * Whether to show categories
   */
  showCategories?: boolean;
  /**
   * Maximum results to show
   */
  maxResults?: number;
  /**
   * Debounce delay for search
   */
  debounceDelay?: number;
  className?: string;
}

/**
 * GlassSearchInterface component
 * Advanced search interface with filters, categories, and results
 */
export const GlassSearchInterface = forwardRef<
  HTMLDivElement,
  GlassSearchInterfaceProps
>(
  (
    {
      placeholder = "Search...",
      value = "",
      onChange,
      onSearch,
      results = [],
      suggestions = [],
      recentSearches = [],
      filters = {},
      selectedFilters = {},
      onFiltersChange,
      categories = [],
      activeCategory,
      onCategoryChange,
      loading = false,
      emptyMessage = "No results found",
      onResultClick,
      renderResult,
      variant = "default",
      showFilters = true,
      showCategories = true,
      maxResults = 10,
      debounceDelay = 300,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const displayResults = results.slice(0, maxResults);
    const hasActiveFilters = Object.values(selectedFilters).some(
      (arr) => arr.length > 0
    );

    // Debounced search
    const debouncedSearch = useCallback(
      (query: string) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          onSearch?.(query, selectedFilters);
        }, debounceDelay);
      },
      [onSearch, selectedFilters, debounceDelay]
    );

    // Handle input change
    const handleInputChange = (newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);
      setIsOpen(true);
      setFocusedIndex(-1);

      if (newValue.trim()) {
        debouncedSearch(newValue);
      }
    };

    // Handle filter change
    const handleFilterChange = (
      filterId: string,
      optionValue: string,
      checked: boolean
    ) => {
      const currentFilters = { ...selectedFilters };

      if (!currentFilters[filterId]) {
        currentFilters[filterId] = [];
      }

      if (checked) {
        currentFilters[filterId] = [...currentFilters[filterId], optionValue];
      } else {
        currentFilters[filterId] = currentFilters[filterId].filter(
          (v: any) => v !== optionValue
        );
      }

      onFiltersChange?.(currentFilters);

      if (internalValue.trim()) {
        onSearch?.(internalValue, currentFilters);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems =
        suggestions.length + displayResults.length + recentSearches.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev: any) => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev: any) => (prev - 1 + totalItems) % totalItems);
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleItemSelect(focusedIndex);
          } else if (internalValue.trim()) {
            onSearch?.(internalValue, selectedFilters);
            setIsOpen(false);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    // Handle item selection
    const handleItemSelect = (index: number) => {
      let currentIndex = 0;

      // Check suggestions
      if (index < suggestions.length) {
        const suggestion = suggestions[index];
        setInternalValue(suggestion);
        onChange?.(suggestion);
        onSearch?.(suggestion, selectedFilters);
        setIsOpen(false);
        return;
      }
      currentIndex += suggestions.length;

      // Check recent searches
      if (index < currentIndex + recentSearches.length) {
        const recent = recentSearches[index - currentIndex];
        setInternalValue(recent);
        onChange?.(recent);
        onSearch?.(recent, selectedFilters);
        setIsOpen(false);
        return;
      }
      currentIndex += recentSearches.length;

      // Check results
      if (index < currentIndex + displayResults.length) {
        const result = displayResults[index - currentIndex];
        onResultClick?.(result);
        setIsOpen(false);
        return;
      }
    };

    // Clear filters
    const clearFilters = () => {
      onFiltersChange?.({});
      if (internalValue.trim()) {
        onSearch?.(internalValue, {});
      }
    };

    // Clear search
    const clearSearch = () => {
      setInternalValue("");
      onChange?.("");
      setIsOpen(false);
    };

    const variantClasses = {
      default: "max-w-2xl",
      modal: "w-full max-w-4xl",
      inline: "w-full",
      compact: "max-w-md",
    };

    return (
      <div
        data-glass-component
        ref={ref}
        className={cn("relative", variantClasses[variant], className)}
        {...props}
      >
        {/* Categories */}
        {showCategories && categories.length > 0 && (
          <div className="glass-flex glass-items-center glass-gap-2 glass-mb-4 glass-overflow-x-auto">
            <GlassButton
              variant={!activeCategory ? "primary" : "ghost"}
              size="sm"
              onClick={(e) => onCategoryChange?.("")}
            >
              All
            </GlassButton>
            {categories.map((category) => (
              <GlassButton
                key={category.id}
                variant={activeCategory === category.id ? "primary" : "ghost"}
                size="sm"
                leftIcon={category.icon}
                onClick={(e) => onCategoryChange?.(category.id)}
              >
                {category.label}
                {category.count && (
                  <GlassBadge
                    variant="outline"
                    size="xs"
                    className="glass-ml-2"
                  >
                    {category.count}
                  </GlassBadge>
                )}
              </GlassButton>
            ))}
          </div>
        )}

        {/* Search GlassInput */}
        <div className="glass-relative">
          <GlassInput
            ref={searchRef}
            value={internalValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            leftIcon={
              <svg
                className="glass-w-4 glass-h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            rightIcon={
              loading ? (
                <div className="glass-w-4 glass-h-4 glass-border-2 glass-border-current glass-border-t-transparent glass-radius-full glass-animate-spin" />
              ) : undefined
            }
            clearable
            onClear={clearSearch}
            fullWidth
          />

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="glass-absolute glass--right-12 glass-top-1/2 glass--translate-y-1-2">
              <GlassBadge
                variant="default"
                size="xs"
                onClick={clearFilters}
                className="glass-cursor-pointer"
              >
                {Object.values(selectedFilters).flat().length} filters
              </GlassBadge>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <Motion
            preset="slideDown"
            className="glass-absolute glass-top-full glass-left-0 glass-right-0 glass-mt-2 glass-z-50"
          >
            <OptimizedGlass
              intent="neutral"
              elevation="level2"
              intensity="medium"
              depth={2}
              tint="neutral"
              border="subtle"
              animation="none"
              performanceMode="medium"
              className="glass-border glass-border-glass-border/20 glass-max-h-96 glass-overflow-hidden"
            >
              <FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
                <div
                  ref={resultsRef}
                  className="glass-overflow-y-auto glass-max-h-96"
                >
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="glass-p-2 glass-border-b glass-border-glass-border/20">
                      <h4 className="glass-px-3 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                        Suggestions
                      </h4>
                      {suggestions.map((suggestion, index) => (
                        <GlassButton
                          key={suggestion}
                          className={cn(
                            "w-full flex items-center glass-gap-3 glass-px-3 glass-py-2 glass-radius-md text-left",
                            "hover:bg-muted/50 transition-colors",
                            focusedIndex === index && "bg-muted/50"
                          )}
                          onClick={(e) => handleItemSelect(index)}
                        >
                          <svg
                            className="glass-w-4 glass-h-4 glass-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <span>{suggestion}</span>
                        </GlassButton>
                      ))}
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="glass-p-2 glass-border-b glass-border-glass-border/20">
                      <h4 className="glass-px-3 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                        Recent Searches
                      </h4>
                      {recentSearches.map((recent, index) => {
                        const globalIndex = suggestions.length + index;
                        return (
                          <GlassButton
                            key={recent}
                            className={cn(
                              "w-full flex items-center glass-gap-3 glass-px-3 glass-py-2 glass-radius-md text-left",
                              "hover:bg-muted/50 transition-colors",
                              focusedIndex === globalIndex && "bg-muted/50"
                            )}
                            onClick={(e) => handleItemSelect(globalIndex)}
                          >
                            <svg
                              className="glass-w-4 glass-h-4 glass-text-secondary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{recent}</span>
                          </GlassButton>
                        );
                      })}
                    </div>
                  )}

                  {/* Search Results */}
                  {displayResults.length > 0 ? (
                    <div className="glass-p-2">
                      <h4 className="glass-px-3 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                        Results ({results.length})
                      </h4>
                      {displayResults.map((result, index) => {
                        const globalIndex =
                          suggestions.length + recentSearches.length + index;
                        return (
                          <GlassButton
                            key={result.id}
                            className={cn(
                              "w-full flex items-start glass-gap-3 glass-px-3 glass-py-3 glass-radius-md text-left",
                              "hover:bg-muted/50 transition-colors",
                              focusedIndex === globalIndex && "bg-muted/50"
                            )}
                            onClick={(e) => handleItemSelect(globalIndex)}
                          >
                            {renderResult ? (
                              renderResult(result)
                            ) : (
                              <>
                                <div className="glass-w-8 glass-h-8 glass-radius-md glass-surface-primary/10 glass-flex glass-items-center glass-justify-center glass-flex-shrink-0 glass-mt-0-5">
                                  <svg
                                    className="glass-w-4 glass-h-4 glass-text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <div className="glass-flex-1 glass-min-glass-w-0">
                                  <h5 className="glass-font-medium glass-text-primary">
                                    {result.highlighted?.title || result.title}
                                  </h5>
                                  {result.description && (
                                    <p className="glass-text-sm glass-text-secondary glass-mt-1 glass-line-clamp-2">
                                      {result.highlighted?.description ||
                                        result.description}
                                    </p>
                                  )}
                                  {result.category && (
                                    <GlassBadge
                                      variant="outline"
                                      size="xs"
                                      className="glass-mt-2"
                                    >
                                      {result.category}
                                    </GlassBadge>
                                  )}
                                </div>
                              </>
                            )}
                          </GlassButton>
                        );
                      })}

                      {results.length > maxResults && (
                        <div className="glass-px-3 glass-py-2 glass-text-center">
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                              onSearch?.(internalValue, selectedFilters)
                            }
                          >
                            View all {results.length} results
                          </GlassButton>
                        </div>
                      )}
                    </div>
                  ) : internalValue.trim() && !loading ? (
                    <div className="glass-p-8 glass-text-center">
                      <div className="glass-w-12 glass-h-12 glass-radius-full glass-surface-subtle glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                        <svg
                          className="glass-w-6 glass-h-6 glass-text-secondary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <p className="glass-text-secondary">{emptyMessage}</p>
                    </div>
                  ) : null}
                </div>
              </FocusTrap>
            </OptimizedGlass>
          </Motion>
        )}

        {/* Filters Sidebar */}
        {showFilters &&
          Object.keys(filters).length > 0 &&
          variant !== "compact" && (
            <OptimizedGlass
              intent="neutral"
              elevation={"level1"}
              intensity="medium"
              depth={2}
              tint="neutral"
              border="subtle"
              animation="none"
              performanceMode="medium"
              className="glass-mt-4 glass-p-4 glass-border glass-border-glass-border/20"
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
                <h3 className="glass-font-medium glass-text-primary">
                  Filters
                </h3>
                {hasActiveFilters && (
                  <GlassButton variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </GlassButton>
                )}
              </div>

              <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-4">
                {Object.entries(filters).map(([filterId, options]) => (
                  <div key={filterId}>
                    <h4 className="glass-font-medium glass-text-sm glass-text-primary glass-mb-2">
                      {filterId.charAt(0).toUpperCase() + filterId.slice(1)}
                    </h4>
                    <div className="glass-gap-2">
                      {options.map((option) => (
                        <label
                          key={option.id}
                          className="glass-flex glass-items-center glass-gap-2 glass-cursor-pointer"
                        >
                          <GlassInput
                            type="checkbox"
                            checked={
                              selectedFilters[filterId]?.includes(
                                option.value
                              ) || false
                            }
                            onChange={(e) =>
                              handleFilterChange(
                                filterId,
                                option.value,
                                e.target.checked
                              )
                            }
                            className="glass-radius-md glass-border-glass-border glass-focus-ring-primary"
                          />
                          <span className="glass-text-sm glass-text-primary glass-flex-1">
                            {option.label}
                          </span>
                          {option.count && (
                            <span className="glass-text-xs glass-text-secondary">
                              {option.count}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </OptimizedGlass>
          )}
      </div>
    );
  }
);

GlassSearchInterface.displayName = "GlassSearchInterface";
