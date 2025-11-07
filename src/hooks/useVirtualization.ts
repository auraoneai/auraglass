import React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useEnhancedPerformance } from './useEnhancedPerformance';

export interface VirtualizationOptions {
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
  enableHorizontal?: boolean;
  itemWidth?: number | ((index: number) => number);
  containerWidth?: number;
  threshold?: number;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
}

export interface VirtualizedItem<T> {
  index: number;
  data: T;
  style: React.CSSProperties;
}

export interface VirtualizationState<T> {
  startIndex: number;
  endIndex: number;
  visibleItems: VirtualizedItem<T>[];
  totalHeight: number;
  totalWidth: number;
  scrollTop: number;
  scrollLeft: number;
}

/**
 * High-performance virtualization hook for large datasets
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): VirtualizationState<T> & {
  containerProps: React.HTMLAttributes<HTMLDivElement> & { ref: React.RefObject<HTMLDivElement> };
  scrollElementProps: React.HTMLAttributes<HTMLDivElement>;
  measureElement: (index: number, element: HTMLElement) => void;
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
} {
  const {
    itemHeight,
    containerHeight,
    overscan = 3,
    enableHorizontal = false,
    itemWidth,
    containerWidth = 0,
    threshold = 100,
    onScroll,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [measuredSizes, setMeasuredSizes] = useState<Map<number, { width: number; height: number }>>(new Map());
  
  const { performanceMode } = useEnhancedPerformance();
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate item dimensions
  const getItemHeight = useCallback((index: number): number => {
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }
    return measuredSizes.get(index)?.height || itemHeight;
  }, [itemHeight, measuredSizes]);

  const getItemWidth = useCallback((index: number): number => {
    if (!enableHorizontal || !itemWidth) return containerWidth;
    
    if (typeof itemWidth === 'function') {
      return itemWidth(index);
    }
    return measuredSizes.get(index)?.width || itemWidth;
  }, [enableHorizontal, itemWidth, containerWidth, measuredSizes]);

  // Calculate total dimensions
  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
        return (items?.length || 0) * itemHeight;
    }
    
    let total = 0;
    for (let i = 0; i < (items?.length || 0); i++) {
      total += getItemHeight(i);
    }
    return total;
  }, [items.length, itemHeight, getItemHeight]);

  const totalWidth = useMemo(() => {
    if (!enableHorizontal || typeof itemWidth === 'number') {
      return containerWidth;
    }
    
    let total = 0;
    for (let i = 0; i < (items?.length || 0); i++) {
      total += getItemWidth(i);
    }
    return total;
  }, [enableHorizontal, itemWidth, containerWidth, items.length, getItemWidth]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    let startIndex = 0;
    let endIndex = items.length - 1;

    if (typeof itemHeight === 'number') {
      // Fixed height optimization
      startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      endIndex = Math.min(
        (items?.length || 1) - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
    } else {
      // Variable height calculation
      let currentOffset = 0;
      
      // Find start index
      for (let i = 0; i < (items?.length || 0); i++) {
        const height = getItemHeight(i);
        if (currentOffset + height > scrollTop) {
          startIndex = Math.max(0, i - overscan);
          break;
        }
        currentOffset += height;
      }

      // Find end index
      currentOffset = 0;
      for (let i = 0; i < startIndex; i++) {
        currentOffset += getItemHeight(i);
      }

      for (let i = startIndex; i < items.length; i++) {
        const height = getItemHeight(i);
        if (currentOffset > scrollTop + containerHeight) {
          endIndex = Math.min(items.length - 1, i + overscan);
          break;
        }
        currentOffset += height;
      }
    }

    return { startIndex, endIndex };
  }, [items.length, itemHeight, scrollTop, containerHeight, overscan, getItemHeight]);

  // Calculate visible items with positions
  const visibleItems = useMemo((): VirtualizedItem<T>[] => {
    const result: VirtualizedItem<T>[] = [];
    let currentOffset = 0;

    // Calculate offset to start index
    for (let i = 0; i < visibleRange.startIndex; i++) {
      currentOffset += getItemHeight(i);
    }

    // Generate visible items
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex && i < items.length; i++) {
      const height = getItemHeight(i);
      const width = getItemWidth(i);

      result.push({
        index: i,
        data: items[i],
        style: {
          position: 'absolute',
          top: currentOffset,
          left: enableHorizontal ? 0 : undefined,
          width: enableHorizontal ? width : '100%',
          height,
          contain: 'layout style paint',
        },
      });

      currentOffset += height;
    }

    return result;
  }, [visibleRange, items, getItemHeight, getItemWidth, enableHorizontal]);

  // Measure element size
  const measureElement = useCallback((index: number, element: HTMLElement) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setMeasuredSizes((prev: any) => new Map(prev.set(index, {
      width: rect.width,
      height: rect.height,
    })));
  }, []);

  // Optimized scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const newScrollTop = target.scrollTop;
    const newScrollLeft = target.scrollLeft;

    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);

    isScrollingRef.current = true;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to detect end of scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);

    onScroll?.(newScrollTop, newScrollLeft);
  }, [onScroll]);

  // Scroll to index
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef.current) return;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }

    const itemHeight = getItemHeight(index);

    switch (align) {
      case 'center':
        offset -= (containerHeight - itemHeight) / 2;
        break;
      case 'end':
        offset -= containerHeight - itemHeight;
        break;
    }

    containerRef.current.scrollTo({
      top: Math.max(0, offset),
      behavior: 'smooth',
    });
  }, [getItemHeight, containerHeight]);

  // Performance optimization: disable virtualization for small lists
  const shouldVirtualize = useMemo(() => {
        if (performanceMode === 'high') return (items?.length || 0) > threshold * 2;
    if (performanceMode === 'low') return (items?.length || 0) > threshold / 2;
    return (items?.length || 0) > threshold;
  }, [items?.length, threshold, performanceMode]);

  // Container props
  const containerProps: React.HTMLAttributes<HTMLDivElement> & { ref: React.RefObject<HTMLDivElement> } = {
    ref: containerRef,
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      width: enableHorizontal ? containerWidth : '100%',
      overflow: 'auto',
      contain: 'strict',
      WebkitOverflowScrolling: 'touch',
    },
  };

  // Scroll element props (inner container)
  const scrollElementProps: React.HTMLAttributes<HTMLDivElement> = {
    style: {
      height: totalHeight,
      width: enableHorizontal ? totalWidth : '100%',
      position: 'relative',
      contain: 'layout',
    },
  };

  // Return all items if virtualization is disabled
  const finalVisibleItems = shouldVirtualize ? visibleItems : items.map((data, index) => ({
    index,
    data,
    style: {
      position: 'relative' as const,
      contain: 'layout style paint',
    },
  }));

  return {
    startIndex: shouldVirtualize ? visibleRange.startIndex : 0,
    endIndex: shouldVirtualize ? visibleRange.endIndex : items.length - 1,
    visibleItems: finalVisibleItems,
    totalHeight,
    totalWidth,
    scrollTop,
    scrollLeft,
    containerProps,
    scrollElementProps,
    measureElement,
    scrollToIndex,
  };
}

/**
 * Hook for grid virtualization
 */
