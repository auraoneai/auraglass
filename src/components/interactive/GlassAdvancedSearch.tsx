"use client";
import { cn } from "../../lib/utilsComprehensive";
import {
  Clock,
  FileText,
  Filter,
  Grid3X3,
  History,
  Image as ImageIcon,
  List,
  MapPin,
  Mic,
  MoreHorizontal,
  Save,
  Search,
  SortAsc,
  SortDesc,
  Star,
  Tag,
  Users,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState, forwardRef } from "react";
import { Motion } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { GlassBadge } from "../data-display";

export interface SearchFilter {
  id: string;
  label: string;
  type: "text" | "select" | "multiselect" | "date" | "range" | "boolean";
  value?: any;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "document" | "image" | "video" | "audio" | "user" | "location" | "tag";
  thumbnail?: string;
  metadata: Record<string, any>;
  relevance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlassAdvancedSearchProps {
  /**
   * Search placeholder text
   */
  placeholder?: string;
  /**
   * Available search filters
   */
  filters?: SearchFilter[];
  /**
   * Search suggestions
   */
  suggestions?: SearchSuggestion[];
  /**
   * Search results
   */
  results?: SearchResult[];
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Enable search history
   */
  enableHistory?: boolean;
  /**
   * Enable saved searches
   */
  enableSavedSearches?: boolean;
  /**
   * Enable advanced filters
   */
  enableAdvancedFilters?: boolean;
  /**
   * Show result statistics
   */
  showStats?: boolean;
  /**
   * Search input handler
   */
  onSearch?: (query: string, filters: Record<string, any>) => void;
  /**
   * Filter change handler
   */
  onFilterChange?: (filters: Record<string, any>) => void;
  /**
   * Result click handler
   */
  onResultClick?: (result: SearchResult) => void;
  /**
   * Save search handler
   */
  onSaveSearch?: (
    name: string,
    query: string,
    filters: Record<string, any>
  ) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Custom ID
   */
  id?: string;
  /**
   * Custom data-testid for testing
   */
  "data-testid"?: string;
  /**
   * ARIA label for accessibility
   */
  "aria-label"?: string;
}

/**
 * GlassAdvancedSearch component
 * A comprehensive search interface with filters, suggestions, and advanced features
 */
export const GlassAdvancedSearch = forwardRef<
  HTMLDivElement,
  GlassAdvancedSearchProps
>(
  (
    {
      placeholder = "Search...",
      filters = [],
      suggestions = [],
      results = [],
      loading = false,
      enableHistory = true,
      enableSavedSearches = true,
      enableAdvancedFilters = true,
      showStats = true,
      onSearch,
      onFilterChange,
      onResultClick,
      onSaveSearch,
      className,
      respectMotionPreference = true,
      id,
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<"relevance" | "date" | "title">(
      "relevance"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [savedSearches, setSavedSearches] = useState<
      Array<{ name: string; query: string; filters: Record<string, any> }>
    >([]);

    const prefersReducedMotion = useReducedMotion();
    const componentId = id || useA11yId("advanced-search");
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Handle search input
    const handleSearchInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setShowSuggestions(value.length > 0);

        // Debounced search
        const timeoutId = setTimeout(() => {
          if (value.trim()) {
            onSearch?.(value, activeFilters);
            // Add to history
            if (enableHistory && !searchHistory.includes(value)) {
              setSearchHistory((prev: any) => [value, ...prev.slice(0, 9)]);
            }
          }
        }, 300);

        return () => clearTimeout(timeoutId);
      },
      [activeFilters, onSearch, enableHistory, searchHistory]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
      (filterId: string, value: any) => {
        const newFilters = { ...activeFilters, [filterId]: value };
        setActiveFilters(newFilters);
        onFilterChange?.(newFilters);

        // Auto-search when filters change
        if (query.trim()) {
          onSearch?.(query, newFilters);
        }
      },
      [activeFilters, query, onFilterChange, onSearch]
    );

    // Handle suggestion click
    const handleSuggestionClick = useCallback(
      (suggestion: SearchSuggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        onSearch?.(suggestion.text, activeFilters);
      },
      [activeFilters, onSearch]
    );

    // Handle result click
    const handleResultClick = useCallback(
      (result: SearchResult) => {
        onResultClick?.(result);
      },
      [onResultClick]
    );

    // Handle save search
    const handleSaveSearch = useCallback(() => {
      const name = prompt("Enter a name for this search:");
      if (name && query.trim()) {
        const search = { name, query, filters: activeFilters };
        setSavedSearches((prev: any) => [search, ...prev]);
        onSaveSearch?.(name, query, activeFilters);
      }
    }, [query, activeFilters, onSaveSearch]);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
      setActiveFilters({});
      onFilterChange?.({});
    }, [onFilterChange]);

