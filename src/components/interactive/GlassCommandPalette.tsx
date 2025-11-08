'use client';
import { GlassButton } from "../button/GlassButton";

import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { GlassBadge } from "../data-display/GlassBadge";
import { GlassInput } from "../input/GlassInput";

export interface CommandItem {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Search keywords
   */
  keywords?: string[];
  /**
   * Item description
   */
  description?: string;
  /**
   * Category/group
   */
  category?: string;
  /**
   * Icon component
   */
  icon?: React.ReactNode;
  /**
   * Keyboard shortcut
   */
  shortcut?: string;
  /**
   * Action to execute
   */
  action?: () => void;
  /**
   * Whether item is disabled
   */
  disabled?: boolean;
  /**
   * Custom component to render
   */
  component?: React.ComponentType<{ item: CommandItem; isSelected: boolean }>;
}

export interface CommandGroup {
  /**
   * Group identifier
   */
  id: string;
  /**
   * Group label
   */
  label: string;
  /**
   * Items in group
   */
  items: CommandItem[];
  /**
   * Group priority for sorting
   */
  priority?: number;
}

export interface GlassCommandPaletteProps {
  /**
   * Command items (flat list or grouped)
   */
  items?: CommandItem[];
  /**
   * Grouped command items
   */
  groups?: CommandGroup[];
  /**
   * Whether the palette is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when command is selected
   */
  onSelect?: (item: CommandItem) => void;
  /**
   * Search placeholder text
   */
  placeholder?: string;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Maximum number of results to show
   */
  maxResults?: number;
  /**
   * Enable recent commands tracking
   */
  enableRecents?: boolean;
  /**
   * Recent commands storage key
   */
  recentsKey?: string;
  /**
   * Maximum number of recent items
   */
  maxRecents?: number;
  /**
   * Custom filter function
   */
  filter?: (item: CommandItem, search: string) => boolean;
  /**
   * Custom sort function
   */
  sort?: (a: CommandItem, b: CommandItem) => number;
  /**
   * Enable fuzzy search
   */
  fuzzySearch?: boolean;
  /**
   * Show categories
   */
  showCategories?: boolean;
  /**
   * Show shortcuts
   */
  showShortcuts?: boolean;
  /**
   * Modal backdrop blur
   */
  backdropBlur?: boolean;
  /**
   * Close on escape key
   */
  closeOnEscape?: boolean;
  /**
   * Close on select
   */
  closeOnSelect?: boolean;
  /**
   * Custom loading state
   */
  loading?: boolean;
  /**
   * Loading message
   */
  loadingMessage?: string;
  className?: string;
}

/**
 * GlassCommandPalette component
 * Modal command palette with search, keyboard navigation, and glassmorphism styling
 */
export const GlassCommandPalette = forwardRef<
  HTMLDivElement,
  GlassCommandPaletteProps
