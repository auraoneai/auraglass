"use client";
import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, PanInfo } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface MasonryItem {
  id: string;
  content: React.ReactNode;
  height?: number;
  aspectRatio?: number;
  priority?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface MasonryConfig {
  columns: number | "auto";
  gap: number;
  minItemWidth: number;
  maxItemWidth?: number;
  itemPadding: number;
  autoResize: boolean;
  animationDelay: number;
  breakpoints: { [key: number]: number };
}

export interface GlassMasonryGridProps {
  items: MasonryItem[];
  config?: Partial<MasonryConfig>;
  showControls?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
  enableVirtualization?: boolean;
  enableInfiniteScroll?: boolean;
  enableDragReorder?: boolean;
  enableSearch?: boolean;
  filterBy?: string;
  sortBy?: "id" | "height" | "priority" | "category";
  sortOrder?: "asc" | "desc";
  loadingItems?: number;
  onItemClick?: (item: MasonryItem, index: number) => void;
  onItemsReorder?: (items: MasonryItem[]) => void;
  onLoadMore?: () => void;
  onFilterChange?: (filter: string) => void;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  className?: string;
}

const defaultConfig: MasonryConfig = {
  columns: "auto",
  gap: 16,
  minItemWidth: 200,
  maxItemWidth: 400,
  itemPadding: 12,
  autoResize: true,
  animationDelay: 0.05,
  breakpoints: {
    1200: 4,
    900: 3,
    600: 2,
    400: 1,
  },
};

interface LayoutItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
  computedHeight: number;
  column: number;
}

export const GlassMasonryGrid = forwardRef<
  HTMLDivElement,
  GlassMasonryGridProps
