"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useMemo,
  createRef,
  useCallback,
  CSSProperties,
} from "react";
import { GlassDataGridProps, SortState } from "./types";

// Stub implementations for missing hooks
const useSortableData = (data: any[], sortConfig: SortState | null) => ({
  sortedData: data,
  sortConfig,
  handleSort: () => {},
});

const useDraggableListPhysics = (options: any) => ({
  styles: {} as Record<number, CSSProperties>,
  getHandlers: () => ({}),
  isDragging: false,
  draggedIndex: -1,
});

const useVectorSpring = (options: any) => ({
  start: () => {},
  value: options?.initialValue || { x: 0, y: 0, z: 0 },
  setValue: () => {},
});
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import styles from "./GlassDataGrid.module.css";

// Define the component using forwardRef
export const GlassDataGrid = forwardRef<HTMLDivElement, GlassDataGridProps>(
  (props, ref) => {
    // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

    const {
      data: initialData = [],
      columns = [],
      className,
      style,
      height,
      initialSort,
      enableRowDragging = false,
      onRowOrderChange,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...restProps
    } = props;
    const safeInitialData = Array.isArray(initialData) ? initialData : [];
    const safeColumns = Array.isArray(columns) ? columns : [];
    const {
      sortedData: unsortedData = safeInitialData,
      sortConfig,
      handleSort,
    } = useSortableData(safeInitialData, initialSort as SortState);
    const normalizedSortedData = Array.isArray(unsortedData)
      ? unsortedData
      : safeInitialData;

    // Create refs for each row element for the physics hook
    const rowRefs = useMemo(
      () =>
        Array.from({ length: normalizedSortedData?.length || 0 }, () =>
          createRef<HTMLTableRowElement>()
        ),
      [normalizedSortedData?.length]
    );

    // Need state for the order controlled by the hook
    const [renderOrder, setRenderOrder] = useState<number[]>(() =>
      Array.from({ length: normalizedSortedData.length }, (_, i) => i)
    );

    useEffect(() => {
      setRenderOrder((previous) => {
        if (previous.length === normalizedSortedData.length) {
          return previous;
        }
        return Array.from({ length: normalizedSortedData.length }, (_, i) => i);
      });
    }, [normalizedSortedData.length]);

    // Display data based on renderOrder
    const displayData = useMemo(
      () =>
        (renderOrder || [])
          .map((index: any) => normalizedSortedData?.[index])
          .filter((row) => row !== undefined),
      [normalizedSortedData, renderOrder]
    );

    // Callback for the hook to update our renderOrder
    const handleOrderUpdate = useCallback(
      (newOrderIndices: number[]) => {
        setRenderOrder(newOrderIndices);
        if (onRowOrderChange) {
          // Map original data based on the new order of *original* indices
          const originalDataInNewOrder = newOrderIndices
            .map((originalIndex: any) => safeInitialData?.[originalIndex])
            .filter((row) => row !== undefined);
          onRowOrderChange(originalDataInNewOrder);
        }
      },
      [onRowOrderChange, safeInitialData]
    );

    const {
      styles: rowStyles,
      getHandlers,
      isDragging: isAnyItemDragging,
      draggedIndex: draggedOriginalItemIndex,
    } = useDraggableListPhysics({
      itemRefs: rowRefs,
      onOrderChange: handleOrderUpdate,
      spacing: 0,
      direction: "vertical",
    });

    // --- Sort Indicator Animation using useVectorSpring ---
    const sortIndicatorSpring = useVectorSpring({
      config: {
        tension: 350, // Use tension/friction for config
        friction: 25,
      },
      // initialValue: { x: 0, y: 0, z: 0 } // Optional initial value
    });
    // Map sorting state to target value for animation hook
    const sortTargetValue = useMemo(() => {
      if (!sortConfig) return 0; // Target 0 when not sorted
      return sortConfig.direction === "asc" ? 1 : -1; // Target 1 for asc -1 for desc
    }, [sortConfig]);
    // Trigger animation when target changes
    useEffect(() => {
      // Set the target Y value of the vector spring
      sortIndicatorSpring.start();
    }, [sortTargetValue, sortIndicatorSpring]);
    // --- End Sort Indicator Animation ---

    const handleHeaderKeyDown = (
      event: React.KeyboardEvent<HTMLTableCellElement>
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        // handleSort would need to be updated to work without parameters
        // For now, we'll skip this functionality
      }
    };

    const totalColumns = safeColumns.length + (enableRowDragging ? 1 : 0);
    const hasData = displayData.length > 0;

    if (!safeColumns.length) {
      return (
        <OptimizedGlass
          data-glass-component
          ref={ref}
          intent="neutral"
          elevation="level2"
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          className={cn("glass-w-full glass-p-6 glass-text-center", className)}
          style={style}
          role="region"
          aria-label={ariaLabel || "Data Grid"}
          data-testid={dataTestId}
          {...restProps}
        >
          <p className="glass-text-sm glass-text-secondary">
            No columns configured for this data grid.
          </p>
        </OptimizedGlass>
      );
    }

    return (
      <OptimizedGlass
        data-glass-component
        ref={ref}
        intent="neutral"
        elevation="level2"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "glass-w-full glass-overflow-hidden",
          height && "glass-overflow-y-auto",
          className
        )}
        style={{
          ...style,
          ...(height && {
            height: typeof height === "number" ? `${height}px` : height,
          }),
          perspective: "1000px",
        }}
        data-testid={dataTestId}
        {...restProps}
      >
        <table
          className={styles.table}
          role="table"
          aria-label={ariaLabel || "Data Grid"}
        >
          <thead>
            <tr className={styles.headerRow}>
              {/* Add placeholder header for drag handle if enabled */}
              {enableRowDragging && (
                <th
                  className={cn(styles.headerCell, styles.dragHandleCell)}
                  aria-hidden="true"
                ></th>
              )}
              {safeColumns.map((col) => {
                // Determine if this column is the one being sorted
                const isSortingThisColumn = sortConfig?.key === col.key;
                const currentSortDirection =
                  sortConfig && isSortingThisColumn
                    ? sortConfig.direction
                    : null;
                const isSortable = col.sortable;

                // Calculate indicator style based on animation value (from spring.value.y)
                const animValue = sortIndicatorSpring.value.y; // Get the animated value from the Y dimension
                const indicatorOpacity = Math.min(1, Math.abs(animValue) * 1.5); // Fade in/out
                const indicatorTranslateYPercent = -50 + animValue * -10; // Vertical movement
                const indicatorScale = 0.8 + Math.abs(animValue) * 0.2; // Scale effect
                const indicatorStyle: CSSProperties = {
                  opacity: indicatorOpacity,
                  transform: `translateY(${indicatorTranslateYPercent}%) scale(${indicatorScale})`,
                };

                const headerClassName = cn(
                  styles.headerCell,
                  isSortable && styles.headerSortable
                );

                return (
                  <th
                    key={col.id}
                    className={headerClassName}
                    onClick={() => isSortable && handleSort()}
                    tabIndex={isSortable ? 0 : -1}
                    onKeyDown={(e) => handleHeaderKeyDown(e)}
                    role="columnheader"
                    aria-sort={
                      isSortable
                        ? currentSortDirection === "asc"
                          ? "ascending"
                          : currentSortDirection === "desc"
                            ? "descending"
                            : "none"
                        : undefined
                    }
                  >
                    {col.header}
                    <span
                      className={styles.sortIndicator}
                      style={{
                        opacity: indicatorOpacity,
                        transform: `translateY(${indicatorTranslateYPercent}%) scale(${indicatorScale})`,
                      }}
                      aria-hidden={!isSortingThisColumn}
                    >
                      {sortTargetValue > 0 ? "▲" : "▼"}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          {/* Use a relative positioned div for tbody content if rows are absolute */}
          <tbody className={styles.body}>
            {hasData ? (
              displayData.map((row, displayIndex) => {
                const originalIndex = renderOrder?.[displayIndex];
                if (originalIndex === undefined) return null;

                const rowStyle = rowStyles?.[originalIndex] || {};
                const handlers = enableRowDragging
                  ? getHandlers()
                  : { onPointerDown: () => {}, onKeyDown: () => {} };

                const isDraggingThisRow =
                  isAnyItemDragging &&
                  draggedOriginalItemIndex === originalIndex;

                const rowClassName = cn(
                  styles.row,
                  isDraggingThisRow && styles.rowDragging
                );

                return (
                  <tr
                    key={`row-${row?.id ?? originalIndex}`}
                    ref={rowRefs?.[originalIndex]}
                    style={rowStyle}
                    className={rowClassName}
                  >
                    {enableRowDragging && (
                      <td className={cn(styles.cell, styles.dragHandleCell)}>
                        <span
                          {...handlers}
                          tabIndex={0}
                          role="button"
                          aria-label={`Drag row ${displayIndex + 1}`}
                          aria-grabbed={isDraggingThisRow}
                          data-drag-handle="true"
                          className={cn(
                            styles.dragHandle,
                            isDraggingThisRow && styles.dragHandleActive
                          )}
                        >
                          ⠿
                        </span>
                      </td>
                    )}
                    {safeColumns.map((col) => (
                      <td
                        key={`${col.id}-${originalIndex}`}
                        className={styles.cell}
                      >
                        {col.cellRenderer
                          ? col.cellRenderer(
                              row?.[col.accessorKey as keyof typeof row],
                              row
                            )
                          : (row?.[col.accessorKey as keyof typeof row] ??
                            col.placeholder ??
                            "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className={styles.cell} colSpan={Math.max(1, totalColumns)}>
                  <div className="glass-text-sm glass-text-secondary text-center">
                    No data available.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </OptimizedGlass>
    );
  }
);

// Add display name for better debugging
GlassDataGrid.displayName = "GlassDataGrid";