    // Get filter value display
    const getFilterValueDisplay = useCallback(
      (filter: SearchFilter) => {
        const value = activeFilters[filter.id];
        if (!value) return null;

        switch (filter.type) {
          case "select":
          case "multiselect":
            if (Array.isArray(value)) {
              return value
                .map(
                  (v: any) =>
                    filter.options?.find((o) => o.value === v)?.label || v
                )
                .join(", ");
            }
            return (
              filter.options?.find((o) => o.value === value)?.label || value
            );
          case "date":
            return new Date(value).toLocaleDateString();
          case "range":
            return `${value.min} - ${value.max}`;
          case "boolean":
            return value ? "Yes" : "No";
          default:
            return String(value);
        }
      },
      [activeFilters]
    );

    // Get result type icon
    const getResultTypeIcon = useCallback((type: SearchResult["type"]) => {
      switch (type) {
        case "document":
          return <FileText className='w-4 h-4' />;
        case "image":
          return <ImageIcon className='w-4 h-4' />;
        case "video":
          return <Video className='w-4 h-4' />;
        case "audio":
          return <Mic className='w-4 h-4' />;
        case "user":
          return <Users className='w-4 h-4' />;
        case "location":
          return <MapPin className='w-4 h-4' />;
        case "tag":
          return <Tag className='w-4 h-4' />;
        default:
          return <FileText className='w-4 h-4' />;
      }
    }, []);