>(
  (
    {
      items = [],
      groups = [],
      open = false,
      onOpenChange,
      onSelect,
      placeholder = "Search commands...",
      emptyMessage = "No commands found",
      maxResults = 50,
      enableRecents = true,
      recentsKey = "glass-command-palette-recents",
      maxRecents = 5,
      filter,
      sort,
      fuzzySearch = true,
      showCategories = true,
      showShortcuts = true,
      backdropBlur = true,
      closeOnEscape = true,
      closeOnSelect = true,
      loading = false,
      loadingMessage = "Loading commands...",
      className,
      ...props
    },
    ref
  ) => {
    // State
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentCommands, setRecentCommands] = useState<CommandItem[]>([]);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load recent commands from localStorage
    useEffect(() => {
      if (!enableRecents || typeof window === "undefined") return;

      try {
        const stored = localStorage.getItem(recentsKey);
        if (stored) {
          setRecentCommands(JSON.parse(stored));
        }
      } catch (error) {
        console.warn("Failed to load recent commands:", error);
      }
    }, [enableRecents, recentsKey]);

    // Save recent commands to localStorage
    const saveRecentCommand = (item: CommandItem) => {
      if (!enableRecents || typeof window === "undefined") return;

      try {
        const newRecents = [
          item,
          ...recentCommands.filter((cmd: any) => cmd.id !== item?.id),
        ].slice(0, maxRecents);

        setRecentCommands(newRecents);
        localStorage.setItem(recentsKey, JSON.stringify(newRecents));
      } catch (error) {
        console.warn("Failed to save recent command:", error);
      }
    };

    // Combine items and groups into flat list
    const allItems = useMemo(() => {
      const flatItems = [...items];

      groups.forEach((group: any) => {
        flatItems.push(
          ...group.items.map((item: any) => ({
            ...item,
            category: item?.category || group.label,
          }))
        );
      });

      return flatItems;
    }, [items, groups]);

    // Default filter function
    const defaultFilter = (item: CommandItem, searchTerm: string): boolean => {
      if (!searchTerm) return true;

      const normalizedSearch = searchTerm.toLowerCase();
      const label = item?.label.toLowerCase();
      const description = (item?.description || "").toLowerCase();
      const keywords = (item?.keywords || []).join(" ").toLowerCase();

      if (fuzzySearch) {
        // Simple fuzzy search implementation
        const searchRegex = new RegExp(
          normalizedSearch.split("").join(".*"),
          "i"
        );
        return (
          searchRegex.test(label) ||
          searchRegex.test(description) ||
          searchRegex.test(keywords)
        );
      } else {
        return (
          label.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          keywords.includes(normalizedSearch)
        );
      }
    };

    // Filter and sort items
    const filteredItems = useMemo(() => {
      let result = allItems;

      // Apply search filter
      if (search) {
        result = result.filter((item: any) =>
          filter ? filter(item, search) : defaultFilter(item, search)
        );
      } else if (enableRecents && (recentCommands?.length || 0) > 0) {
        // Show recent commands when no search
        result = recentCommands.filter((recent: any) =>
          allItems.some((item) => item?.id === recent.id)
        );
      }

      // Apply custom sort or default priority sort
      if (sort) {
        result.sort(sort);
      } else {
        // Default sort: exact matches first, then by relevance
        result.sort((a, b) => {
          if (search) {
            const aExact = a.label
              .toLowerCase()
              .startsWith(search.toLowerCase())
              ? 1
              : 0;
            const bExact = b.label
              .toLowerCase()
              .startsWith(search.toLowerCase())
              ? 1
              : 0;
            if (aExact !== bExact) return bExact - aExact;
          }
          return a.label.localeCompare(b.label);
        });
      }

      // Limit results
      return result.slice(0, maxResults);
    }, [
      allItems,
      search,
      filter,
      sort,
      maxResults,
      fuzzySearch,
      enableRecents,
      recentCommands,
    ]);

    // Group filtered items by category
    const groupedItems = useMemo(() => {
      if (!showCategories) return { All: filteredItems };

      const grouped = filteredItems.reduce(
        (acc, item) => {
          const category = item?.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, CommandItem[]>
      );

      return grouped;
    }, [filteredItems, showCategories]);

    // Handle item selection
    const handleSelect = (item: CommandItem) => {
      if (item?.disabled) return;

      // Save to recents
      saveRecentCommand(item);

      // Execute action
      item?.action?.();
      onSelect?.(item);

      // Close palette if configured
      if (closeOnSelect) {
        onOpenChange?.(false);
      }

      // Reset search
      setSearch("");
      setSelectedIndex(0);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (closeOnEscape) {
            e.preventDefault();
            onOpenChange?.(false);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev: any) =>
            prev < (filteredItems?.length || 0) - 1 ? prev + 1 : prev
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev: any) => (prev > 0 ? prev - 1 : prev));
          break;

        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex]);
          }
          break;

        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;

        case "End":
          e.preventDefault();
          setSelectedIndex((filteredItems?.length || 0) - 1);
          break;
      }
    };

    // Reset selection when search changes
    useEffect(() => {
      setSelectedIndex(0);
    }, [search]);

    // Focus input when opened
    useEffect(() => {
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    }, [open]);

    // Scroll selected item into view
    useEffect(() => {
      if (selectedIndex >= 0 && listRef.current) {
        const selectedElement = listRef.current.children?.[
          selectedIndex
        ] as HTMLElement;
        if (selectedElement) {
          selectedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [selectedIndex]);

    if (!open) return null;

    return (
      <div
        data-glass-component
        className="fixed inset-0 z-50 glass-flex glass-items-start glass-justify-center pt-[10vh]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onOpenChange?.(false);
          }
        }}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/20",
            backdropBlur && "glass-backdrop-blur-md"
          )}
        />

        {/* Command Palette */}
        <Motion
          preset="scaleIn"
          duration={200}
          className="relative glass-w-full max-w-2xl glass-mx-4"
        >
          <OptimizedGlass
            ref={ref}
            intent="neutral"
            elevation="level4"
            intensity="strong"
            depth={3}
            tint="neutral"
            border="glow"
            animation="float"
            performanceMode="high"
            className={cn(
              "w-full max-h-[80vh] overflow-hidden glass-radius-xl",
              className
            )}
            onKeyDown={handleKeyDown}
            {...props}
          >
            {/* Search Input */}
            <div className="glass-p-4 glass-border-b glass-border-glass-border/10">
              <GlassInput
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                size="lg"
                leftIcon={
                  <svg
                    className="w-5 h-5"
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
                  search && (
                    <GlassButton
                      type="button"
                      className="glass-p-1 glass-radius-md hover:glass-surface-subtle transition-colors"
                      onClick={(e) => setSearch("")}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </GlassButton>
                  )
                }
                className="glass-border-0 bg-transparent focus:ring-0"
              />
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto overscroll-contain"
              role="listbox"
            >
              {loading ? (
                <div className="glass-flex glass-items-center glass-justify-center glass-py-8">
                  <div className="glass-flex glass-items-center glass-gap-3">
                    <div className="w-5 h-5 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full animate-spin" />
                    <span className="glass-text-secondary">
                      {loadingMessage}
                    </span>
                  </div>
                </div>
              ) : (filteredItems?.length || 0) === 0 ? (
                <div className="glass-py-8 text-center glass-text-secondary">
                  {emptyMessage}
                </div>
              ) : (
                Object.entries(groupedItems).map(
                  ([category, categoryItems]) => (
                    <div key={category}>
                      {showCategories &&
                        Object.keys(groupedItems).length > 1 && (
                          <div className="glass-px-4 glass-py-2 glass-text-xs font-medium glass-text-secondary glass-surface-subtle glass-border-b glass-border-glass-border/5">
                            {search ? "Results" : category}
                          </div>
                        )}

                      {categoryItems.map((item, index) => {
                        const globalIndex = filteredItems.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;

                        if (item?.component) {
                          const Component = item?.component;
                          return (
                            <Component
                              key={item?.id}
                              item={item}
                              isSelected={isSelected}
                            />
                          );
                        }

                        return (
                          <GlassButton
                            key={item?.id}
                            type="button"
                            className={cn(
                              "w-full flex items-center glass-gap-3 glass-px-4 glass-py-3 text-left transition-colors",
                              "hover:bg-muted/20 focus:bg-muted/20 focus:outline-none",
                              {
                                "bg-primary/10 border-l-2 border-primary":
                                  isSelected,
                                "opacity-50 cursor-not-allowed": item?.disabled,
                              }
                            )}
                            onClick={(e) => handleSelect(item)}
                            disabled={item?.disabled}
                            role="option"
                            aria-selected={isSelected}
                          >
                            {/* Icon */}
                            {item?.icon && (
                              <span className="glass-flex-shrink-0 glass-text-secondary">
                                {item?.icon}
                              </span>
                            )}

                            {/* Content */}
                            <div className="glass-flex-1 glass-min-w-0">
                              <div className="font-medium text-primary">
                                {item?.label}
                              </div>
                              {item?.description && (
                                <div className="glass-text-sm glass-text-secondary truncate">
                                  {item?.description}
                                </div>
                              )}
                            </div>

                            {/* Shortcut */}
                            {showShortcuts && item?.shortcut && (
                              <GlassBadge variant="secondary" size="sm">
                                {item?.shortcut}
                              </GlassBadge>
                            )}
                          </GlassButton>
                        );
                      })}
                    </div>
                  )
                )
              )}
            </div>

            {/* Footer */}
            {(filteredItems?.length || 0) > 0 && (
              <div className="glass-px-4 glass-py-2 glass-text-xs glass-text-secondary glass-surface-subtle glass-border-t glass-border-glass-border/5">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span>
                    {filteredItems?.length || 0}{" "}
                    {(filteredItems?.length || 0) === 1 ? "result" : "results"}
                  </span>
                  <div className="glass-flex glass-items-center glass-gap-4">
                    <span className="glass-flex glass-items-center glass-gap-1">
                      <GlassBadge variant="secondary" size="sm">
                        ↑↓
                      </GlassBadge>
                      Navigate
                    </span>
                    <span className="glass-flex glass-items-center glass-gap-1">
                      <GlassBadge variant="secondary" size="sm">
                        ↵
                      </GlassBadge>
                      Select
                    </span>
                    <span className="glass-flex glass-items-center glass-gap-1">
                      <GlassBadge variant="secondary" size="sm">
                        Esc
                      </GlassBadge>
                      Close
                    </span>
                  </div>
                </div>
              </div>
            )}
          </OptimizedGlass>
        </Motion>
      </div>
    );
  }
);

GlassCommandPalette.displayName = "GlassCommandPalette";

// Export types - using different names to avoid conflicts
export type {
  CommandGroup as GlassCommandGroup,
  CommandItem as GlassCommandItem,
};