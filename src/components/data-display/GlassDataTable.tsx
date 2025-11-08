import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { OptimizedGlass } from '../../primitives';
import { IconButton } from '../button/GlassButton';
import { GlassInput } from '../input/GlassInput';
import { GlassSelect } from '../input/GlassSelect';
import { usePredictiveEngine, useInteractionRecorder } from '../advanced/GlassPredictiveEngine';
import { useAchievements } from '../advanced/GlassAchievementSystem';
import { useBiometricAdaptation } from '../advanced/GlassBiometricAdaptation';
import { useEyeTracking } from '../advanced/GlassEyeTracking';
import { useSpatialAudio } from '../advanced/GlassSpatialAudio';
import type { ConsciousnessFeatures } from '../layout/GlassContainer';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface ColumnDef<T = any> {
  id?: string;
  header: string | ((props: any) => React.ReactNode);
  accessorKey?: string;
  accessorFn?: (row: T) => any;
  cell?: (props: { row: T; value: any }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export interface SortState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  [key: string]: any;
}

export interface GlassDataTableProps<T = any> extends ConsciousnessFeatures {
  /**
   * Table data
   */
  data?: T[];
  /**
   * Column definitions
   */
  columns: ColumnDef<T>[];
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Table variant
   */
  variant?: 'default' | 'striped' | 'bordered' | 'minimal';
  /**
   * Table size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Enable sorting
   */
  sortable?: boolean;
  /**
   * Enable filtering
   */
  filterable?: boolean;
  /**
   * Enable search
   */
  searchable?: boolean;
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
  /**
   * Enable pagination
   */
  pagination?: boolean;
  /**
   * Page size options
   */
  pageSizeOptions?: number[];
  /**
   * Initial page size
   */
  initialPageSize?: number;
  /**
   * Enable row selection
   */
  selectable?: boolean;
  /**
   * Selection mode
   */
  selectionMode?: 'single' | 'multiple';
  /**
   * Selected rows
   */
  selectedRows?: string[];
  /**
   * Selection change handler
   */
  onSelectionChange?: (selectedRows: string[]) => void;
  /**
   * Row click handler
   */
  onRowClick?: (row: T) => void;
  /**
   * Get row ID
   */
  getRowId?: (row: T, index?: number) => string;
  /**
   * Custom row props
   */
  getRowProps?: (row: T) => React.HTMLAttributes<HTMLTableRowElement>;
  /**
   * Sticky header
   */
  stickyHeader?: boolean;
  /**
   * Table actions
   */
  actions?: React.ReactNode;
  className?: string;
  /**
   * Optional per-column cell renderers by column id or accessorKey
   */
  cellRenderers?: Record<string, (value: any, row: T) => React.ReactNode>;
  /**
   * Optional rich empty state
   */
  emptyState?: {
    icon?: React.ReactNode;
    message?: string;
    description?: string;
  };
}

/**
 * GlassDataTable component
 * A comprehensive data table with glassmorphism styling
 */
export const GlassDataTable = <T = any,>(props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }) => {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  return <GlassDataTableInner {...props} />;
};