    // Format file size
    const formatFileSize = useCallback((bytes: number) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }, []);

    // Active filter count
    const activeFilterCount = Object.values(activeFilters).filter(
      (v: any) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        (!Array.isArray(v) || v.length > 0)
    ).length;

    return (
      <Motion preset="fadeIn" className="glass-w-full">
        <GlassCard
          ref={ref}
          id={componentId}
          className={cn("overflow-hidden", className)}
          role="search"
          aria-label={ariaLabel || "Advanced search interface"}
          aria-describedby={`${componentId}-description`}
          data-testid={dataTestId}
          {...props}
        >
          <div id={`${componentId}-description`} className='sr-only'>
            Advanced search interface with filters, suggestions, and result
            management
          </div>
          <CardHeader className='pb-3'>
            <div className="glass-flex glass-items-center glass-justify-between">
              <CardTitle className='text-primary glass-text-lg font-semibold glass-flex glass-items-center glass-gap-2'>
                <Search className='w-5 h-5' />
                Advanced Search
              </CardTitle>

              <div className="glass-flex glass-items-center glass-gap-2">
                {enableSavedSearches && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveSearch}
                    disabled={!query.trim()}
                    className="glass-p-2"
                    aria-label="Save search"
                  >
                    <Save className='w-4 h-4' aria-hidden="true" />
                  </GlassButton>
                )}

                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => setShowFilters(!showFilters)}
                  className='glass-p-2 relative'
                  aria-label={showFilters ? "Hide filters" : "Show filters"}
                  aria-pressed={showFilters}
                >
                  <Filter className='w-4 h-4' aria-hidden="true" />
                  {activeFilterCount > 0 && (
                    <span
                      className='absolute glass-top-1 -right-1 w-5 h-5 glass-surface-primary text-primary glass-text-xs glass-radius-full glass-flex glass-items-center glass-justify-center'
                      aria-label={`${activeFilterCount} active filters`}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </GlassButton>
              </div>
            </div>
          </CardHeader>

          <CardContent className='pt-0 glass-auto-gap glass-auto-gap-lg'>
            {/* Search Input */}
            <div className='relative'>
              <div className='relative'>
                <Search className='absolute left-3 glass-top-1/2 transform -translate-y-1/2 text-primary/60 w-4 h-4' />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleSearchInput}
                  placeholder={placeholder}
                  className='glass-w-full pl-10 pr-4 glass-py-3 glass-surface-subtle/10 ring-1 ring-white/10 glass-radius-lg text-primary placeholder-white/50 focus:outline-none focus:ring-white/30 glass-touch-target glass-contrast-guard'
                />
                {query && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    className='absolute right-2 glass-top-1/2 transform -translate-y-1/2 glass-p-1'
                  >
                    <X className='w-4 h-4' />
                  </GlassButton>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Motion
                  preset="slideDown"
                  className='absolute top-full left-0 right-0 glass-mt-2 z-10'
                >
                  <div
                    ref={suggestionsRef}
                    className='glass-surface-dark/80 glass-glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-shadow-xl glass-max-h-64 overflow-y-auto glass-contrast-guard'
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={(e) => handleSuggestionClick(suggestion)}
                        className='glass-w-full text-left glass-px-4 glass-py-3 hover:glass-surface-subtle/10 transition-colors glass-flex glass-items-center glass-gap-3 first:glass-radius-t-lg last:glass-radius-b-lg'
                      >
                        {suggestion.icon && (
                          <span className='text-primary/60'>
                            {suggestion.icon}
                          </span>
                        )}
                        <div className="glass-flex-1">
                          <span className='text-primary'>
                            {suggestion.text}
                          </span>
                          {suggestion.category && (
                            <span className='text-primary/60 glass-text-sm glass-ml-2'>
                              in {suggestion.category}
                            </span>
                          )}
                        </div>
                        {suggestion.count && (
                          <span className='text-primary/60 glass-text-sm'>
                            {suggestion.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </Motion>
              )}
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="glass-flex glass-flex-wrap glass-gap-2">
                {Object.entries(activeFilters).map(([filterId, value]) => {
                  if (
                    !value ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0)
                  )
                    return null;

                  const filter = filters.find((f) => f.id === filterId);
                  const displayValue = getFilterValueDisplay(filter!);

                  return (
                    <GlassBadge
                      key={filterId}
                      variant="secondary"
                      className="glass-flex glass-items-center glass-gap-2"
                    >
                      <span className="glass-text-sm">
                        {filter?.label}: {displayValue}
                      </span>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleFilterChange(filterId, null)}
                        className='glass-p-0 h-auto'
                      >
                        <X className='w-3 h-3' />
                      </GlassButton>
                    </GlassBadge>
                  );
                })}

                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="glass-text-sm"
                >
                  Clear all
                </GlassButton>
              </div>
            )}

            {/* Advanced Filters Panel */}
            {showFilters && enableAdvancedFilters && (
              <Motion
                preset="slideDown"
                className="glass-auto-gap glass-auto-gap-lg glass-p-4 glass-surface-subtle/5 glass-radius-lg"
              >
                <div className='glass-grid glass-grid-cols-1 md:grid-cols-2 lg:grid-cols-3 glass-gap-4'>
                  {filters.map((filter) => (
                    <div
                      key={filter.id}
                      className="glass-auto-gap glass-auto-gap-sm"
                    >
                      <label className='text-primary/80 glass-text-sm font-medium'>
                        {filter.label}
                      </label>

                      {filter.type === "text" && (
                        <input
                          type="text"
                          value={activeFilters[filter.id] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          placeholder={filter.placeholder}
                          className='glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 ring-1 ring-white/10 glass-radius-md text-primary placeholder-white/50 focus:outline-none focus:ring-white/30'
                        />
                      )}

                      {filter.type === "select" && (
                        <select
                          value={activeFilters[filter.id] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          className='glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 ring-1 ring-white/10 glass-radius-md text-primary focus:outline-none focus:ring-white/30'
                        >
                          <option value="">All</option>
                          {filter.options?.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {filter.type === "date" && (
                        <input
                          type="date"
                          value={activeFilters[filter.id] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }
                          className='glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 ring-1 ring-white/10 glass-radius-md text-primary focus:outline-none focus:ring-white/30'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Motion>
            )}

            {/* Search History */}
            {enableHistory && searchHistory.length > 0 && !query && (
              <div className="glass-auto-gap glass-auto-gap-sm">
                <h4 className='text-primary/80 glass-text-sm font-medium glass-flex glass-items-center glass-gap-2'>
                  <History className='w-4 h-4' />
                  Recent Searches
                </h4>
                <div className="glass-flex glass-flex-wrap glass-gap-2">
                  {searchHistory.slice(0, 5).map((search, index) => (
                    <GlassButton
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        setQuery(search);
                        onSearch?.(search, activeFilters);
                      }}
                      className="glass-text-sm"
                    >
                      {search}
                    </GlassButton>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            {query && (
              <div className="glass-flex glass-items-center glass-justify-between">
                <div className="glass-flex glass-items-center glass-gap-4">
                  {showStats && (
                    <span className='text-primary/80 glass-text-sm'>
                      {loading ? "Searching..." : `${results.length} results`}
                    </span>
                  )}

                  <div className="glass-flex glass-items-center glass-gap-2">
                    <span className='text-primary/80 glass-text-sm'>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className='glass-surface-subtle/10 ring-1 ring-white/10 glass-radius-md glass-px-2 glass-py-1 glass-text-sm text-primary focus:outline-none'
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                    </select>

                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="glass-p-1"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className='w-4 h-4' />
                      ) : (
                        <SortDesc className='w-4 h-4' />
                      )}
                    </GlassButton>
                  </div>
                </div>

                <div className="glass-flex glass-items-center glass-gap-2">
                  <GlassButton
                    variant={viewMode === "list" ? "primary" : "ghost"}
                    size="sm"
                    onClick={(e) => setViewMode("list")}
                    className="glass-p-2"
                  >
                    <List className='w-4 h-4' />
                  </GlassButton>

                  <GlassButton
                    variant={viewMode === "grid" ? "primary" : "ghost"}
                    size="sm"
                    onClick={(e) => setViewMode("grid")}
                    className="glass-p-2"
                  >
                    <Grid3X3 className='w-4 h-4' />
                  </GlassButton>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="glass-auto-gap glass-auto-gap-md">
                {loading ? (
                  <div className="glass-flex glass-items-center glass-justify-center glass-py-12">
                    <div className='animate-spin glass-radius-full h-8 w-8 glass-border-2 glass-border-white/20 glass-border-t-white/60'></div>
                  </div>
                ) : results.length === 0 ? (
                  <div className='text-center glass-py-12'>
                    <Search className='w-12 h-12 text-primary/40 glass-mx-auto mb-4' />
                    <p className='text-primary/60'>
                      No results found for "{query}"
                    </p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 glass-gap-4"
                        : "glass-auto-gap glass-auto-gap-md"
                    )}
                  >
                    {results.map((result) => (
                      <Motion
                        key={result.id}
                        preset="fadeIn"
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                          viewMode === "list" &&
                            "glass-p-4 bg-white/5 glass-radius-lg"
                        )}
                        onClick={(e) => handleResultClick(result)}
                      >
                        <div className="glass-flex glass-gap-3">
                          {/* Thumbnail */}
                          {result.thumbnail && (
                            <div className="glass-flex-shrink-0">
                              <img
                                src={result.thumbnail}
                                alt={result.title}
                                className='w-12 h-12 glass-radius-md object-cover'
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="glass-flex-1 glass-min-w-0">
                            <div className="glass-flex glass-items-start glass-justify-between glass-gap-2">
                              <div className="glass-flex-1">
                                <h3 className='text-primary font-medium truncate'>
                                  {result.title}
                                </h3>
                                {result.description && (
                                  <p className='text-primary/70 glass-text-sm glass-mt-1 line-clamp-2'>
                                    {result.description}
                                  </p>
                                )}

                                {/* Metadata */}
                                <div className='glass-flex glass-items-center glass-gap-3 glass-mt-2 glass-text-xs text-primary/60'>
                                  <div className="glass-flex glass-items-center glass-gap-1">
                                    {getResultTypeIcon(result.type)}
                                    <span className='capitalize'>
                                      {result.type}
                                    </span>
                                  </div>

                                  <div className="glass-flex glass-items-center glass-gap-1">
                                    <Clock className='w-3 h-3' />
                                    {result.updatedAt.toLocaleDateString()}
                                  </div>

                                  {result.metadata.size && (
                                    <span>
                                      {formatFileSize(result.metadata.size)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="glass-flex glass-items-center glass-gap-1">
                                <GlassButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle favorite
                                  }}
                                  className="glass-p-1"
                                >
                                  <Star className='w-3 h-3' />
                                </GlassButton>

                                <GlassButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                  className="glass-p-1"
                                >
                                  <MoreHorizontal className='w-3 h-3' />
                                </GlassButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Motion>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </GlassCard>
      </Motion>
    );
  }
);

GlassAdvancedSearch.displayName = "GlassAdvancedSearch";

export default GlassAdvancedSearch;