>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      items,
      config = {},
      showControls = true,
      showFilters = true,
      showStats = true,
      enableVirtualization = false,
      enableInfiniteScroll = false,
      enableDragReorder = false,
      enableSearch = false,
      filterBy = "",
      sortBy = "id",
      sortOrder = "asc",
      loadingItems = 0,
      onItemClick,
      onItemsReorder,
      onLoadMore,
      onFilterChange,
      compact = false,
      contained = false,
      maxHeight,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
    const [containerDimensions, setContainerDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [activeFilter, setActiveFilter] = useState(filterBy);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSort, setCurrentSort] = useState({
      by: sortBy,
      order: sortOrder,
    });
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [visibleItems, setVisibleItems] = useState<LayoutItem[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<{ [key: string]: HTMLDivElement }>({});
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const intersectionObserver = useRef<IntersectionObserver | null>(null);

    const [masonryConfig] = useState<MasonryConfig>({
      ...defaultConfig,
      ...config,
    });

    const id = useA11yId("glass-masonry-grid");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();
    const effectiveShowControls = compact ? false : showControls;
    const effectiveShowFilters = compact ? false : showFilters;
    const effectiveShowStats = compact ? false : showStats;
    const effectiveEnableSearch = compact ? false : enableSearch;
    const boundedHeight =
      maxHeight ??
      (compact || contained ? 240 : "min(760px, calc(100vh - 64px))");

    // Calculate optimal number of columns
    const calculateColumns = useCallback(
      (containerWidth: number): number => {
        if (masonryConfig.columns !== "auto") {
          return masonryConfig.columns as number;
        }

        // Use breakpoints to determine columns
        const sortedBreakpoints = Object.entries(masonryConfig.breakpoints)
          .map(([width, cols]) => [parseInt(width), cols] as [number, number])
          .sort((a, b) => b[0] - a[0]);

        for (const [breakpoint, columns] of sortedBreakpoints) {
          if (containerWidth >= breakpoint) {
            return columns;
          }
        }

        // Fallback calculation
        const availableWidth = containerWidth - masonryConfig.gap * 2;
        const itemWidthWithGap = masonryConfig.minItemWidth + masonryConfig.gap;
        return Math.max(1, Math.floor(availableWidth / itemWidthWithGap));
      },
      [masonryConfig]
    );

    // Filter and sort items
    const processItems = useCallback(
      (itemsToProcess: MasonryItem[]): MasonryItem[] => {
        let processed = [...itemsToProcess];

        // Apply search filter
        if (searchQuery.trim()) {
          processed = processed.filter((item: any) => {
            const searchText = searchQuery.toLowerCase();
            return (
              item.id.toLowerCase().includes(searchText) ||
              item.category?.toLowerCase().includes(searchText) ||
              JSON.stringify(item.metadata).toLowerCase().includes(searchText)
            );
          });
        }

        // Apply category filter
        if (activeFilter && activeFilter !== "all") {
          processed = processed.filter(
            (item: any) => item.category === activeFilter
          );
        }

        // Sort items
        processed.sort((a, b) => {
          let aVal: any, bVal: any;

          switch (currentSort.by) {
            case "height":
              aVal = a.height || 200;
              bVal = b.height || 200;
              break;
            case "priority":
              aVal = a.priority || 0;
              bVal = b.priority || 0;
              break;
            case "category":
              aVal = a.category || "";
              bVal = b.category || "";
              break;
            default:
              aVal = a.id;
              bVal = b.id;
          }

          if (currentSort.order === "desc") {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });

        return processed;
      },
      [searchQuery, activeFilter, currentSort]
    );

    // Calculate masonry layout
    const calculateLayout = useCallback(
      (processedItems: MasonryItem[], containerWidth: number): LayoutItem[] => {
        if (!containerWidth || processedItems.length === 0) return [];

        const numColumns = calculateColumns(containerWidth);
        const availableWidth =
          containerWidth - masonryConfig.gap * (numColumns + 1);
        const itemWidth = Math.min(
          masonryConfig.maxItemWidth || Infinity,
          Math.max(masonryConfig.minItemWidth, availableWidth / numColumns)
        );

        const columnHeights = new Array(numColumns).fill(0);
        const layoutItems: LayoutItem[] = [];

        processedItems.forEach((item, index) => {
          // Find shortest column
          const shortestColumn = columnHeights.indexOf(
            Math.min(...columnHeights)
          );

          // Calculate item dimensions
          let itemHeight = item.height || 200;
          if (item.aspectRatio) {
            itemHeight = itemWidth / item.aspectRatio;
          }

          // Position calculation
          const x =
            masonryConfig.gap +
            shortestColumn * (itemWidth + masonryConfig.gap);
          const y =
            columnHeights[shortestColumn] +
            (columnHeights[shortestColumn] === 0
              ? masonryConfig.gap
              : masonryConfig.gap);

          const layoutItem: LayoutItem = {
            ...item,
            x,
            y,
            width: itemWidth,
            computedHeight: itemHeight,
            column: shortestColumn,
          };

          layoutItems.push(layoutItem);
          columnHeights[shortestColumn] += itemHeight + masonryConfig.gap;
        });

        return layoutItems;
      },
      [calculateColumns, masonryConfig]
    );

    // Update layout when items or container changes
    const updateLayout = useCallback(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const processedItems = processItems(items);
      const newLayoutItems = calculateLayout(processedItems, containerWidth);

      setLayoutItems(newLayoutItems);
      const computedHeight = newLayoutItems.length
        ? Math.max(
            ...newLayoutItems.map((item: any) => item.y + item.computedHeight)
          ) + masonryConfig.gap
        : 0;
      setContainerDimensions({
        width: containerWidth,
        height: computedHeight,
      });

      // Update visible items for virtualization
      if (enableVirtualization) {
        const container = containerRef.current;
        const scrollTop = container.scrollTop;
        const viewportHeight = container.offsetHeight;
        const buffer = viewportHeight * 0.5;

        const visible = newLayoutItems.filter((item: any) => {
          const itemTop = item.y;
          const itemBottom = item.y + item.computedHeight;
          return (
            itemBottom >= scrollTop - buffer &&
            itemTop <= scrollTop + viewportHeight + buffer
          );
        });

        setVisibleItems(visible);
      } else {
        setVisibleItems(newLayoutItems);
      }
    }, [
      items,
      processItems,
      calculateLayout,
      masonryConfig,
      enableVirtualization,
    ]);

    // Handle resize
    useEffect(() => {
      if (!masonryConfig.autoResize) return;

      const handleResize = () => {
        updateLayout();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [updateLayout, masonryConfig.autoResize]);

    // Setup resize observer
    useEffect(() => {
      if (!containerRef.current) return;

      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            updateLayout();
          }
        }
      });

      resizeObserver.current.observe(containerRef.current);

      return () => {
        resizeObserver.current?.disconnect();
      };
    }, [updateLayout]);

    // Setup infinite scroll
    useEffect(() => {
      if (!enableInfiniteScroll || !containerRef.current) return;

      intersectionObserver.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loadingMore) {
              setLoadingMore(true);
              onLoadMore?.();
              setTimeout(() => setLoadingMore(false), 1000);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Create sentinel element
      const sentinel = document.createElement("div");
      sentinel.className = "masonry-sentinel";
      sentinel.style.height = "1px";
      containerRef.current.appendChild(sentinel);
      intersectionObserver.current.observe(sentinel);

      return () => {
        intersectionObserver.current?.disconnect();
      };
    }, [enableInfiniteScroll, loadingMore, onLoadMore]);

    // Initial layout calculation
    useEffect(() => {
      updateLayout();
    }, [updateLayout]);

    // Handle drag and drop
    const handleDragStart = useCallback(
      (event: MouseEvent | TouchEvent | PointerEvent, itemId: string) => {
        if (!enableDragReorder) return;

        setDraggedItem(itemId);
        play("pickup");
      },
      [enableDragReorder, play]
    );

    const handleDrop = useCallback(
      (event: MouseEvent | TouchEvent | PointerEvent, targetItemId: string) => {
        if (!enableDragReorder || !draggedItem) return;

        const newItems = [...items];
        const draggedIndex = newItems.findIndex(
          (item) => item.id === draggedItem
        );
        const targetIndex = newItems.findIndex(
          (item) => item.id === targetItemId
        );

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedItemObj] = newItems.splice(draggedIndex, 1);
          newItems.splice(targetIndex, 0, draggedItemObj);

          onItemsReorder?.(newItems);
          play("place");
        }

        setDraggedItem(null);
      },
      [enableDragReorder, draggedItem, items, onItemsReorder, play]
    );

    // Get unique categories for filtering
    const categories = Array.from(
      new Set(items.map((item: any) => item.category).filter(Boolean))
    );

    const FilterControls = () => (
      <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-mb-6">
        {enableSearch && (
          <div className="glass-flex-1 glass-min-glass-w-48">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-placeholder-white-opacity-50 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>
        )}

        {showFilters && categories.length > 0 && (
          <div className="glass-flex glass-items-center glass-space-x-2">
            <span className="glass-text-sm glass-text-primary-opacity-70">
              Filter:
            </span>
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                onFilterChange?.(e.target.value);
              }}
              className="glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Filter items by category"
            >
              <option value="">All</option>
              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="glass-flex glass-items-center glass-space-x-2">
          <span className="glass-text-sm glass-text-primary-opacity-70">
            Sort:
          </span>
          <select
            value={currentSort.by}
            onChange={(e) =>
              setCurrentSort((prev: any) => ({
                ...prev,
                by: e.target.value as any,
              }))
            }
            className="glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
            aria-label="Sort items"
          >
            <option value="id">ID</option>
            <option value="height">Height</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>

          <button
            onClick={() =>
              setCurrentSort((prev: any) => ({
                ...prev,
                order: prev.order === "asc" ? "desc" : "asc",
              }))
            }
            className="glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius glass-text-primary-glass-opacity-90 glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          >
            {currentSort.order === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    );

    const StatsPanel = () => {
      const processedItems = processItems(items);
      const totalHeight = Math.max(
        ...layoutItems.map((item: any) => item.y + item.computedHeight)
      );
      const avgHeight =
        layoutItems.length > 0 ? totalHeight / layoutItems.length : 0;

      return (
        <div
          className={`
          mb-4 p-3 rounded-lg border border-white/10
          ${createGlassStyle({ blur: "sm", opacity: 0.6 }).background}
        `}
        >
          <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm">
            <div>
              <span className="glass-text-primary-glass-opacity-60">
                Total Items:
              </span>
              <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                {items.length}
              </div>
            </div>
            <div>
              <span className="glass-text-primary-glass-opacity-60">
                Visible:
              </span>
              <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                {processedItems.length}
              </div>
            </div>
            <div>
              <span className="glass-text-primary-glass-opacity-60">
                Columns:
              </span>
              <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                {containerDimensions.width
                  ? calculateColumns(containerDimensions.width)
                  : "-"}
              </div>
            </div>
            <div>
              <span className="glass-text-primary-glass-opacity-60">
                Avg Height:
              </span>
              <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                {avgHeight.toFixed(0)}px
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={cn(
          "glass-masonry-grid",
          compact ? "glass-p-3" : "p-6",
          className
        )}
        style={{
          width: compact ? "100%" : "min(1120px, calc(100vw - 48px))",
          maxWidth: "100%",
          maxHeight:
            typeof boundedHeight === "number"
              ? `${boundedHeight}px`
              : boundedHeight,
          overflowX: "auto",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
        {...props}
      >
        {/* Header */}
        {!compact && (
          <div className="glass-flex glass-items-center glass-justify-between glass-mb-6">
            <div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90">
                Masonry Grid
              </h3>
              <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                Pinterest-style dynamic layout system
              </p>
            </div>

            {enableVirtualization && (
              <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                <div className="glass-w-2 glass-h-2 glass-surface-blue glass-radius-full" />
                <span className="glass-text-xs">Virtualized</span>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {effectiveShowStats && <StatsPanel />}

        {/* Controls */}
        {(effectiveShowControls ||
          effectiveShowFilters ||
          effectiveEnableSearch) && <FilterControls />}

        {/* Masonry Container */}
        <div
          ref={containerRef}
          className="glass-relative glass-overflow-auto"
          style={{
            height: compact ? 180 : enableVirtualization ? "600px" : "auto",
            maxHeight: compact ? 180 : enableVirtualization ? "600px" : "none",
            minHeight: compact ? 160 : 200,
          }}
        >
          <div
            className="glass-relative"
            style={{
              width: "100%",
              height: containerDimensions.height || "auto",
              minHeight: containerDimensions.height || 200,
            }}
          >
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current[item.id] = el;
                }}
                className={`
                  absolute cursor-pointer transition-all duration-200
                  ${draggedItem === item.id ? "opacity-50 scale-95" : "opacity-100 scale-100"}
                  ${enableDragReorder ? "glass-hover-scale-105" : ""}
                `}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.computedHeight,
                  zIndex: draggedItem === item.id ? 1000 : 1,
                }}
                initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        delay: shouldAnimate
                          ? index * masonryConfig.animationDelay
                          : 0,
                        duration: 0.3,
                      }
                }
                drag={enableDragReorder}
                onDragStart={(
                  event: MouseEvent | TouchEvent | PointerEvent,
                  info: PanInfo
                ) => handleDragStart(event as any, item.id)}
                onDragEnd={(
                  event: MouseEvent | TouchEvent | PointerEvent,
                  info: PanInfo
                ) => handleDrop(event as any, item.id)}
                onClick={() => {
                  onItemClick?.(item, index);
                  play("select");
                }}
              >
                <OptimizedGlass
                  variant="frosted"
                  className="glass-w-full glass-h-full hover:glass-surface-subtle/10 glass-transition-all glass-duration-200"
                  style={{
                    padding: masonryConfig.itemPadding,
                    boxSizing: "border-box",
                    overflow: "auto",
                  }}
                >
                  {item.content}
                </OptimizedGlass>
              </motion.div>
            ))}

            {/* Loading items */}
            {loadingItems > 0 && (
              <>
                {Array.from({ length: loadingItems }, (_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="glass-absolute glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-animate-pulse"
                    style={{
                      left:
                        (i % calculateColumns(containerDimensions.width)) *
                          (300 + masonryConfig.gap) +
                        masonryConfig.gap,
                      top: containerDimensions.height + masonryConfig.gap,
                      width: 300,
                      height: 200 + Math.random() * 100,
                    }}
                  />
                ))}
              </>
            )}

            {/* Infinite scroll loading indicator */}
            {loadingMore && enableInfiniteScroll && (
              <div
                className="glass-absolute glass-w-full glass-flex glass-items-center glass-justify-center glass-py-8"
                style={{ top: containerDimensions.height + masonryConfig.gap }}
              >
                <div className="glass-flex glass-items-center glass-space-x-2 glass-text-primary">
                  <div className="glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin" />
                  <span className="glass-text-sm">Loading more items...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        {!compact && (
          <div className="glass-flex glass-items-center glass-justify-between glass-mt-6 glass-pt-4 glass-border-t glass-border-white/10 glass-text-xs glass-text-primary-glass-opacity-60">
            <div className="glass-flex glass-items-center glass-space-x-4">
              {enableDragReorder && <span>Drag items to reorder</span>}
              {enableInfiniteScroll && <span>Scroll to load more</span>}
              {enableVirtualization && <span>Virtualized for performance</span>}
            </div>

            <div>
              Grid: {containerDimensions.width}×{containerDimensions.height}px
            </div>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassMasonryGrid.displayName = "GlassMasonryGrid";
