"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { IconButton } from "../button/GlassButton";
import { GlassInput } from "../input/GlassInput";
import { GlassSelect } from "../input/GlassSelect";
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";
import { ContrastGuard } from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type GlassDataTableRow = Record<string, unknown>;
export type GlassDataTableCellValue = unknown;

export interface ColumnDef<T extends GlassDataTableRow = GlassDataTableRow> {
  id?: string;
  header: string | ((props: { column: ColumnDef<T> }) => React.ReactNode);
  accessorKey?: string;
  accessorFn?: (row: T) => GlassDataTableCellValue;
  cell?: (props: { row: T; value: GlassDataTableCellValue }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export interface SortState {
  id: string;
  desc: boolean;
}

export type FilterState = Record<string, GlassDataTableCellValue>;

export interface GlassDataTableProps<
  T extends GlassDataTableRow = GlassDataTableRow,
> extends ConsciousnessFeatures {
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
  variant?: "default" | "striped" | "bordered" | "minimal";
  /**
   * Table size
   */
  size?: "sm" | "md" | "lg";
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
  selectionMode?: "single" | "multiple";
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
  "aria-label"?: string;
  "data-testid"?: string;
  /**
   * Optional per-column cell renderers by column id or accessorKey
   */
  cellRenderers?: Record<
    string,
    (value: GlassDataTableCellValue, row: T) => React.ReactNode
  >;
  /**
   * Optional rich empty state
   */
  emptyState?: {
    icon?: React.ReactNode;
    message?: string;
    description?: string;
  };
}

const getColumnValue = <T extends GlassDataTableRow>(
  row: T,
  column: ColumnDef<T>
): GlassDataTableCellValue => {
  if (column.accessorFn) {
    return column.accessorFn(row);
  }

  if (column.accessorKey) {
    return row[column.accessorKey];
  }

  return "";
};

/**
 * GlassDataTable component
 * A comprehensive data table with glassmorphism styling
 */
export const GlassDataTable = <T extends GlassDataTableRow = GlassDataTableRow>(
  props: GlassDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => {
  return <GlassDataTableInner {...props} />;
};

const GlassDataTableInnerBase = <
  T extends GlassDataTableRow = GlassDataTableRow,
>(
  {
    data: incomingData = [],
    columns: incomingColumns = [],
    loading = false,
    emptyMessage = "No data available",
    variant = "default",
    size = "md",
    sortable = true,
    filterable = false,
    searchable = true,
    searchPlaceholder = "Search...",
    pagination = true,
    pageSizeOptions: incomingPageSizeOptions = [10, 25, 50, 100],
    initialPageSize = 10,
    selectable = false,
    selectionMode = "multiple",
    selectedRows: incomingSelectedRows = [],
    onSelectionChange,
    onRowClick,
    getRowId = (_row, index = 0) => index.toString(),
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
    usageContext = "main",
    "aria-label": ariaLabel,
    ...restProps
  }: GlassDataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const data = Array.isArray(incomingData) ? incomingData : [];
  const columns = Array.isArray(incomingColumns) ? incomingColumns : [];
  const pageSizeOptions =
    Array.isArray(incomingPageSizeOptions) && incomingPageSizeOptions.length
      ? incomingPageSizeOptions
      : [initialPageSize];
  const selectedRows = Array.isArray(incomingSelectedRows)
    ? incomingSelectedRows
    : [];
  const tableRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [columnUsage, setColumnUsage] = useState<Record<string, number>>({});
  const [predictedSortColumn, setPredictedSortColumn] = useState<string | null>(
    null
  );
  const [adaptivePageSize, setAdaptivePageSize] = useState(initialPageSize);
  const [interactionHeatmap, setInteractionHeatmap] = useState<
    Record<string, number>
  >({});

  // Consciousness feature hooks - only initialize if features are enabled
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;
  const interactionRecorder =
    predictive || trackAchievements
      ? useInteractionRecorder(`glass-datatable-${usageContext}`)
      : null;
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const activePageSize = Math.max(
    1,
    Number.isFinite(biometricResponsive ? adaptivePageSize : pageSize)
      ? biometricResponsive
        ? adaptivePageSize
        : pageSize
      : 10
  );

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      tableRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

  // Ensure size is always valid
  const validSize = size && ["sm", "md", "lg"].includes(size) ? size : "md";

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
    const interval = setInterval(adaptTable, ANIMATION.DURATION.slower * 7);
    return () => clearInterval(interval);
  }, [biometricResponsive, biometricAdapter, initialPageSize]);

  // Predictive sorting based on column usage patterns
  useEffect(() => {
    if (!predictive || !predictiveEngine) return;

    const updatePredictions = () => {
      const predictions = predictiveEngine.predictions;
      const sortPrediction = predictions.find(
        (p) => p.type === "suggest" && p.metadata?.tableContext === usageContext
      );

      if (sortPrediction && sortPrediction.confidence > 0.8) {
        const columnId = sortPrediction.metadata.columnId;
        setPredictedSortColumn(typeof columnId === "string" ? columnId : null);
      } else {
        setPredictedSortColumn(null);
      }
    };

    const interval = setInterval(
      updatePredictions,
      ANIMATION.DURATION.slower * 4
    );
    updatePredictions(); // Initial update

    return () => clearInterval(interval);
  }, [predictive, predictiveEngine, usageContext]);

  // Eye tracking for data attention analysis
  useEffect(() => {
    if (!gazeResponsive || !eyeTracker || !tableRef.current) return;

    const handleCellGaze = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      const cellElement = target?.closest("td");
      if (!cellElement) return;
      const rowElement = cellElement.parentElement;
      const rowGroupElement = rowElement?.parentElement;
      if (!rowElement || !rowGroupElement) return;

      const rowIndex = Array.from(rowGroupElement.children).indexOf(rowElement);
      const cellIndex = Array.from(rowElement.children).indexOf(cellElement);
      const heatmapKey = `${rowIndex}-${cellIndex}`;

      setInteractionHeatmap((prev) => ({
        ...prev,
        [heatmapKey]: (prev[heatmapKey] || 0) + 1,
      }));

      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("cell_attention", {
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
    sm: "glass-text-xs",
    md: "glass-text-sm",
    lg: "glass-text-base",
  };

  const cellPaddingClasses = {
    sm: "glass-px-3 glass-py-2",
    md: "glass-px-4 glass-py-3",
    lg: "glass-px-6 glass-py-4",
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...(data || [])];

    // Apply search
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = getColumnValue(row, column);
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filterState).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find((col) => col.id === columnId);
        if (column) {
          result = result.filter((row) => {
            const value = getColumnValue(row, column);
            return String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
          });
        }
      }
    });

