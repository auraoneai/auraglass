'use client';
import React from 'react';
import { useState, useCallback, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export type SortKey<T> = keyof T | null;

export interface SortConfig<T> {
  key: SortKey<T>;
  direction: SortDirection;
}

export interface SortableDataOptions<T> {
  /** Initial sort configuration */
  initialSort?: SortConfig<T>;
  /** Custom sort function */
  customSort?: (a: T, b: T, key: keyof T, direction: SortDirection) => number;
  /** Enable multi-column sorting */
  multiSort?: boolean;
  /** Maximum number of sort levels for multi-sort */
  maxSortLevels?: number;
  /** Stable sort (preserves original order for equal items) */
  stable?: boolean;
  /** Case-sensitive sorting for strings */
  caseSensitive?: boolean;
  /** Null/undefined handling */
  nullsFirst?: boolean;
  /** Custom value getter for sorting */
  getValue?: (item: T, key: keyof T) => any;
}

export interface SortableDataResult<T> {
  /** Sorted data */
  data: T[];
  /** Current sort configuration */
  sortConfig: SortConfig<T>;
  /** Multi-sort configurations */
  sortConfigs: SortConfig<T>[];
  /** Sort function */
  sort: (key: keyof T, direction?: SortDirection, append?: boolean) => void;
  /** Clear all sorting */
  clearSort: () => void;
  /** Toggle sort direction */
  toggleSort: (key: keyof T) => void;
  /** Check if column is sorted */
  isSorted: (key: keyof T) => boolean;
  /** Get sort direction for column */
  getSortDirection: (key: keyof T) => SortDirection;
  /** Get sort priority for column (for multi-sort) */
  getSortPriority: (key: keyof T) => number | null;
}

const DEFAULT_OPTIONS = {
  multiSort: false,
  maxSortLevels: 3,
  stable: true,
  caseSensitive: false,
  nullsFirst: false,
};

export function useSortableData<T>(
  data: T[],
  options: SortableDataOptions<T> = {}
): SortableDataResult<T> {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  const [sortConfigs, setSortConfigs] = useState<SortConfig<T>[]>(
    finalOptions.initialSort ? [finalOptions.initialSort] : []
  );

  // Get the primary sort config
  const sortConfig = sortConfigs[0] || { key: null, direction: null };

  // Default sort function
  const defaultSort = useCallback((a: T, b: T, key: keyof T, direction: SortDirection): number => {
    const aValue = finalOptions.getValue ? finalOptions.getValue(a, key) : (a as any)[key];
    const bValue = finalOptions.getValue ? finalOptions.getValue(b, key) : (b as any)[key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return finalOptions.nullsFirst ? -1 : 1;
    if (bValue == null) return finalOptions.nullsFirst ? 1 : -1;

    // String comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = finalOptions.caseSensitive
        ? aValue.localeCompare(bValue)
        : aValue.toLowerCase().localeCompare(bValue.toLowerCase());

      return direction === 'asc' ? comparison : -comparison;
    }

    // Number/Date comparison
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;

    return 0;
  }, [finalOptions]);

  // Sort data based on configurations
  const sortedData = useMemo(() => {
        if (!sortConfigs || (sortConfigs?.length || 0) === 0) return data;

    const sortFn = finalOptions.customSort || defaultSort;

    return [...data].sort((a: any, b: any) => {
      for (const config of sortConfigs) {
        if (config.key === null) continue;

        const result = sortFn(a, b, config.key, config.direction);
        if (result !== 0) return result;
      }

      return 0;
    });
  }, [data, sortConfigs, defaultSort, finalOptions.customSort]);

  // Sort function
  const sort = useCallback((
    key: keyof T,
    direction?: SortDirection,
    append: boolean = false
  ) => {
    setSortConfigs(prevConfigs => {
      // If not appending, replace all configs
      if (!finalOptions.multiSort || !append) {
        const newDirection = direction ||
          (prevConfigs[0]?.key === key && prevConfigs[0]?.direction === 'asc' ? 'desc' : 'asc');
        return [{ key, direction: newDirection }];
      }

      // Multi-sort logic
      const existingIndex = prevConfigs.findIndex(config => config.key === key);

      if (existingIndex >= 0) {
        // Toggle direction or remove if already desc
        const currentDirection = prevConfigs[existingIndex].direction;
        if (currentDirection === 'desc') {
          // Remove this sort level
          return prevConfigs.filter((_, index) => index !== existingIndex);
        } else {
          // Change to desc
          const newConfigs = [...prevConfigs];
          if (newConfigs) {
            newConfigs[existingIndex] = { ...newConfigs?.[existingIndex], direction: 'desc' as const };
          }
          return newConfigs;
        }
      } else {
        // Add new sort level
        if ((prevConfigs?.length || 0) >= finalOptions.maxSortLevels) {
          // Remove oldest if at max levels
          return [...prevConfigs.slice(1), { key, direction: direction || 'asc' }];
        } else {
          return [...prevConfigs, { key, direction: direction || 'asc' }];
        }
      }
    });
  }, [finalOptions.multiSort, finalOptions.maxSortLevels]);

  // Clear all sorting
  const clearSort = useCallback(() => {
    setSortConfigs([]);
  }, []);

  // Toggle sort direction
  const toggleSort = useCallback((key: keyof T) => {
    const existingConfig = sortConfigs.find(config => config.key === key);
    if (existingConfig) {
      sort(key, existingConfig.direction === 'asc' ? 'desc' : 'asc', true);
    } else {
      sort(key, 'asc', true);
    }
  }, [sortConfigs, sort]);

  // Check if column is sorted
  const isSorted = useCallback((key: keyof T): boolean => {
    return sortConfigs.some(config => config.key === key);
  }, [sortConfigs]);

  // Get sort direction for column
  const getSortDirection = useCallback((key: keyof T): SortDirection => {
    const config = sortConfigs.find(config => config.key === key);
    return config?.direction || null;
  }, [sortConfigs]);

  // Get sort priority for column
  const getSortPriority = useCallback((key: keyof T): number | null => {
    const index = sortConfigs.findIndex(config => config.key === key);
    return index >= 0 ? index + 1 : null;
  }, [sortConfigs]);

  return {
    data: sortedData,
    sortConfig,
    sortConfigs,
    sort,
    clearSort,
    toggleSort,
    isSorted,
    getSortDirection,
    getSortPriority,
  };
}

// Hook for searchable and sortable data
export function useSearchableSortableData<T>(
  data: T[],
  searchFields: (keyof T)[],
  options: SortableDataOptions<T> & {
    searchQuery?: string;
    searchDebounce?: number;
    caseSensitive?: boolean;
    fuzzy?: boolean;
  } = {}
) {
  const {
    searchQuery = '',
    searchDebounce = 300,
    caseSensitive = false,
    fuzzy = false,
    ...sortOptions
  } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useMemo(() => {
    if (searchDebounce > 0) {
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, searchDebounce);

      return () => clearTimeout(timer);
    } else {
      setDebouncedQuery(searchQuery);
    }
  }, [searchQuery, searchDebounce]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) return data;

    const query = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();

    return data?.filter((item: any) => {
      return searchFields.some(field => {
        const value = String((item as any)[field] || '').trim();
        const normalizedValue = caseSensitive ? value : value.toLowerCase();

        if (fuzzy) {
          // Simple fuzzy search
          return normalizedValue.includes(query);
        } else {
          return normalizedValue.includes(query);
        }
      });
    });
  }, [data, debouncedQuery, searchFields, caseSensitive, fuzzy]);

  // Apply sorting to filtered data
  const sortableResult = useSortableData(filteredData, sortOptions);

  return {
    ...sortableResult,
    filteredData,
    searchQuery: debouncedQuery,
    totalCount: (data?.length || 0),
    filteredCount: (filteredData?.length || 0),
  };
}

