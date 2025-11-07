'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Glass } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useAccessibility } from '../../hooks/useAccessibility';

export interface DataPoint {
  id: string | number;
  x: number | string | Date;
  y: number;
  category?: string;
  label?: string;
  metadata?: Record<string, any>;
  color?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
  visible?: boolean;
}

export interface DrillDownLevel {
  id: string;
  name: string;
  dataKey: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface ChartFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

export interface AdvancedDataVizProps {
  data: ChartSeries[];
  type?: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'combo';
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDataLabels?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableCrosshair?: boolean;
  enableAnimation?: boolean;
  enableDrillDown?: boolean;
  drillDownLevels?: DrillDownLevel[];
  filters?: ChartFilter[];
  onDataPointClick?: (point: DataPoint, series: ChartSeries) => void;
  onDrillDown?: (level: DrillDownLevel, filters: ChartFilter[]) => void;
  onExport?: (format: 'png' | 'svg' | 'csv' | 'json') => void;
  width?: number;
  height?: number;
  className?: string;
}

// Chart rendering utility functions
const createSVGPath = (points: Array<{ x: number; y: number }>, type: 'line' | 'area' = 'line') => {
  if (points.length === 0) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  if (type === 'area') {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    path += ` L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
  }
  
  return path;
};

const scaleValue = (value: number, domain: [number, number], range: [number, number]) => {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
};

const generateColors = (count: number): string[] => {
  const colors = [
    'var(--glass-color-primary)', 'var(--glass-color-danger)', 'var(--glass-color-success)', 'var(--glass-color-warning)', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // Generate additional colors using HSL
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return [...colors, ...additionalColors];
};

const formatValue = (value: any, type?: string): string => {
  if (typeof value === 'number') {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else if (type === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    } else if (value > 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  return String(value);
};

export const GlassAdvancedDataViz: React.FC<AdvancedDataVizProps> = ({
  data,
  type = 'line',
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  showLegend = true,
  showTooltip = true,
  showDataLabels = false,
  enableZoom = true,
  enablePan = true,
  enableCrosshair = true,
  enableAnimation = true,
  enableDrillDown = false,
  drillDownLevels = [],
  filters = [],
  onDataPointClick,
  onDrillDown,
  onExport,
  width = 800,
  height = 400,
  className
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    data.map((s: any) => s.id)
  );

  const [zoomLevel, setZoomLevel] = useState({ x: [0, 1], y: [0, 1] });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [currentDrillLevel, setCurrentDrillLevel] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<ChartFilter[]>(filters);
  const [isAnimating, setIsAnimating] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accessibility = useAccessibility();

  // Filter and process data
  const processedData = useMemo(() => {
    return data.map((series: any) => ({
      ...series,
      data: series.data.filter((point: any) => {
        return appliedFilters.every(filter => {
          const fieldValue = point.metadata?.[filter.field] ?? point.y;
          
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filter.value;
            case 'contains':
              return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greaterThan':
              return Number(fieldValue) > Number(filter.value);
            case 'lessThan':
              return Number(fieldValue) < Number(filter.value);
            case 'between':
              return Number(fieldValue) >= Number(filter.value[0]) && Number(fieldValue) <= Number(filter.value[1]);
            default:
              return true;
          }
        });
      })
    })).filter((series: any) => selectedSeries.includes(series.id));
  }, [data, appliedFilters, selectedSeries]);

  // Calculate chart dimensions and scales
  const chartDimensions = useMemo((): {
    margin: { top: number; right: number; bottom: number; left: number };
    chartWidth: number;
    chartHeight: number;
    xDomain: [number, number];
    yDomain: [number, number];
  } => {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate data bounds
    const allPoints = processedData.flatMap(s => s.data);
    
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;

    allPoints.forEach((point: any) => {
      const xVal = typeof point.x === 'number' ? point.x : new Date(point.x).getTime();
      xMin = Math.min(xMin, xVal);
      xMax = Math.max(xMax, xVal);
      yMin = Math.min(yMin, point.y);
      yMax = Math.max(yMax, point.y);
    });

    // Add padding
    const xPadding = (xMax - xMin) * 0.05;
    const yPadding = (yMax - yMin) * 0.1;
    
    xMin -= xPadding;
    xMax += xPadding;
    yMin -= yPadding;
    yMax += yPadding;

    // Apply zoom
    const zoomedXMin = xMin + (xMax - xMin) * zoomLevel.x[0];
    const zoomedXMax = xMin + (xMax - xMin) * zoomLevel.x[1];
    const zoomedYMin = yMin + (yMax - yMin) * zoomLevel.y[0];
    const zoomedYMax = yMin + (yMax - yMin) * zoomLevel.y[1];

    return {
      margin,
      chartWidth,
      chartHeight,
      xDomain: [zoomedXMin, zoomedXMax] as [number, number],
      yDomain: [zoomedYMin, zoomedYMax] as [number, number]
    };
  }, [processedData, width, height, zoomLevel]);

  // Generate chart colors
  const seriesColors = useMemo(() => {
    const colors = generateColors(processedData.length);
    const colorMap: Record<string, string> = {};
    
    processedData.forEach((series, index) => {
      colorMap[series.id] = series.color || colors[index];
    });
    
    return colorMap;
  }, [processedData]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return;

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find nearest data point
    let nearestPoint: DataPoint | null = null;
    let nearestSeries: ChartSeries | null = null;
    let minDistance = Infinity;

    processedData.forEach((series: any) => {
      series.data.forEach((point: any) => {
        const pointX = scaleValue(
          typeof point.x === 'number' ? point.x : new Date(point.x).getTime(),
          chartDimensions.xDomain,
          [chartDimensions.margin.left, chartDimensions.margin.left + chartDimensions.chartWidth]
        );
        const pointY = scaleValue(
          point.y,
          chartDimensions.yDomain,
          [chartDimensions.margin.top + chartDimensions.chartHeight, chartDimensions.margin.top]
        );

        const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
        
        if (distance < minDistance && distance < 50) { // 50px tolerance
          minDistance = distance;
          nearestPoint = point;
          nearestSeries = series;
        }
      });
    });

    if (nearestPoint && nearestSeries) {
      const s = nearestSeries as ChartSeries;
      const p = nearestPoint as DataPoint;
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: `${s.name}: ${formatValue(p.y)} (${formatValue(p.x)})`
      });
    } else {
      setTooltip((prev: any) => ({ ...prev, visible: false }));
    }
  }, [showTooltip, processedData, chartDimensions]);

  const handleDataPointClick = useCallback((point: DataPoint, series: ChartSeries) => {
    onDataPointClick?.(point, series);
    
    if (enableDrillDown && currentDrillLevel < drillDownLevels.length - 1) {
      const nextLevel = drillDownLevels[currentDrillLevel + 1];
      const newFilter: ChartFilter = {
        field: nextLevel.dataKey,
        operator: 'equals',
        value: point.metadata?.[nextLevel.dataKey] || point.category
      };
      
      setAppliedFilters((prev: any) => [...prev, newFilter]);
      setCurrentDrillLevel((prev: any) => prev + 1);
      onDrillDown?.(nextLevel, [...appliedFilters, newFilter]);
    }
  }, [onDataPointClick, enableDrillDown, currentDrillLevel, drillDownLevels, appliedFilters, onDrillDown]);

  const handleZoom = useCallback((delta: number, centerX: number, centerY: number) => {
    if (!enableZoom) return;

    const zoomFactor = delta > 0 ? 0.9 : 1.1;
    const xRange = zoomLevel.x[1] - zoomLevel.x[0];
    const yRange = zoomLevel.y[1] - zoomLevel.y[0];
    
    const newXRange = xRange * zoomFactor;
    const newYRange = yRange * zoomFactor;
    
    const xCenter = zoomLevel.x[0] + xRange * centerX;
    const yCenter = zoomLevel.y[0] + yRange * centerY;
    
    setZoomLevel({
      x: [
        Math.max(0, xCenter - newXRange / 2),
        Math.min(1, xCenter + newXRange / 2)
      ],
      y: [
        Math.max(0, yCenter - newYRange / 2),
        Math.min(1, yCenter + newYRange / 2)
      ]
    });
  }, [enableZoom, zoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel({ x: [0, 1], y: [0, 1] });
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const toggleSeries = useCallback((seriesId: string) => {
    setSelectedSeries((prev: any) => 
      prev.includes(seriesId) 
        ? prev.filter((id: any) => id !== seriesId)
        : [...prev, seriesId]
    );
  }, []);

  const exportChart = useCallback((format: 'png' | 'svg' | 'csv' | 'json') => {
    if (format === 'csv' || format === 'json') {
      const exportData = processedData.map((series: any) => ({
        series: series.name,
        data: series.data.map((point: any) => ({
          x: point.x,
          y: point.y,
          category: point.category,
          label: point.label,
          ...point.metadata
        }))
      }));

      const content = format === 'csv' 
        ? convertToCSV(exportData)
        : JSON.stringify(exportData, null, 2);

      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-data.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    onExport?.(format);
  }, [processedData, onExport]);

  const convertToCSV = (data: any[]): string => {
    const rows: string[] = ['Series,X,Y,Category,Label'];
    
    data.forEach((series: any) => {
      series.data.forEach((point: any) => {
        rows.push(`${series.series},${point.x},${point.y},${point.category || ''},${point.label || ''}`);
      });
    });
    
    return rows.join('\n');
  };

  const renderLineChart = () => {
    return processedData.map((series: any) => {
      const points = series.data.map((point: any) => ({
        x: scaleValue(
          typeof point.x === 'number' ? point.x : new Date(point.x).getTime(),
          chartDimensions.xDomain,
          [0, chartDimensions.chartWidth]
        ),
        y: scaleValue(
          point.y,
          chartDimensions.yDomain,
          [chartDimensions.chartHeight, 0]
        )
      }));

      const pathD = createSVGPath(points, series.type === 'area' ? 'area' : 'line');

      return (
        <g data-glass-component key={series.id}>
          {series.type === 'area' && (
            <path
              d={pathD}
              fill={seriesColors[series.id]}
              fillOpacity={0.3}
              stroke="none"
            />
          )}
          <path
            d={pathD}
            fill="none"
            stroke={seriesColors[series.id]}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={enableAnimation ? 'transition-all duration-300' : ''}
          />
          {series.data.map((point: any, index: any) => (
            <circle
              key={`${point.id}-${index}`}
              cx={points[index].x}
              cy={points[index].y}
              r={4}
              fill={seriesColors[series.id]}
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer hover:r-6 transition-all"
              onClick={() => handleDataPointClick(point, series)}
            />
          ))}
        </g>
      );
    });
  };

  const renderBarChart = () => {
    const barWidth = chartDimensions.chartWidth / (processedData[0]?.data.length || 1) * 0.8;
    const barGroupWidth = barWidth / processedData.length;

    return processedData.map((series, seriesIndex) => (
      <g key={series.id}>
        {series.data.map((point: any, pointIndex: any) => {
          const x = (pointIndex * barWidth) + (seriesIndex * barGroupWidth) + barGroupWidth / 2;
          const y = scaleValue(point.y, chartDimensions.yDomain, [chartDimensions.chartHeight, 0]);
          const height = chartDimensions.chartHeight - y;

          return (
            <rect
              key={`${point.id}-${pointIndex}`}
              x={x}
              y={y}
              width={barGroupWidth * 0.8}
              height={height}
              fill={seriesColors[series.id]}
              className="cursor-pointer hover:opacity-80 transition-all"
              onClick={() => handleDataPointClick(point, series)}
            />
          );
        })}
      </g>
    ));
  };

  const renderAxes = () => {
    const xTicks = 5;
    const yTicks = 5;

    return (
      <g>
        {/* X Axis */}
        <line
          x1={0}
          y1={chartDimensions.chartHeight}
          x2={chartDimensions.chartWidth}
          y2={chartDimensions.chartHeight}
          stroke="var(--glass-gray-200)"
          strokeWidth={1}
        />
        
        {/* Y Axis */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={chartDimensions.chartHeight}
          stroke="var(--glass-gray-200)"
          strokeWidth={1}
        />

        {/* X Axis Ticks */}
        {Array.from({ length: xTicks }, (_, i) => {
          const x = (i / (xTicks - 1)) * chartDimensions.chartWidth;
          const value = chartDimensions.xDomain[0] + (chartDimensions.xDomain[1] - chartDimensions.xDomain[0]) * (i / (xTicks - 1));
          
          return (
            <g key={i}>
              <line
                x1={x}
                y1={chartDimensions.chartHeight}
                x2={x}
                y2={chartDimensions.chartHeight + 5}
                stroke="var(--glass-gray-400)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={chartDimensions.chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* Y Axis Ticks */}
        {Array.from({ length: yTicks }, (_, i) => {
          const y = chartDimensions.chartHeight - (i / (yTicks - 1)) * chartDimensions.chartHeight;
          const value = chartDimensions.yDomain[0] + (chartDimensions.yDomain[1] - chartDimensions.yDomain[0]) * (i / (yTicks - 1));
          
          return (
            <g key={i}>
              <line
                x1={-5}
                y1={y}
                x2={0}
                y2={y}
                stroke="var(--glass-gray-400)"
                strokeWidth={1}
              />
              <text
                x={-10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* Axis Labels */}
        {xAxisLabel && (
          <text
            x={chartDimensions.chartWidth / 2}
            y={chartDimensions.chartHeight + 45}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
          >
            {xAxisLabel}
          </text>
        )}

        {yAxisLabel && (
          <text
            x={-40}
            y={chartDimensions.chartHeight / 2}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-700"
            transform={`rotate(-90, -40, ${chartDimensions.chartHeight / 2})`}
          >
            {yAxisLabel}
          </text>
        )}
      </g>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Glass className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h2 className="text-xl font-semibold glass-text-secondary">{title}</h2>}
            {subtitle && <p className="glass-text-secondary mt-1">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            {enableZoom && (
              <button
                onClick={resetZoom}
                className="px-3 py-1 text-xs glass-surface-subtle glass-text-secondary glass-radius hover:glass-surface-subtle transition-colors"
              >
                Reset Zoom
              </button>
            )}
            
            <div className="flex border border-subtle glass-radius overflow-hidden">
              <button
                onClick={() => exportChart('csv')}
                className="px-3 py-1 text-xs glass-surface-subtle glass-text-secondary hover:glass-surface-subtle border-r border-subtle"
              >
                CSV
              </button>
              <button
                onClick={() => exportChart('json')}
                className="px-3 py-1 text-xs glass-surface-subtle glass-text-secondary hover:glass-surface-subtle"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Drill-down breadcrumbs */}
        {enableDrillDown && appliedFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm glass-text-secondary">
            <span>📊</span>
            <span>Filtered by:</span>
            {appliedFilters.map((filter, index) => (
              <span
                key={index}
                className="px-2 py-1 glass-surface-subtle text-primary glass-radius flex items-center gap-1"
              >
                {filter.field}: {filter.value}
                <button
                  onClick={() => setAppliedFilters((prev: any) => prev.filter((_: any, i: any) => i !== index))}
                  className="text-primary hover:text-primary ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip((prev: any) => ({ ...prev, visible: false }))}
            onWheel={(e) => {
              e.preventDefault();
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                const centerX = (e.clientX - rect.left - chartDimensions.margin.left) / chartDimensions.chartWidth;
                const centerY = (e.clientY - rect.top - chartDimensions.margin.top) / chartDimensions.chartHeight;
                handleZoom(e.deltaY, centerX, centerY);
              }
            }}
            className="border border-subtle glass-radius"
          >
            <g transform={`translate(${chartDimensions.margin.left}, ${chartDimensions.margin.top})`}>
              {renderAxes()}
              
              {type === 'line' || type === 'combo' ? renderLineChart() : null}
              {type === 'bar' || type === 'combo' ? renderBarChart() : null}
              
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--glass-gray-100)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width={chartDimensions.chartWidth} height={chartDimensions.chartHeight} fill="url(#grid)" opacity="0.5"/>
            </g>
          </svg>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-subtle">
            {processedData.map((series: any) => (
              <button
                key={series.id}
                onClick={() => toggleSeries(series.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded text-sm transition-opacity",
                  selectedSeries.includes(series.id) ? "opacity-100" : "opacity-50"
                )}
              >
                <div
                  className="w-3 h-3 glass-radius-full"
                  style={{ backgroundColor: seriesColors[series.id] }}
                />
                <span>{series.name}</span>
              </button>
            ))}
          </div>
        )}
      </Glass>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 glass-surface-subtle text-primary text-sm glass-radius shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: tooltip.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