const GlassDataTableInner = forwardRef<HTMLDivElement, GlassDataTableProps>(
  (
    {
      data = [],
      columns = [],
      loading = false,
      emptyMessage = 'No data available',
      variant = 'default',
      size = 'md',
      sortable = true,
      filterable = false,
      searchable = true,
      searchPlaceholder = 'Search...',
      pagination = true,
      pageSizeOptions = [10, 25, 50, 100],
      initialPageSize = 10,
      selectable = false,
      selectionMode = 'multiple',
      selectedRows = [],
      onSelectionChange,
      onRowClick,
      getRowId = (row: any, index: any) => index.toString(),
      getRowProps,
      stickyHeader = false,
      actions,
      cellRenderers,
      emptyState,
      className,
      // Consciousness features
      predictive = false,
      preloadContent = false,
      eyeTracking = false,
      gazeResponsive = false,
      adaptive = false,
      biometricResponsive = false,
      spatialAudio = false,
      audioFeedback = false,
      trackAchievements = false,
      achievementId,
      usageContext = 'main',
    },
    ref
  ) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const [columnUsage, setColumnUsage] = useState<Record<string, number>>({});
    const [predictedSortColumn, setPredictedSortColumn] = useState<string | null>(null);
    const [adaptivePageSize, setAdaptivePageSize] = useState(initialPageSize);
    const [interactionHeatmap, setInteractionHeatmap] = useState<Record<string, number>>({});
    
    // Consciousness feature hooks - only initialize if features are enabled
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;
    const interactionRecorder = (predictive || trackAchievements) ? useInteractionRecorder(`glass-datatable-${usageContext}`) : null;
    const [sortState, setSortState] = useState<SortState | null>(null);
    const [filterState, setFilterState] = useState<FilterState>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Ensure size is always valid
    const validSize = size && ['sm', 'md', 'lg'].includes(size) ? size : 'md';

    // Biometric adaptation for table density and pagination
    useEffect(() => {
      if (!biometricResponsive || !biometricAdapter) return;

      const adaptTable = () => {
        const stressLevel = biometricAdapter.currentStressLevel;

        // Adapt page size based on stress level
        if (stressLevel > 0.7) {
          setAdaptivePageSize(Math.min(initialPageSize, 10)); // Smaller pages when stressed
        } else if (stressLevel < 0.3) {
          setAdaptivePageSize(Math.max(initialPageSize, 25)); // Larger pages when relaxed
        } else {
          setAdaptivePageSize(initialPageSize); // Use original page size
        }
      };

      // Initial adaptation
      adaptTable();

      // Listen for biometric changes
      const interval = setInterval(adaptTable, 5000);
      return () => clearInterval(interval);
    }, [biometricResponsive, biometricAdapter, initialPageSize]);

    // Predictive sorting based on column usage patterns
    useEffect(() => {
      if (!predictive || !predictiveEngine) return;

      const updatePredictions = () => {
        const predictions = predictiveEngine.predictions;
        const sortPrediction = predictions.find(p =>
          p.type === 'suggest' && p.metadata?.tableContext === usageContext
        );
        
        if (sortPrediction && sortPrediction.confidence > 0.8) {
          setPredictedSortColumn(sortPrediction.metadata.columnId);
        } else {
          setPredictedSortColumn(null);
        }
      };

      const interval = setInterval(updatePredictions, 3000);
      updatePredictions(); // Initial update

      return () => clearInterval(interval);
    }, [predictive, predictiveEngine, usageContext]);

    // Eye tracking for data attention analysis
    useEffect(() => {
      if (!gazeResponsive || !eyeTracker || !tableRef.current) return;

      const handleCellGaze = (event: any) => {
        const cellElement = event.target.closest('td');
        if (!cellElement) return;

        const rowIndex = Array.from(cellElement.parentElement.parentElement.children).indexOf(cellElement.parentElement);
        const cellIndex = Array.from(cellElement.parentElement.children).indexOf(cellElement);
        const heatmapKey = `${rowIndex}-${cellIndex}`;

        setInteractionHeatmap((prev: any) => ({
          ...prev,
          [heatmapKey]: (prev[heatmapKey] || 0) + 1,
        }));

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound('cell_attention', {
            x: cellElement.offsetLeft,
            y: cellElement.offsetTop,
            z: 0,
          });
        }
      };

      // Note: onGazeEnter/offGazeEnter not available on current eye tracker interface
      // eyeTracker.onGazeEnter?.(tableRef.current, handleCellGaze);

      return () => {
        // if (tableRef.current) {
        //   eyeTracker.offGazeEnter?.(tableRef.current, handleCellGaze);
        // }
      };
    }, [gazeResponsive, eyeTracker, spatialAudioEngine, audioFeedback]);

    const sizeClasses = {
      sm: 'glass-text-xs',
      md: 'glass-text-sm',
      lg: 'glass-text-base',
    };

    const cellPaddingClasses = {
      sm: 'glass-px-3 glass-py-2',
      md: 'glass-px-4 glass-py-3',
      lg: 'glass-px-6 glass-py-4',
    };

    // Filter and search data
    const filteredData = useMemo(() => {
      let result = [...(data || [])];

      // Apply search
      if (searchQuery) {
        result = result.filter((row: any) =>
          columns.some(column => {
            const value = column.accessorFn
              ? column.accessorFn(row)
              : column.accessorKey
                ? row[column.accessorKey]
                : '';
            return String(value).toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      }

      // Apply filters
      Object.entries(filterState).forEach(([columnId, filterValue]) => {
        if (filterValue) {
          const column = columns.find(col => col.id === columnId);
          if (column) {
            result = result.filter((row: any) => {
              const value = column.accessorFn
                ? column.accessorFn(row)
                : column.accessorKey
                  ? row[column.accessorKey]
                  : '';
              return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
            });
          }
        }
      });

      return result;
    }, [data, columns, searchQuery, filterState]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortState || !filteredData) return filteredData || [];

      const column = columns.find(col => (col.id || `col-${columns.indexOf(col)}`) === sortState.id);
      if (!column) return filteredData;

      return [...filteredData].sort((a, b) => {
        const aValue = column.accessorFn
          ? column.accessorFn(a)
          : column.accessorKey
            ? a[column.accessorKey]
            : '';
        const bValue = column.accessorFn
          ? column.accessorFn(b)
          : column.accessorKey
            ? b[column.accessorKey]
            : '';

        if (aValue < bValue) return sortState.desc ? 1 : -1;
        if (aValue > bValue) return sortState.desc ? -1 : 1;
        return 0;
      });
    }, [filteredData, sortState, columns]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination || !sortedData) return sortedData || [];

      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

        const totalPages = Math.ceil(((sortedData || [])?.length || 0) / pageSize);

    // Enhanced sorting with consciousness tracking
    const handleSort = useCallback((columnId: string) => {
      const column = columns.find(col => (col.id || `col-${columns.indexOf(col)}`) === columnId);
      if (!column?.sortable && !sortable) return;

      // Track column usage for predictive sorting
      if (predictive) {
        setColumnUsage((prev: any) => ({
          ...prev,
          [columnId]: (prev[columnId] || 0) + 1,
        }));
      }

      // Record interaction for learning
      if (interactionRecorder) {
        interactionRecorder.recordClick({
          target: { id: `column-sort-${columnId}` },
          currentTarget: document.createElement('div'),
          clientX: 0,
          clientY: 0,
          pageX: 0,
          pageY: 0,
          screenX: 0,
          screenY: 0,
          movementX: 0,
          movementY: 0,
          button: 0,
          buttons: 0,
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          getModifierState: () => false,
          preventDefault: () => {},
          stopPropagation: () => {},
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          nativeEvent: new MouseEvent('click'),
          persist: () => {},
        } as any);
      }

      // Track achievements
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction('table_sort', {
          columnId,
          usage: (columnUsage[columnId] || 0) + 1,
          context: usageContext,
        });
      }

      // Play spatial audio feedback
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound('sort_column');
      }

      setSortState((prev: any) => {
        if (prev?.id === columnId) {
          return prev.desc ? null : { id: columnId, desc: true };
        }
        return { id: columnId, desc: false };
      });
    }, [columns, sortable, predictive, interactionRecorder, achievementTracker, trackAchievements, spatialAudioEngine, audioFeedback, columnUsage, usageContext]);

    // Handle selection
    const handleRowSelection = (rowId: string, selected: boolean) => {
      if (!onSelectionChange) return;

      if (selectionMode === 'single') {
        onSelectionChange(selected ? [rowId] : []);
      } else {
        const newSelection = selected
          ? [...selectedRows, rowId]
          : selectedRows.filter((id: any) => id !== rowId);
        onSelectionChange(newSelection);
      }
    };

    const handleSelectAll = (selected: boolean) => {
      if (!onSelectionChange) return;

      if (selected) {
        const allIds = ((paginatedData || [])).map((row, index) => getRowId(row, index));
        onSelectionChange(allIds);
      } else {
        onSelectionChange([]);
      }
    };

    const isAllSelected = (paginatedData || []).length > 0 &&
      (paginatedData || []).every((row, index) => selectedRows.includes(getRowId(row, index)));

    return (
      <div data-glass-component ref={ref} className={cn('w-full', className)}>
        {/* Table header with search and actions */}
        {(searchable || actions || filterable) && (
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {searchable && (
                <GlassInput
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  clearable
                  className="w-64"
                />
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Table container */}
        <OptimizedGlass
          elevation={'level2'}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          className={cn(
            'overflow-hidden transition-all duration-500',
            variant === 'bordered' && 'border border-border/20'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table header */}
              <thead
                className={cn(
                  'relative bg-muted/20 border-b border-border/20',
                  stickyHeader && 'sticky top-0 z-10'
                )}
              >
                <tr>
                  {selectable && (
                    <th className={cn('w-12', cellPaddingClasses[validSize])}>
                      <GlassInput type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="glass-radius-md border-glass-border focus:ring-primary"
                      />
                    </th>
                  )}

                  {(columns || []).map((column, index) => {
                    const columnId = column.id || `col-${index}`;
                    const headerContent = typeof column.header === 'function' ? column.header({ column }) : column.header;

                    return (
                      <th
                        key={columnId}
                        className={cn(
                          'font-semibold text-foreground border-b border-border/10 transition-all duration-200',
                          cellPaddingClasses[validSize],
                          sizeClasses[validSize],
                          {
                            'text-center': column.align === 'center',
                            'text-right': column.align === 'right',
                            'cursor-pointer hover:bg-muted/10 hover:text-foreground': column.sortable || sortable,
                          }
                        )}
                        style={{ width: column.width }}
                        onClick={(e) => handleSort(columnId)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{headerContent}</span>

                          {(column.sortable || sortable) && (
                            <div className="flex flex-col">
                              <svg
                                className={cn(
                                  'w-3 h-3 -glass-mb-1 transition-colors',
                                  sortState?.id === columnId && !sortState.desc
                                    ? 'text-primary'
                                    : 'glass-text-secondary hover:text-foreground'
                                )}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                              <svg
                                className={cn(
                                  'w-3 h-3 rotate-180 transition-colors',
                                  sortState?.id === columnId && sortState.desc
                                    ? 'text-primary'
                                    : 'glass-text-secondary hover:text-foreground'
                                )}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className={cn('text-center', cellPaddingClasses[validSize])}
                    >
                      <div className="flex items-center justify-center gap-2 py-8">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent glass-radius-full animate-spin" />
                        <span className="glass-text-secondary">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className={cn('text-center glass-text-secondary py-8', cellPaddingClasses[validSize])}
                    >
                      {emptyState ? (
                        <div className="flex flex-col items-center gap-2">
                          {emptyState.icon}
                          <div className="font-medium">{emptyState.message || emptyMessage}</div>
                          {emptyState.description && (
                            <div className="text-sm glass-text-secondary">{emptyState.description}</div>
                          )}
                        </div>
                      ) : (
                        emptyMessage
                      )}
                    </td>
                  </tr>
                ) : (
                  ((paginatedData || [])).map((row, index) => {
                    const rowId = getRowId(row, index);
                    const isSelected = selectedRows.includes(rowId);
                    const rowProps = getRowProps?.(row) || {};

                    return (
                      <tr
                        key={rowId}
                        className={cn(
                          'group transition-all duration-200 glass-radius-md',
                          {
                            'bg-muted/5': variant === 'striped' && index % 2 === 1,
                            'bg-primary/10 shadow-md shadow-primary/20 ring-1 ring-primary/20': isSelected,
                            'hover:bg-muted/10 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:ring-1 hover:ring-white/10': onRowClick,
                            // Consciousness feature styles
                            'ring-1 ring-blue-400/20 bg-blue-400/5': gazeResponsive && interactionHeatmap[`${index}-0`] > 5,
                            'animate-pulse': predictedSortColumn && columns.some(col => (col.id || `col-${columns.indexOf(col)}`) === predictedSortColumn),
                            'transform-gpu': gazeResponsive || biometricResponsive,
                          }
                        )}
                        onClick={(e) => onRowClick?.(row)}
                        {...rowProps}
                      >
                        {selectable && (
                          <td className={cellPaddingClasses[validSize]}>
                            <GlassInput type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleRowSelection(rowId, e.target.checked)}
                              className="glass-radius-md border-glass-border focus:ring-primary"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                        )}

                        {(columns || []).map((column, colIndex) => {
                          const columnId = column.id || `col-${colIndex}`;
                          const value = column.accessorFn
                            ? column.accessorFn(row)
                            : column.accessorKey
                              ? row[column.accessorKey]
                              : '';

                          return (
                            <td
                              key={columnId}
                              className={cn(
                                'border-b border-border/5 text-foreground/80 transition-colors group-hover:text-foreground',
                                cellPaddingClasses[validSize],
                                sizeClasses[validSize],
                                {
                                  'text-center': column.align === 'center',
                                  'text-right': column.align === 'right',
                                }
                              )}
                            >
                              {column.cell
                                ? column.cell({ row, value })
                                : cellRenderers && (cellRenderers[column.id || (column.accessorKey as string) || '']
                                  ? cellRenderers[column.id || (column.accessorKey as string) || '']!(value, row as any)
                                  : String(value))}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && !loading && (paginatedData || []).length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-glass-border/10 glass-surface-subtle">
              <div className="flex items-center gap-2">
                <span className="text-sm glass-text-secondary">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, (sortedData || []).length)} of{' '}
                  {(sortedData || []).length} results
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm glass-text-secondary">Rows per page:</span>
                  <GlassSelect
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    options={(pageSizeOptions || []).map((size: any) => ({
                      value: size,
                      label: size.toString(),
                    }))}
                    size="sm"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <IconButton
                    icon="←"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={(e) => setCurrentPage(1)}
                    aria-label="First page"
                  />
                  <IconButton
                    icon="‹"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={(e) => setCurrentPage(p => p - 1)}
                    aria-label="Previous page"
                  />

                  <span className="px-3 py-1 text-sm">
                    {currentPage} of {totalPages}
                  </span>

                  <IconButton
                    icon="›"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={(e) => setCurrentPage(p => p + 1)}
                    aria-label="Next page"
                  />
                  <IconButton
                    icon="→"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={(e) => setCurrentPage(totalPages)}
                    aria-label="Last page"
                  />
                </div>
              </div>
            </div>
          )}
        </OptimizedGlass>
      </div>
    );
  }
);

GlassDataTableInner.displayName = 'GlassDataTable';

/**
 * Enhanced GlassDataTable with consciousness features enabled by default
 * Use this for tables that should be intelligent and adaptive
 */
export const ConsciousGlassDataTable = <T = any,>(
  props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => (
  <GlassDataTable
    predictive={true}
    adaptive={true}
    biometricResponsive={true}
    trackAchievements={true}
    achievementId="conscious_table_usage"
    usageContext="list"
    {...props}
  />
);

/**
 * Predictive data table that learns user sorting and filtering patterns
 */
export const PredictiveDataTable = <T = any,>(
  props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => (
  <GlassDataTable
    predictive={true}
    preloadContent={true}
    trackAchievements={true}
    achievementId="predictive_table_usage"
    usageContext="list"
    {...props}
  />
);

/**
 * Gaze-responsive data table with eye tracking for enhanced data exploration
 */
export const GazeResponsiveDataTable = <T = any,>(
  props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => (
  <GlassDataTable
    eyeTracking={true}
    gazeResponsive={true}
    spatialAudio={true}
    audioFeedback={true}
    trackAchievements={true}
    achievementId="gaze_table_interaction"
    usageContext="list"
    {...props}
  />
);

/**
 * Accessibility-focused data table with biometric adaptation and spatial audio
 */
export const AccessibleDataTable = <T = any,>(
  props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => (
  <GlassDataTable
    adaptive={true}
    biometricResponsive={true}
    spatialAudio={true}
    audioFeedback={true}
    trackAchievements={true}
    achievementId="accessible_table_usage"
    usageContext="list"
    {...props}
  />
);

/**
 * Pre-configured consciousness data table presets
 */
export const DataTableConsciousnessPresets = {
  /**
   * Minimal consciousness features for performance-sensitive contexts
   */
  minimal: {
    predictive: true,
    trackAchievements: true,
  },
  
  /**
   * Balanced consciousness features for general use
   */
  balanced: {
    predictive: true,
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
  },
  
  /**
   * Full consciousness features for immersive data exploration
   */
  immersive: {
    predictive: true,
    preloadContent: true,
    eyeTracking: true,
    gazeResponsive: true,
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },
  
  /**
   * Accessibility-focused consciousness features
   */
  accessible: {
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },
} as const;
