"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { Motion, OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface HeatmapCell {
  row: number;
  col: number;
  value: number;
  normalizedValue: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface HeatmapColorScale {
  min: string;
  mid?: string;
  max: string;
  steps?: number;
}

export interface HeatmapAxis {
  labels: string[];
  title?: string;
  tickCount?: number;
  format?: (value: unknown) => string;
}

type PreventableEvent = Pick<React.SyntheticEvent, "preventDefault">;

export interface GlassHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Heatmap data */
  data: HeatmapDataPoint[] | number[][];
  /** X-axis configuration */
  xAxis?: HeatmapAxis;
  /** Y-axis configuration */
  yAxis?: HeatmapAxis;
  /** Color scale configuration */
  colorScale?: HeatmapColorScale;
  /** Cell size in pixels */
  cellSize?: number;
  /** Gap between cells */
  cellGap?: number;
  /** Whether to show cell values */
  showValues?: boolean;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show tooltips */
  showTooltips?: boolean;
  /** Whether to enable cell selection */
  selectable?: boolean;
  /** Selected cells */
  selectedCells?: Array<{ row: number; col: number }>;
  /** Selection change handler */
  onSelectionChange?: (cells: Array<{ row: number; col: number }>) => void;
  /** Cell click handler */
  onCellClick?: (cell: HeatmapCell) => void;
  /** Cell hover handler */
  onCellHover?: (cell: HeatmapCell | null) => void;
  /** Custom cell renderer */
  renderCell?: (cell: HeatmapCell) => React.ReactNode;
  /** Custom tooltip renderer */
  renderTooltip?: (cell: HeatmapCell) => React.ReactNode;
  /** Whether to enable zoom */
  zoomable?: boolean;
  /** Zoom level */
  zoomLevel?: number;
  /** Zoom change handler */
  onZoomChange?: (level: number) => void;
  /** Whether to show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: "top" | "bottom" | "left" | "right";
  /** Whether to enable animation */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

const heatmapSurfaceStyle: React.CSSProperties = {
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
  border: "1px solid rgba(148, 163, 184, 0.2)",
  boxShadow:
    "0 12px 30px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
};

const heatmapInsetStyle: React.CSSProperties = {
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
};