export function useGridVirtualization<T>(
  items: T[],
  options: {
    itemHeight: number;
    itemWidth: number;
    containerHeight: number;
    containerWidth: number;
    columns: number;
    gap?: number;
    overscan?: number;
  }
) {
  const {
    itemHeight,
    itemWidth,
    containerHeight,
    containerWidth,
    columns,
    gap = 0,
    overscan = 3,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const rows = Math.ceil(items.length / columns);
  const totalHeight = rows * (itemHeight + gap) - gap;

  const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - overscan);
  const endRow = Math.min(
    rows - 1,
    Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + overscan
  );

  const visibleItems = useMemo(() => {
    const result: Array<VirtualizedItem<T> & { row: number; col: number }> = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index >= (items?.length || 0)) break;

        result.push({
          index,
          data: items[index],
          row,
          col,
          style: {
            position: 'absolute',
            top: row * (itemHeight + gap),
            left: col * (itemWidth + gap),
            width: itemWidth,
            height: itemHeight,
            contain: 'layout style paint',
          },
        });
      }
    }

    return result;
  }, [items, startRow, endRow, columns, itemHeight, itemWidth, gap]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    containerProps: {
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        width: containerWidth,
        overflow: 'auto',
        contain: 'strict',
      },
    },
    scrollElementProps: {
      style: {
        height: totalHeight,
        width: containerWidth,
        position: 'relative',
        contain: 'layout',
      },
    },
  };
}

/**
 * Hook for infinite scroll with virtualization
 */