// Hook for paginated sortable data
export function usePaginatedSortableData<T>(
  data: T[],
  itemsPerPage: number = 10,
  options: SortableDataOptions<T> & {
    initialPage?: number;
    onPageChange?: (page: number) => void;
  } = {}
) {
  const { initialPage = 1, onPageChange, ...sortOptions } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const sortableResult = useSortableData(data, sortOptions);

  // Calculate pagination
  const totalPages = Math.ceil((sortableResult.data?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortableResult.data?.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    onPageChange?.(validPage);
  }, [totalPages, onPageChange]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  return {
    ...sortableResult,
    data: paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: sortableResult.data?.length || 0,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

// Utility functions for sorting
export const sortUtils = {
  // Natural sort for strings with numbers
  naturalSort: (a: string, b: string, direction: SortDirection = 'asc'): number => {
    const regex = /(\d+|[^\d]+)/g;
    const aParts = a.match(regex) || [];
    const bParts = b.match(regex) || [];

    for (let i = 0; i < Math.max((aParts?.length || 0), (bParts?.length || 0)); i++) {
      const aPart = aParts[i] || '';
      const bPart = bParts[i] || '';

      const aIsNumber = /^\d+$/.test(aPart);
      const bIsNumber = /^\d+$/.test(bPart);

      if (aIsNumber && bIsNumber) {
        const diff = parseInt(aPart) - parseInt(bPart);
        if (diff !== 0) return direction === 'asc' ? diff : -diff;
      } else {
        const comparison = aPart.localeCompare(bPart);
        if (comparison !== 0) return direction === 'asc' ? comparison : -comparison;
      }
    }

    return 0;
  },

  // Sort by multiple criteria with weights
  weightedSort: <T>(
    items: T[],
    criteria: Array<{
      key: keyof T;
      weight: number;
      direction?: SortDirection;
    }>
  ): T[] => {
    return [...items].sort((a: any, b: any) => {
      let scoreA = 0;
      const scoreB = 0;

      for (const criterion of criteria) {
        const aValue = a[criterion.key];
        const bValue = b?.[criterion.key];
        const direction = criterion.direction || 'asc';
        const multiplier = direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          scoreA += (aValue - bValue) * criterion.weight * multiplier;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          scoreA += aValue.localeCompare(bValue) * criterion.weight * multiplier;
        }
      }

      return scoreA - scoreB;
    });
  },

  // Group sort (sort within groups)
  groupSort: <T, K extends keyof T>(
    items: T[],
    groupBy: K,
    sortBy: K,
    direction: SortDirection = 'asc'
  ): T[] => {
    const groups = new Map<any, T[]>();

    // Group items
    items.forEach((item: any) => {
      const groupKey = item?.[groupBy];
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    // Sort within each group
    groups.forEach((group: any) => {
      group.sort((a: any, b: any) => {
        const aValue = a[sortBy];
        const bValue = b?.[sortBy];

        if (aValue != null && bValue != null) {
          if (aValue < bValue) return direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    });

    // Flatten groups back into array
    return Array.from(groups.values()).flat();
  },
};