export const GlassHeatmap = forwardRef<HTMLDivElement, GlassHeatmapProps>(
  (
    {
      data: incomingData = [],
      xAxis,
      yAxis,
      colorScale = {
        min: "#38bdf8",
        max: "#f43f5e",
      },
      cellSize = 12,
      cellGap = 1,
      showValues = false,
      showGrid = true,
      showTooltips = true,
      selectable = false,
      selectedCells: incomingSelectedCells = [],
      onSelectionChange,
      onCellClick,
      onCellHover,
      renderCell,
      renderTooltip,
      zoomable = false,
      zoomLevel = 1,
      onZoomChange,
      showLegend = true,
      legendPosition = "bottom",
      animated = true,
      animationDuration = ANIMATION.DURATION.slow,
      respectMotionPreference = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const data = Array.isArray(incomingData) ? incomingData : [];
    const selectedCells = Array.isArray(incomingSelectedCells)
      ? incomingSelectedCells
      : [];
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const heatmapId = useA11yId("glass-heatmap");

    const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [internalZoomLevel, setInternalZoomLevel] = useState(zoomLevel);

    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapRef = useRef<HTMLDivElement>(null);

    // Process data into normalized format
    const processedData = useMemo(() => {
      let cells: HeatmapCell[] = [];
      let minValue = Infinity;
      let maxValue = -Infinity;

      if (!Array.isArray(data) || data.length === 0) {
        return { cells: [], minValue: 0, maxValue: 0, range: 1 };
      }

      const firstEntry = data[0];

      if (Array.isArray(firstEntry)) {
        // Handle 2D array format
        const matrix = data as number[][];
        matrix.forEach((row, rowIndex) => {
          (Array.isArray(row) ? row : []).forEach((value, colIndex) => {
            minValue = Math.min(minValue, value);
            maxValue = Math.max(maxValue, value);
            cells.push({
              row: rowIndex,
              col: colIndex,
              value,
              normalizedValue: 0, // Will be calculated after we know min/max
            });
          });
        });
      } else {
        // Handle data points format
        const points = data as HeatmapDataPoint[];
        points.forEach((point) => {
          if (typeof point?.value !== "number") return;
          minValue = Math.min(minValue, point.value);
          maxValue = Math.max(maxValue, point.value);
          cells.push({
            row: point.y ?? 0,
            col: point.x ?? 0,
            value: point.value,
            normalizedValue: 0, // Will be calculated after we know min/max
            label: point.label,
            metadata: point.metadata,
          });
        });
      }

      if (cells.length === 0) {
        return { cells: [], minValue: 0, maxValue: 0, range: 1 };
      }

      // Normalize values
      const range = maxValue - minValue || 1;
      cells = cells.map((cell) => ({
        ...cell,
        normalizedValue: (cell.value - minValue) / range,
      }));

      return { cells, minValue, maxValue, range };
    }, [data]);

    const hasCells = processedData.cells.length > 0;

    // Get grid dimensions
    const gridDimensions = useMemo(() => {
      if (!processedData.cells.length) {
        return { rows: 0, cols: 0 };
      }
      const maxRow = Math.max(...processedData.cells.map((c) => c.row)) + 1;
      const maxCol = Math.max(...processedData.cells.map((c) => c.col)) + 1;
      return { rows: maxRow, cols: maxCol };
    }, [processedData.cells]);

    // Generate color from normalized value
    const getColor = useCallback(
      (normalizedValue: number) => {
        const { min, mid, max, steps = 100 } = colorScale;

        if (mid) {
          // Three-color gradient
          if (normalizedValue <= 0.5) {
            return interpolateColor(min, mid, normalizedValue * 2);
          } else {
            return interpolateColor(mid, max, (normalizedValue - 0.5) * 2);
          }
        } else {
          // Two-color gradient
          return interpolateColor(min, max, normalizedValue);
        }
      },
      [colorScale]
    );

    // Color interpolation utility
    const interpolateColor = useCallback(
      (color1: string, color2: string, factor: number) => {
        const resolveColor = (color: string, fallback: string) => {
          const trimmed = color.trim();
          if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
          if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
            return `#${trimmed
              .slice(1)
              .split("")
              .map((part) => `${part}${part}`)
              .join("")}`;
          }
          if (trimmed.includes("--glass-color-primary")) return "#38bdf8";
          if (trimmed.includes("--glass-color-success")) return "#22c55e";
          if (trimmed.includes("--glass-color-warning")) return "#f59e0b";
          if (trimmed.includes("--glass-color-danger")) return "#f43f5e";
          if (trimmed.includes("--glass-gray-500")) return "#64748b";
          const rgbMatch = trimmed.match(
            /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/
          );
          if (rgbMatch) {
            return `#${[rgbMatch[1], rgbMatch[2], rgbMatch[3]]
              .map((value) => Number(value).toString(16).padStart(2, "0"))
              .join("")}`;
          }
          return fallback;
        };

        const hex1 = resolveColor(color1, "#38bdf8").replace("#", "");
        const hex2 = resolveColor(color2, "#f43f5e").replace("#", "");

        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);

        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      },
      []
    );

    // Handle cell interactions
    const handleCellClick = useCallback(
      (cell: HeatmapCell, event: React.MouseEvent) => {
        if (selectable) {
          const cellId = { row: cell.row, col: cell.col };
          const isSelected = selectedCells.some(
            (c) => c.row === cell.row && c.col === cell.col
          );

          let newSelection: Array<{ row: number; col: number }>;
          if (event.ctrlKey || event.metaKey) {
            // Multi-select
            newSelection = isSelected
              ? selectedCells.filter(
                  (c) => !(c.row === cell.row && c.col === cell.col)
                )
              : [...selectedCells, cellId];
          } else {
            // Single select
            newSelection = isSelected ? [] : [cellId];
          }

          onSelectionChange?.(newSelection);
        }

        onCellClick?.(cell);
      },
      [selectable, selectedCells, onSelectionChange, onCellClick]
    );

    const handleCellHover = useCallback(
      (cell: HeatmapCell | null, event?: React.MouseEvent) => {
        setHoveredCell(cell);
        onCellHover?.(cell);

        if (cell && event && showTooltips) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPosition({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        }
      },
      [onCellHover, showTooltips]
    );

    // Handle zoom
    const handleZoom = useCallback(
      (delta: number, event?: PreventableEvent) => {
        if (!zoomable) return;

        event?.preventDefault();
        const newZoom = Math.max(0.5, Math.min(3, internalZoomLevel + delta));
        setInternalZoomLevel(newZoom);
        onZoomChange?.(newZoom);
      },
      [zoomable, internalZoomLevel, onZoomChange]
    );

    // Check if cell is selected
    const isCellSelected = useCallback(
      (row: number, col: number) => {
        return selectedCells.some((c) => c.row === row && c.col === col);
      },
      [selectedCells]
    );

    // Default cell renderer
    const defaultRenderCell = useCallback(
      (cell: HeatmapCell) => {
        const isSelected = isCellSelected(cell.row, cell.col);
        const isHovered =
          hoveredCell?.row === cell.row && hoveredCell?.col === cell.col;
        const cellColor = getColor(cell.normalizedValue);

        return (
          <OptimizedGlass
            elevation="level1"
            intensity="subtle"
            depth={1}
            tint="neutral"
            border="subtle"
            className={cn(
              "glass-heatmap-cell glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-medium transition-all",
              "glass-cursor-pointer hover:scale-110 hover:z-10",
              isSelected && "ring-2 ring-primary ring-offset-1",
              isHovered && "shadow-lg scale-110 z-20",
              showGrid && "glass-border glass-border-glass-border/20"
            )}
            style={{
              backgroundColor: cellColor,
              color:
                cell.normalizedValue > 0.5
                  ? "var(--glass-white)"
                  : "var(--glass-black)",
              width: cellSize * internalZoomLevel,
              height: cellSize * internalZoomLevel,
              fontSize: `${Math.max(8, cellSize * internalZoomLevel * 0.4)}px`,
            }}
            onClick={(e: React.MouseEvent) => handleCellClick(cell, e)}
            onMouseEnter={(e: React.MouseEvent) => handleCellHover(cell, e)}
            onMouseLeave={() => handleCellHover(null)}
          >
            {showValues && (
              <span className="glass-select-none">
                {typeof cell.value === "number"
                  ? cell.value.toFixed(1)
                  : cell.value}
              </span>
            )}
          </OptimizedGlass>
        );
      },
      [
        isCellSelected,
        hoveredCell,
        getColor,
        cellSize,
        internalZoomLevel,
        showGrid,
        showValues,
        handleCellClick,
        handleCellHover,
      ]
    );

    // Default tooltip renderer
    const defaultRenderTooltip = useCallback(
      (cell: HeatmapCell) => {
        return (
          <OptimizedGlass
            elevation="level3"
            intensity="strong"
            depth={3}
            tint="neutral"
            border="strong"
            className="glass-heatmap-tooltip glass-p-3 glass-radius-lg glass-shadow-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
            style={heatmapSurfaceStyle}
          >
            <div className="glass-text-sm glass-gap-1">
              <ContrastGuard>
                <div className="glass-font-semibold">
                  {cell.label || `Cell (${cell.col}, ${cell.row})`}
                </div>
                <div>Value: {cell.value}</div>
                {xAxis?.labels?.[cell.col] && (
                  <div>X: {xAxis.labels[cell.col]}</div>
                )}
                {yAxis?.labels?.[cell.row] && (
                  <div>Y: {yAxis.labels[cell.row]}</div>
                )}
                {cell.metadata &&
                  Object.entries(cell.metadata).map(([key, value]) => (
                    <div key={key}>
                      {key}: {String(value)}
                    </div>
                  ))}
              </ContrastGuard>
            </div>
          </OptimizedGlass>
        );
      },
      [xAxis, yAxis]
    );

    // Render legend
    const renderLegend = useCallback(() => {
      if (!showLegend) return null;

      const legendSteps = 20;
      const isHorizontal =
        legendPosition === "top" || legendPosition === "bottom";

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            "glass-heatmap-legend glass-p-3 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-white/10 glass-surface-dark/50",
            isHorizontal
              ? "glass-flex glass-items-center glass-gap-3"
              : "glass-flex glass-flex-col glass-gap-3"
          )}
          style={heatmapSurfaceStyle}
        >
          <ContrastGuard>
            <div className="glass-text-sm glass-font-medium glass-text-primary">
              Legend
            </div>
          </ContrastGuard>

          <div
            className={cn(
              "glass-flex",
              isHorizontal
                ? "glass-flex-row glass-items-center glass-gap-2"
                : "glass-flex-col glass-gap-1"
            )}
          >
            <ContrastGuard>
              <div className="glass-text-xs glass-text-secondary">
                {processedData.minValue.toFixed(1)}
              </div>
            </ContrastGuard>

            <div
              className={cn(
                "glass-flex",
                isHorizontal ? "glass-flex-row" : "glass-flex-col"
              )}
            >
              {Array.from({ length: legendSteps }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "glass-flex-1",
                    isHorizontal ? "glass-w-3 glass-h-6" : "glass-w-6 glass-h-3"
                  )}
                  style={{
                    backgroundColor: getColor(i / (legendSteps - 1)),
                  }}
                />
              ))}
            </div>

            <ContrastGuard>
              <div className="glass-text-xs glass-text-secondary">
                {processedData.maxValue.toFixed(1)}
              </div>
            </ContrastGuard>
          </div>
        </OptimizedGlass>
      );
    }, [showLegend, legendPosition, processedData, getColor]);

    // Create grid matrix for rendering
    const gridMatrix = useMemo(() => {
      const matrix: Array<Array<HeatmapCell | null>> = Array(
        gridDimensions.rows
      )
        .fill(null)
        .map(() => Array(gridDimensions.cols).fill(null));

      processedData.cells.forEach((cell) => {
        if (cell.row < gridDimensions.rows && cell.col < gridDimensions.cols) {
          matrix[cell.row][cell.col] = cell;
        }
      });

      return matrix;
    }, [processedData.cells, gridDimensions]);

    return (
      <OptimizedGlass
        ref={ref}
        id={heatmapId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-heatmap glass-radius-lg glass-backdrop-blur-md glass-border glass-border-white/10 glass-overflow-hidden glass-w-full glass-min-w-0 glass-surface-dark/40",
          className
        )}
        style={{
          ...heatmapSurfaceStyle,
          ...style,
        }}
        {...props}
      >
        <Motion
          preset={
            !prefersReducedMotion && respectMotionPreference && animated
              ? "fadeIn"
              : "none"
          }
          className="glass-relative glass-w-full glass-min-w-0"
        >
          <div
            ref={containerRef}
            className={cn(
              "glass-flex",
              legendPosition === "left" && "glass-flex-row-reverse",
              legendPosition === "right" && "glass-flex-row",
              legendPosition === "top" && "glass-flex-col-reverse",
              legendPosition === "bottom" && "glass-flex-col"
            )}
            style={{ minWidth: 0 }}
          >
            {/* Legend */}
            {showLegend && (
              <div className="glass-flex-shrink-0 glass-p-3">
                {renderLegend()}
              </div>
            )}

            {/* Main Content */}
            <div
              className="glass-flex-1 glass-p-3 glass-overflow-auto glass-min-w-0 glass-radius-lg"
              style={heatmapInsetStyle}
            >
              {!hasCells ? (
                <ContrastGuard>
                  <div className="glass-text-sm glass-text-secondary glass-text-center glass-p-10">
                    No heatmap data available.
                  </div>
                </ContrastGuard>
              ) : (
                <div className="glass-flex glass-min-w-0">
                  {yAxis && (
                    <div className="glass-flex glass-flex-col glass-justify-between glass-mr-2">
                      {yAxis.title && (
                        <ContrastGuard>
                          <div className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2 glass-writing-mode-vertical-lr glass-transform glass-rotate-180">
                            {yAxis.title}
                          </div>
                        </ContrastGuard>
                      )}
                      <div className="glass-flex glass-flex-col glass-justify-between glass-h-full">
                        {yAxis.labels?.map((label, index) => (
                          <div
                            key={index}
                            className="glass-text-xs glass-text-secondary glass-text-right glass-pr-2"
                          >
                            <ContrastGuard>{label}</ContrastGuard>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Heatmap Grid */}
                  <div
                    ref={heatmapRef}
                    className="glass-relative"
                    onWheel={(e: React.WheelEvent) =>
                      handleZoom(e.deltaY > 0 ? -0.1 : 0.1, e)
                    }
                  >
                    {/* X-Axis */}
                    {xAxis && (
                      <div className="glass-mb-2">
                        {xAxis.title && (
                          <div className="glass-text-sm glass-font-medium glass-text-primary glass-text-center glass-mb-2">
                            {xAxis.title}
                          </div>
                        )}
                        <div
                          className="glass-flex glass-justify-between"
                          style={{
                            width:
                              (cellSize * internalZoomLevel + cellGap) *
                                gridDimensions.cols -
                              cellGap,
                          }}
                        >
                          {xAxis.labels?.map((label, index) => (
                            <div
                              key={index}
                              className="glass-text-xs glass-text-secondary glass-text-center"
                            >
                              <ContrastGuard>{label}</ContrastGuard>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grid */}
                    <div
                      className="glass-grid glass-gap-px"
                      style={{
                        gridTemplateColumns: `repeat(${gridDimensions.cols}, ${cellSize * internalZoomLevel}px)`,
                        gridTemplateRows: `repeat(${gridDimensions.rows}, ${cellSize * internalZoomLevel}px)`,
                        gap: `${cellGap}px`,
                      }}
                    >
                      {gridMatrix.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <Motion
                            key={`${rowIndex}-${colIndex}`}
                            preset={
                              !prefersReducedMotion &&
                              respectMotionPreference &&
                              animated
                                ? "scaleIn"
                                : "none"
                            }
                            delay={
                              animated
                                ? (rowIndex * gridDimensions.cols + colIndex) *
                                  10
                                : 0
                            }
                          >
                            {cell ? (
                              renderCell ? (
                                renderCell(cell)
                              ) : (
                                defaultRenderCell(cell)
                              )
                            ) : (
                              <div
                                className="glass-surface-overlay glass-border glass-border-dashed glass-border-glass-border/30"
                                style={{
                                  width: cellSize * internalZoomLevel,
                                  height: cellSize * internalZoomLevel,
                                }}
                              />
                            )}
                          </Motion>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tooltip */}
          {showTooltips && hoveredCell && (
            <div
              className="glass-absolute glass-pointer-events-none glass-z-50"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: "translateY(-100%)",
              }}
            >
              {renderTooltip
                ? renderTooltip(hoveredCell)
                : defaultRenderTooltip(hoveredCell)}
            </div>
          )}

          {/* Zoom Controls */}
          {zoomable && (
            <div className="glass-absolute glass-top-4 glass-right-4 glass-flex glass-flex-col glass-gap-1">
              <button
                onClick={() => handleZoom(0.1)}
                className="glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center glass-radius-md glass-text-sm glass-font-bold glass-transition-all glass-hover-scale-105 glass-focus glass-touch-target glass-contrast-guard"
              >
                +
              </button>
              <button
                onClick={() => handleZoom(-0.1)}
                className="glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center glass-radius-md glass-text-sm glass-font-bold glass-transition-all glass-hover-scale-105 glass-focus glass-touch-target glass-contrast-guard"
              >
                −
              </button>
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassHeatmap.displayName = "GlassHeatmap";

export default GlassHeatmap;