export function useInfiniteVirtualization<T>(
  items: T[],
  options: VirtualizationOptions & {
    loadMore: () => Promise<T[]>;
    hasMore: boolean;
    isLoading: boolean;
  }
) {
  const { loadMore, hasMore, isLoading, ...virtualizationOptions } = options;
  const [allItems, setAllItems] = useState(items);
  const loadingRef = useRef(false);

  const virtualization = useVirtualization(allItems, virtualizationOptions);

  // Load more items when scrolled near bottom
  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || isLoading) return;

    const { containerHeight } = virtualizationOptions;
    const { scrollTop, totalHeight } = virtualization;
    const scrollPercentage = (scrollTop + (containerHeight || 0)) / totalHeight;

    if (scrollPercentage > 0.8) {
      loadingRef.current = true;
      
      try {
        const newItems = await loadMore();
        setAllItems((prev: any) => [...prev, ...newItems]);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load more items:', error);
        }
      } finally {
        loadingRef.current = false;
      }
    }
  }, [virtualization, hasMore, isLoading, loadMore]);

  // Monitor scroll for infinite loading
  useEffect(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  return {
    ...virtualization,
    isLoadingMore: loadingRef.current,
        totalItems: allItems?.length || 0,
  };
}

/**
 * Hook for window virtualization (entire viewport)
 */
export function useWindowVirtualization<T>(
  items: T[],
  itemHeight: number | ((index: number) => number),
  overscan: number = 5
) {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 600
  );

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const visibleRange = useMemo(() => {
    if (typeof itemHeight === 'number') {
      const startIndex = Math.max(0, Math.floor(scrollY / itemHeight) - overscan);
      const endIndex = Math.min(
        (items?.length || 1) - 1,
        Math.ceil((scrollY + windowHeight) / itemHeight) + overscan
      );
      return { startIndex, endIndex };
    }

    // Variable height calculation
    let currentOffset = 0;
    let startIndex = 0;
    let endIndex = items.length - 1;

    // Find start index
    for (let i = 0; i < (items?.length || 0); i++) {
      const height = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;
      if (currentOffset + height > scrollY) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      currentOffset += height;
    }

    // Find end index
    for (let i = startIndex; i < items.length; i++) {
      const height = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;
      if (currentOffset > scrollY + windowHeight) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
      currentOffset += height;
    }

    return { startIndex, endIndex };
  }, [scrollY, windowHeight, items.length, itemHeight, overscan]);

  const visibleItems = useMemo((): VirtualizedItem<T>[] => {
    const result: VirtualizedItem<T>[] = [];
    let currentOffset = 0;

    // Calculate offset to start index
    for (let i = 0; i < visibleRange.startIndex; i++) {
      const height = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;
      currentOffset += height;
    }

    // Generate visible items
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex && i < items.length; i++) {
      const height = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;

      result.push({
        index: i,
        data: items[i],
        style: {
          position: 'absolute',
          top: currentOffset,
          width: '100%',
          height,
          contain: 'layout style paint',
        },
      });

      currentOffset += height;
    }

    return result;
  }, [visibleRange, items, itemHeight]);

  return {
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    visibleItems,
    scrollY,
    windowHeight,
  };
}

/**
 * Hook for table virtualization with fixed headers
 */
export function useTableVirtualization<T>(
  data: T[],
  options: {
    rowHeight: number;
    headerHeight: number;
    containerHeight: number;
    columns: Array<{
      key: string;
      width: number;
      fixed?: boolean;
    }>;
    overscan?: number;
  }
) {
  const {
    rowHeight,
    headerHeight,
    containerHeight,
    columns,
    overscan = 3,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const availableHeight = containerHeight - headerHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + availableHeight) / rowHeight) + overscan
  );

  const visibleRows = useMemo((): Array<VirtualizedItem<T> & { columns: typeof columns }> => {
    const result: Array<VirtualizedItem<T> & { columns: typeof columns }> = [];

    for (let i = startIndex; i <= endIndex && i < data.length; i++) {
      result.push({
        index: i,
        data: data[i],
        columns,
        style: {
          position: 'absolute',
          top: headerHeight + (i * rowHeight),
          left: 0,
          width: '100%',
          height: rowHeight,
          display: 'flex',
          contain: 'layout style paint',
        },
      });
    }

    return result;
  }, [startIndex, endIndex, data, columns, headerHeight, rowHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  const totalHeight = headerHeight + (data.length * rowHeight);
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return {
    visibleRows,
    totalHeight,
    totalWidth,
    scrollTop,
    scrollLeft,
    headerHeight,
    containerProps: {
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        contain: 'strict',
      },
    },
    scrollElementProps: {
      style: {
        height: totalHeight,
        width: totalWidth,
        position: 'relative',
        contain: 'layout',
      },
    },
  };
}
