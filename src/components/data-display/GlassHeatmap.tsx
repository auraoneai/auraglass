'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { Motion, OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface HeatmapCell {
  row: number;
  col: number;
  value: number;
  normalizedValue: number;
  label?: string;
  metadata?: Record<string, any>;
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
  format?: (value: any) => string;
}

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
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether to enable animation */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassHeatmap = forwardRef<HTMLDivElement, GlassHeatmapProps>(
  (
    {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      data,
      xAxis,
      yAxis,
      colorScale = { min: 'var(--glass-color-primary)', max: 'var(--glass-color-danger)' },
      cellSize = 20,
      cellGap = 1,
      showValues = false,
      showGrid = true,
      showTooltips = true,
      selectable = false,
      selectedCells = [],
      onSelectionChange,
      onCellClick,
      onCellHover,
      renderCell,
      renderTooltip,
      zoomable = false,
      zoomLevel = 1,
      onZoomChange,
      showLegend = true,
      legendPosition = 'right',
      animated = true,
      animationDuration = 500,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const heatmapId = useA11yId('glass-heatmap');
    
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

      if (Array.isArray(data[0])) {
        // Handle 2D array format
        const matrix = data as number[][];
        matrix.forEach((row, rowIndex) => {
          row.forEach((value, colIndex) => {
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
          minValue = Math.min(minValue, point.value);
          maxValue = Math.max(maxValue, point.value);
          cells.push({
            row: point.y,
            col: point.x,
            value: point.value,
            normalizedValue: 0, // Will be calculated after we know min/max
            label: point.label,
            metadata: point.metadata,
          });
        });
      }

      // Normalize values
      const range = maxValue - minValue || 1;
      cells = cells.map((cell: any) => ({
        ...cell,
        normalizedValue: (cell.value - minValue) / range
      }));

      return { cells, minValue, maxValue, range };
    }, [data]);

    // Get grid dimensions
    const gridDimensions = useMemo(() => {
      const maxRow = Math.max(...processedData.cells.map((c: any) => c.row)) + 1;
      const maxCol = Math.max(...processedData.cells.map((c: any) => c.col)) + 1;
      return { rows: maxRow, cols: maxCol };
    }, [processedData.cells]);

    // Generate color from normalized value
    const getColor = useCallback((normalizedValue: number) => {
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
    }, [colorScale]);

    // Color interpolation utility
    const interpolateColor = useCallback((color1: string, color2: string, factor: number) => {
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');
      
      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);
      
      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);
      
      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }, []);

    // Handle cell interactions
    const handleCellClick = useCallback((cell: HeatmapCell, event: React.MouseEvent) => {
      if (selectable) {
        const cellId = { row: cell.row, col: cell.col };
        const isSelected = selectedCells.some(c => c.row === cell.row && c.col === cell.col);
        
        let newSelection: Array<{ row: number; col: number }>;
        if (event.ctrlKey || event.metaKey) {
          // Multi-select
          newSelection = isSelected
            ? selectedCells.filter((c: any) => !(c.row === cell.row && c.col === cell.col))
            : [...selectedCells, cellId];
        } else {
          // Single select
          newSelection = isSelected ? [] : [cellId];
        }
        
        onSelectionChange?.(newSelection);
      }
      
      onCellClick?.(cell);
    }, [selectable, selectedCells, onSelectionChange, onCellClick]);

    const handleCellHover = useCallback((cell: HeatmapCell | null, event?: React.MouseEvent) => {
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
      
    }, [onCellHover, showTooltips]);

    // Handle zoom
    const handleZoom = useCallback((delta: number, event: React.WheelEvent) => {
      if (!zoomable) return;
      
      event.preventDefault();
      const newZoom = Math.max(0.5, Math.min(3, internalZoomLevel + delta));
      setInternalZoomLevel(newZoom);
      onZoomChange?.(newZoom);
    }, [zoomable, internalZoomLevel, onZoomChange]);

    // Check if cell is selected
    const isCellSelected = useCallback((row: number, col: number) => {
      return selectedCells.some(c => c.row === row && c.col === col);
    }, [selectedCells]);

    // Default cell renderer
    const defaultRenderCell = useCallback((cell: HeatmapCell) => {
      const isSelected = isCellSelected(cell.row, cell.col);
      const isHovered = hoveredCell?.row === cell.row && hoveredCell?.col === cell.col;
      const cellColor = getColor(cell.normalizedValue);
      
      return (
        <OptimizedGlass
          elevation="level1"
          intensity="subtle"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            'glass-heatmap-cell flex items-center justify-center glass-text-xs font-medium transition-all',
            'cursor-pointer hover:scale-110 hover:z-10',
            isSelected && 'ring-2 ring-primary ring-offset-1',
            isHovered && 'shadow-lg scale-110 z-20',
            showGrid && 'border border-border/20'
          )}
          style={{
            backgroundColor: cellColor,
            color: cell.normalizedValue > 0.5 ? 'var(--glass-white)' : 'var(--glass-black)',
            width: cellSize * internalZoomLevel,
            height: cellSize * internalZoomLevel,
            fontSize: `${Math.max(8, cellSize * internalZoomLevel * 0.4)}px`,
          }}
          onClick={(e: React.MouseEvent) => handleCellClick(cell, e)}
          onMouseEnter={(e: React.MouseEvent) => handleCellHover(cell, e)}
          onMouseLeave={() => handleCellHover(null)}
        >
          {showValues && (
            <span className="select-none">
              {typeof cell.value === 'number' ? cell.value.toFixed(1) : cell.value}
            </span>
          )}
        </OptimizedGlass>
      );
    }, [
      isCellSelected,
      hoveredCell,
      getColor,
      cellSize,
      internalZoomLevel,
      showGrid,
      showValues,
      handleCellClick,
      handleCellHover
    ]);

    // Default tooltip renderer
    const defaultRenderTooltip = useCallback((cell: HeatmapCell) => {
      return (
        <OptimizedGlass
          elevation="level3"
          intensity="strong"
          depth={3}
          tint="neutral"
          border="strong"
          className="glass-heatmap-tooltip p-3 glass-radius-lg shadow-lg backdrop-blur-md border border-glass-border/20"
        >
          <div className="text-sm gap-1">
            <div className="font-semibold">
              {cell.label || `Cell (${cell.col}, ${cell.row})`}
            </div>
            <div>Value: {cell.value}</div>
            {xAxis?.labels?.[cell.col] && (
              <div>X: {xAxis.labels[cell.col]}</div>
            )}
            {yAxis?.labels?.[cell.row] && (
              <div>Y: {yAxis.labels[cell.row]}</div>
            )}
            {cell.metadata && Object.entries(cell.metadata).map(([key, value]) => (
              <div key={key}>
                {key}: {String(value)}
              </div>
            ))}
          </div>
        </OptimizedGlass>
      );
    }, [xAxis, yAxis]);

    // Render legend
    const renderLegend = useCallback(() => {
      if (!showLegend) return null;
      
      const legendSteps = 20;
      const isHorizontal = legendPosition === 'top' || legendPosition === 'bottom';
      
      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            'glass-heatmap-legend glass-p-3 glass-radius-lg backdrop-blur-md border border-border/20',
            isHorizontal ? 'flex items-center glass-gap-3' : 'flex flex-col glass-gap-3'
          )}
        >
          <div className="text-sm font-medium text-primary">
            Legend
          </div>
          
          <div className={cn(
            'flex',
            isHorizontal ? 'flex-row items-center glass-gap-1' : 'flex-col glass-gap-1'
          )}>
            <div className="text-xs glass-text-secondary">
              {processedData.minValue.toFixed(1)}
            </div>
            
            <div className={cn(
              'flex',
              isHorizontal ? 'flex-row' : 'flex-col'
            )}>
              {Array.from({ length: legendSteps }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1',
                    isHorizontal ? 'w-3 h-6' : 'w-6 h-3'
                  )}
                  style={{
                    backgroundColor: getColor(i / (legendSteps - 1))
                  }}
                />
              ))}
            </div>
            
            <div className="text-xs glass-text-secondary">
              {processedData.maxValue.toFixed(1)}
            </div>
          </div>
        </OptimizedGlass>
      );
    }, [showLegend, legendPosition, processedData, getColor]);

    // Create grid matrix for rendering
    const gridMatrix = useMemo(() => {
      const matrix: Array<Array<HeatmapCell | null>> = Array(gridDimensions.rows)
        .fill(null)
        .map(() => Array(gridDimensions.cols).fill(null));
      
      processedData.cells.forEach((cell: any) => {
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
          'glass-heatmap glass-radius-lg backdrop-blur-md border border-border/20 overflow-hidden',
          className
        )}
        {...props}
      >
        <Motion
          preset={!prefersReducedMotion && respectMotionPreference && animated ? "fadeIn" : "none"}
          className="relative"
        >
          <div
            ref={containerRef}
            className={cn(
              'flex',
              legendPosition === 'left' && 'flex-row-reverse',
              legendPosition === 'right' && 'flex-row',
              legendPosition === 'top' && 'flex-col-reverse',
              legendPosition === 'bottom' && 'flex-col'
            )}
          >
            {/* Legend */}
            {showLegend && (
              <div className="flex-shrink-0 p-4">
                {renderLegend()}
              </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Y-Axis */}
              <div className="flex">
                {yAxis && (
                  <div className="flex flex-col justify-between glass-mr-2">
                    {yAxis.title && (
                      <div className="text-sm font-medium text-primary mb-2 writing-mode-vertical-lr transform rotate-180">
                        {yAxis.title}
                      </div>
                    )}
                    <div className="flex flex-col justify-between h-full">
                      {yAxis.labels?.map((label, index) => (
                        <div key={index} className="text-xs glass-text-secondary text-right pr-2">
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Heatmap Grid */}
                <div
                  ref={heatmapRef}
                  className="relative"
                  onWheel={(e: React.WheelEvent) => handleZoom(e.deltaY > 0 ? -0.1 : 0.1, e)}
                >
                  {/* X-Axis */}
                  {xAxis && (
                    <div className="mb-2">
                      {xAxis.title && (
                        <div className="text-sm font-medium text-primary text-center mb-2">
                          {xAxis.title}
                        </div>
                      )}
                      <div 
                        className="flex justify-between"
                        style={{ width: (cellSize * internalZoomLevel + cellGap) * gridDimensions.cols - cellGap }}
                      >
                        {xAxis.labels?.map((label, index) => (
                          <div key={index} className="text-xs glass-text-secondary text-center">
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Grid */}
                  <div
                    className="grid gap-px"
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
                          preset={!prefersReducedMotion && respectMotionPreference && animated ? "scaleIn" : "none"}
                          delay={animated ? (rowIndex * gridDimensions.cols + colIndex) * 10 : 0}
                        >
                          {cell ? (
                            renderCell ? renderCell(cell) : defaultRenderCell(cell)
                          ) : (
                            <div
                              className="glass-surface-overlay border border-dashed border-glass-border/30"
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
            </div>
          </div>
          
          {/* Tooltip */}
          {showTooltips && hoveredCell && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: 'translateY(-100%)',
              }}
            >
              {renderTooltip ? renderTooltip(hoveredCell) : defaultRenderTooltip(hoveredCell)}
            </div>
          )}
          
          {/* Zoom Controls */}
          {zoomable && (
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              <button
                onClick={() => handleZoom(0.1, {} as any)}
                className="w-8 h-8 flex items-center justify-center glass-radius-md text-sm font-bold transition-all hover:scale-105"
              >
                +
              </button>
              <button
                onClick={() => handleZoom(-0.1, {} as any)}
                className="w-8 h-8 flex items-center justify-center glass-radius-md text-sm font-bold transition-all hover:scale-105"
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

GlassHeatmap.displayName = 'GlassHeatmap';

export default GlassHeatmap;