    return result;
  }, [data, columns, searchQuery, filterState]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState || !filteredData) return filteredData || [];

    const column = columns.find(
      (col) => (col.id || `col-${columns.indexOf(col)}`) === sortState.id
    );
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getColumnValue(a, column);
      const bValue = getColumnValue(b, column);
      const aComparable =
        typeof aValue === "number" || typeof aValue === "string"
          ? aValue
          : String(aValue);
      const bComparable =
        typeof bValue === "number" || typeof bValue === "string"
          ? bValue
          : String(bValue);

      if (aComparable < bComparable) return sortState.desc ? 1 : -1;
      if (aComparable > bComparable) return sortState.desc ? -1 : 1;
      return 0;
    });
  }, [filteredData, sortState, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination || !sortedData) return sortedData || [];

    const startIndex = (currentPage - 1) * activePageSize;
    return sortedData.slice(startIndex, startIndex + activePageSize);
  }, [sortedData, currentPage, activePageSize, pagination]);

  const totalPages = Math.max(
    1,
    Math.ceil(((sortedData || [])?.length || 0) / activePageSize)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Enhanced sorting with consciousness tracking
  const handleSort = useCallback(
    (columnId: string) => {
      const column = columns.find(
        (col) => (col.id || `col-${columns.indexOf(col)}`) === columnId
      );
      if (!column?.sortable && !sortable) return;

      // Track column usage for predictive sorting
      if (predictive) {
        setColumnUsage((prev) => ({
          ...prev,
          [columnId]: (prev[columnId] || 0) + 1,
        }));
      }

      // Record interaction for learning
      if (interactionRecorder) {
        interactionRecorder.recordClick({
          target: { id: `column-sort-${columnId}` },
          currentTarget: document.createElement("div"),
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
          nativeEvent: new MouseEvent("click"),
          persist: () => {},
        } as unknown as React.MouseEvent<Element>);
      }

      // Track achievements
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction("table_sort", {
          columnId,
          usage: (columnUsage[columnId] || 0) + 1,
          context: usageContext,
        });
      }

      // Play spatial audio feedback
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("sort_column");
      }

      setSortState((prev) => {
        if (prev?.id === columnId) {
          return prev.desc ? null : { id: columnId, desc: true };
        }
        return { id: columnId, desc: false };
      });
    },
    [
      columns,
      sortable,
      predictive,
      interactionRecorder,
      achievementTracker,
      trackAchievements,
      spatialAudioEngine,
      audioFeedback,
      columnUsage,
      usageContext,
    ]
  );

  // Handle selection
  const handleRowSelection = (rowId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    if (selectionMode === "single") {
      onSelectionChange(selected ? [rowId] : []);
    } else {
      const newSelection = selected
        ? [...selectedRows, rowId]
        : selectedRows.filter((id) => id !== rowId);
      onSelectionChange(newSelection);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return;

    if (selected) {
      const allIds = (paginatedData || []).map((row, index) =>
        getRowId(row, index)
      );
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const isAllSelected =
    (paginatedData || []).length > 0 &&
    (paginatedData || []).every((row, index) =>
      selectedRows.includes(getRowId(row, index))
    );

  return (
    <div
      data-glass-component
      ref={setContainerRef}
      className={cn("w-full", className)}
      aria-label={ariaLabel}
      {...restProps}
    >
      {/* Table header with search and actions */}
      {(searchable || actions || filterable) && (
        <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-mb-4">
          <div className="glass-flex glass-min-w-0 glass-flex-1 glass-items-center glass-gap-3">
            {searchable && (
              <GlassInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                clearable
                className="glass-w-full sm:glass-w-64"
              />
            )}
          </div>

          {actions && (
            <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table container */}
      <OptimizedGlass
        elevation={"level2"}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "glass-overflow-hidden glass-contrast-guard",
          !prefersReducedMotion &&
            `transition-all duration-[${ANIMATION.DURATION.slow}ms]`,
          variant === "bordered" && "border border-border/20"
        )}
      >
        <div className="glass-w-full glass-overflow-x-auto">
          <table
            className="glass-w-full glass-table-fixed"
            style={{
              minWidth:
                columns.length > 3
                  ? `${Math.max(640, columns.length * 152)}px`
                  : "100%",
            }}
          >
            {/* Table header */}
            <thead
              className={cn(
                "relative bg-muted/20 border-b border-border/20",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
              <tr>
                {selectable && (
                  <th className={cn("w-12", cellPaddingClasses[validSize])}>
                    <GlassInput
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="glass-radius-md glass-border-glass-border glass-focus-ring-primary"
                    />
                  </th>
                )}

                {(columns || []).map((column, index) => {
                  const columnId = column.id || `col-${index}`;
                  const canSort = column.sortable ?? sortable;
                  const headerContent =
                    typeof column.header === "function"
                      ? column.header({ column })
                      : column.header;

                  return (
                    <th
                      key={columnId}
                      scope="col"
                      aria-sort={
                        sortState?.id === columnId
                          ? sortState.desc
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                      className={cn(
                        "font-semibold text-foreground border-b border-border/10",
                        !prefersReducedMotion &&
                          `transition-all duration-[${ANIMATION.DURATION.fast}ms]`,
                        cellPaddingClasses[validSize],
                        sizeClasses[validSize],
                        {
                          "text-center": column.align === "center",
                          "text-right": column.align === "right",
                          "cursor-pointer hover:bg-muted/10 hover:text-foreground":
                            canSort,
                        }
                      )}
                      style={{ width: column.width }}
                      onClick={() => canSort && handleSort(columnId)}
                    >
                      <div className="glass-flex glass-items-center glass-gap-2 glass-min-w-0">
                        <ContrastGuard>
                          <span className="glass-min-w-0 glass-break-words">
                            {headerContent}
                          </span>
                        </ContrastGuard>

                        {canSort && (
                          <div className="glass-flex glass-flex-col">
                            <svg
                              className={cn(
                                "w-3 h-3 -glass-mb-1",
                                !prefersReducedMotion && "transition-colors",
                                sortState?.id === columnId && !sortState.desc
                                  ? "text-primary"
                                  : "glass-text-secondary hover:text-foreground"
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                            <svg
                              className={cn(
                                "w-3 h-3 rotate-180",
                                !prefersReducedMotion && "transition-colors",
                                sortState?.id === columnId && sortState.desc
                                  ? "text-primary"
                                  : "glass-text-secondary hover:text-foreground"
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
                    className={cn("text-center", cellPaddingClasses[validSize])}
                  >
                    <div
                      className="glass-flex glass-items-center glass-justify-center glass-gap-2 glass-py-8"
                      role="status"
                      aria-live="polite"
                    >
                      <div
                        className={cn(
                          "glass-w-4 glass-h-4 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full",
                          !prefersReducedMotion && "glass-animate-spin"
                        )}
                      />
                      <ContrastGuard>
                        <span className="glass-text-secondary">Loading...</span>
                      </ContrastGuard>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className={cn(
                      "text-center glass-text-secondary py-8 glass-break-words",
                      cellPaddingClasses[validSize]
                    )}
                  >
                    {emptyState ? (
                      <div className="glass-flex glass-flex-col glass-items-center glass-gap-2">
                        {emptyState.icon}
                        <ContrastGuard>
                          <div className="glass-font-medium">
                            {emptyState.message || emptyMessage}
                          </div>
                        </ContrastGuard>
                        {emptyState.description && (
                          <ContrastGuard>
                            <div className="glass-text-sm glass-text-secondary">
                              {emptyState.description}
                            </div>
                          </ContrastGuard>
                        )}
                      </div>
                    ) : (
                      <ContrastGuard>{emptyMessage}</ContrastGuard>
                    )}
                  </td>
                </tr>
              ) : (
                (paginatedData || []).map((row, index) => {
                  const rowId = getRowId(row, index);
                  const isSelected = selectedRows.includes(rowId);
                  const rowProps = getRowProps?.(row) || {};

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        "group glass-radius-md",
                        !prefersReducedMotion &&
                          `transition-all duration-[${ANIMATION.DURATION.fast}ms]`,
                        {
                          "bg-muted/5":
                            variant === "striped" && index % 2 === 1,
                          "bg-primary/10 shadow-md shadow-primary/20 ring-1 ring-primary/20":
                            isSelected,
                          "hover:bg-muted/10 cursor-pointer hover:shadow-lg hover:shadow-primary/10 glass-hover--translate-y-0-5 hover:ring-1 hover:ring-white/10":
                            onRowClick && !prefersReducedMotion,
                          "hover:bg-muted/10 cursor-pointer hover:ring-1 hover:ring-white/10":
                            onRowClick && prefersReducedMotion,
                          // Consciousness feature styles
                          "ring-1 ring-blue-400/20 bg-blue-400/5":
                            gazeResponsive &&
                            interactionHeatmap[`${index}-0`] > 5,
                          "animate-pulse":
                            predictedSortColumn &&
                            columns.some(
                              (col) =>
                                (col.id || `col-${columns.indexOf(col)}`) ===
                                predictedSortColumn
                            ),
                          "transform-gpu":
                            gazeResponsive || biometricResponsive,
                        }
                      )}
                      onClick={(e) => onRowClick?.(row)}
                      {...rowProps}
                    >
                      {selectable && (
                        <td className={cellPaddingClasses[validSize]}>
                          <GlassInput
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleRowSelection(rowId, e.target.checked)
                            }
                            className="glass-radius-md glass-border-glass-border glass-focus-ring-primary"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}

                      {(columns || []).map((column, colIndex) => {
                        const columnId = column.id || `col-${colIndex}`;
                        const value = getColumnValue(row, column);

                        return (
                          <td
                            key={columnId}
                            className={cn(
                              "border-b border-border/5 text-foreground/80 glass-align-top glass-break-words group-hover:text-foreground",
                              !prefersReducedMotion && "transition-colors",
                              cellPaddingClasses[validSize],
                              sizeClasses[validSize],
                              {
                                "text-center": column.align === "center",
                                "text-right": column.align === "right",
                              }
                            )}
                          >
                            <div className="glass-min-w-0 glass-max-w-full glass-break-words">
                              <ContrastGuard>
                                {column.cell
                                  ? column.cell({ row, value })
                                  : (() => {
                                      const rendererKey =
                                        column.id ||
                                        (column.accessorKey as string) ||
                                        "";
                                      const renderer =
                                        cellRenderers?.[rendererKey];
                                      return renderer
                                        ? renderer(value, row)
                                        : String(value ?? "");
                                    })()}
                              </ContrastGuard>
                            </div>
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
          <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-px-4 glass-py-3 glass-border-t glass-border-glass-border/10 glass-surface-subtle">
            <div className="glass-flex glass-items-center glass-gap-2">
              <span
                className="glass-text-sm glass-text-secondary"
                role="status"
              >
                Showing {(currentPage - 1) * activePageSize + 1} to{" "}
                {Math.min(
                  currentPage * activePageSize,
                  (sortedData || []).length
                )}{" "}
                of {(sortedData || []).length} results
              </span>
            </div>

            <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4">
              <div className="glass-flex glass-items-center glass-gap-2">
                <ContrastGuard>
                  <span className="glass-text-sm glass-text-secondary">
                    Rows per page:
                  </span>
                </ContrastGuard>
                <GlassSelect
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  options={(pageSizeOptions || []).map((size) => ({
                    value: size,
                    label: size.toString(),
                  }))}
                  size="sm"
                />
              </div>

              <div className="glass-flex glass-items-center glass-gap-1">
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
                  onClick={(e) => setCurrentPage((p) => p - 1)}
                  aria-label="Previous page"
                />

                <ContrastGuard>
                  <span className="glass-px-3 glass-py-1 glass-text-sm">
                    {currentPage} of {totalPages}
                  </span>
                </ContrastGuard>

                <IconButton
                  icon="›"
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={(e) => setCurrentPage((p) => p + 1)}
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
};

const GlassDataTableInner = forwardRef(GlassDataTableInnerBase) as (<
  T extends GlassDataTableRow = GlassDataTableRow,
>(
  props: GlassDataTableProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null) & { displayName?: string };

GlassDataTableInner.displayName = "GlassDataTable";

/**
 * Enhanced GlassDataTable with consciousness features enabled by default
 * Use this for tables that should be intelligent and adaptive
 */
export const ConsciousGlassDataTable = <
  T extends GlassDataTableRow = GlassDataTableRow,
>(
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
export const PredictiveDataTable = <
  T extends GlassDataTableRow = GlassDataTableRow,
>(
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
export const GazeResponsiveDataTable = <
  T extends GlassDataTableRow = GlassDataTableRow,
>(
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
export const AccessibleDataTable = <
  T extends GlassDataTableRow = GlassDataTableRow,
>(
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
