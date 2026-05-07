"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useAccessibility } from "../../hooks/useAccessibility";

export interface DataPoint {
  id: string | number;
  x: number | string | Date;
  y: number;
  category?: string;
  label?: string;
  metadata?: Record<string, unknown>;
  color?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
  type?: "line" | "bar" | "area" | "scatter";
  visible?: boolean;
}

export interface DrillDownLevel {
  id: string;
  name: string;
  dataKey: string;
  aggregation?: "sum" | "avg" | "count" | "min" | "max";
}

export type ChartFilterPrimitiveValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type ChartFilterValue =
  | ChartFilterPrimitiveValue
  | ChartFilterPrimitiveValue[]
  | [ChartFilterPrimitiveValue, ChartFilterPrimitiveValue];

export interface ChartFilter {
  field: string;
  operator: "equals" | "contains" | "greaterThan" | "lessThan" | "between";
  value: ChartFilterValue;
}

export interface AdvancedDataVizProps {
  data?: ChartSeries[];
  type?: "line" | "bar" | "pie" | "scatter" | "heatmap" | "combo";
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
  onExport?: (format: "png" | "svg" | "csv" | "json") => void;
  width?: number;
  height?: number;
  className?: string;
}

const EMPTY_CHART_SERIES: ChartSeries[] = [];

const toFiniteNumber = (value: unknown, fallback = 0): number => {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : fallback;
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const toXNumber = (value: DataPoint["x"], fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : fallback;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) return numericValue;
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : fallback;
  }
  return fallback;
};

const isFinitePoint = (point: { x: number; y: number }) =>
  Number.isFinite(point.x) && Number.isFinite(point.y);

interface ChartExportSeries {
  series: string;
  data: Array<
    {
      x: DataPoint["x"];
      y: number;
      category?: string;
      label?: string;
    } & Record<string, unknown>
  >;
}

const isChartFilterPrimitiveValue = (
  value: unknown
): value is ChartFilterPrimitiveValue =>
  value == null ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean" ||
  value instanceof Date;

// Chart rendering utility functions
const createSVGPath = (
  points: Array<{ x: number; y: number }>,
  type: "line" | "area" = "line"
) => {
  const validPoints = points.filter(isFinitePoint);
  if (validPoints.length === 0) return "";

  let path = `M ${validPoints[0].x} ${validPoints[0].y}`;

  for (let i = 1; i < validPoints.length; i++) {
    path += ` L ${validPoints[i].x} ${validPoints[i].y}`;
  }

  if (type === "area") {
    const firstPoint = validPoints[0];
    const lastPoint = validPoints[validPoints.length - 1];
    path += ` L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`;
  }

  return path;
};

const scaleValue = (
  value: number,
  domain: [number, number],
  range: [number, number]
) => {
  const [domainMin, domainMax] = domain;
  const [rangeMin, rangeMax] = range;
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(domainMin) ||
    !Number.isFinite(domainMax) ||
    !Number.isFinite(rangeMin) ||
    !Number.isFinite(rangeMax)
  ) {
    return rangeMin;
  }
  if (domainMax === domainMin) {
    return rangeMin + (rangeMax - rangeMin) / 2;
  }
  return (
    rangeMin +
    ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin)
  );
};

const generateColors = (count: number): string[] => {
  const colors = [
    "var(--glass-color-primary)",
    "var(--glass-color-danger)",
    "var(--glass-color-success)",
    "var(--glass-color-warning)",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
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

const formatValue = (value: unknown, type?: string): string => {
  if (typeof value === "number") {
    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    } else if (type === "percentage") {
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
  type = "line",
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
  className,
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: "" });

  const dataArray = data ?? EMPTY_CHART_SERIES;
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    dataArray.map((s) => s.id)
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
    if (!dataArray || dataArray.length === 0) return [];
    return dataArray
      .map((series) => ({
        ...series,
        data: (Array.isArray(series.data) ? series.data : [])
          .map((point, pointIndex) => ({
            ...point,
            id: point?.id ?? `${series.id}-${pointIndex}`,
            x: point?.x ?? pointIndex,
            y: toFiniteNumber(point?.y),
          }))
          .filter((point) => Number.isFinite(point.y))
          .filter((point) => {
            return appliedFilters.every((filter) => {
              const fieldValue = point.metadata?.[filter.field] ?? point.y;

              switch (filter.operator) {
                case "equals":
                  return fieldValue === filter.value;
                case "contains":
                  return String(fieldValue)
                    .toLowerCase()
                    .includes(String(filter.value).toLowerCase());
                case "greaterThan":
                  return Number(fieldValue) > Number(filter.value);
                case "lessThan":
                  return Number(fieldValue) < Number(filter.value);
                case "between": {
                  const rangeValue = Array.isArray(filter.value)
                    ? filter.value
                    : [];
                  return (
                    Number(fieldValue) >= Number(rangeValue[0]) &&
                    Number(fieldValue) <= Number(rangeValue[1])
                  );
                }
                default:
                  return true;
              }
            });
          }),
      }))
      .filter((series) => selectedSeries.includes(series.id));
  }, [dataArray, appliedFilters, selectedSeries]);

  // Calculate chart dimensions and scales
  const chartDimensions = useMemo((): {
    margin: { top: number; right: number; bottom: number; left: number };
    chartWidth: number;
    chartHeight: number;
    xDomain: [number, number];
    yDomain: [number, number];
  } => {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = Math.max(1, width - margin.left - margin.right);
    const chartHeight = Math.max(1, height - margin.top - margin.bottom);

    // Calculate data bounds
    const allPoints = processedData.flatMap((s) => s.data);

    let xMin = Infinity,
      xMax = -Infinity;
    let yMin = Infinity,
      yMax = -Infinity;

    allPoints.forEach((point, index) => {
      const xVal = toXNumber(point.x, index);
      xMin = Math.min(xMin, xVal);
      xMax = Math.max(xMax, xVal);
      yMin = Math.min(yMin, point.y);
      yMax = Math.max(yMax, point.y);
    });

    if (
      allPoints.length === 0 ||
      !Number.isFinite(xMin) ||
      !Number.isFinite(xMax) ||
      !Number.isFinite(yMin) ||
      !Number.isFinite(yMax)
    ) {
      xMin = 0;
      xMax = 1;
      yMin = 0;
      yMax = 1;
    }

    // Add padding
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xPadding =
      xRange === 0 ? (xMax === 0 ? 1 : Math.abs(xMax) * 0.05) : xRange * 0.05;
    const yPadding =
      yRange === 0 ? (yMax === 0 ? 1 : Math.abs(yMax) * 0.1) : yRange * 0.1;

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
      yDomain: [zoomedYMin, zoomedYMax] as [number, number],
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

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
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

      processedData.forEach((series) => {
        series.data.forEach((point, pointIndex) => {
          const pointX = scaleValue(
            toXNumber(point.x, pointIndex),
            chartDimensions.xDomain,
            [
              chartDimensions.margin.left,
              chartDimensions.margin.left + chartDimensions.chartWidth,
            ]
          );
          const pointY = scaleValue(
            toFiniteNumber(point.y),
            chartDimensions.yDomain,
            [
              chartDimensions.margin.top + chartDimensions.chartHeight,
              chartDimensions.margin.top,
            ]
          );

          const distance = Math.sqrt(
            Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2)
          );

          if (distance < minDistance && distance < 50) {
            // 50px tolerance
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
          content: `${s.name}: ${formatValue(p.y)} (${formatValue(p.x)})`,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    },
    [showTooltip, processedData, chartDimensions]
  );

  const handleDataPointClick = useCallback(
    (point: DataPoint, series: ChartSeries) => {
      onDataPointClick?.(point, series);

      if (enableDrillDown && currentDrillLevel < drillDownLevels.length - 1) {
        const nextLevel = drillDownLevels[currentDrillLevel + 1];
        const metadataValue = point.metadata?.[nextLevel.dataKey];
        const newFilter: ChartFilter = {
          field: nextLevel.dataKey,
          operator: "equals",
          value: isChartFilterPrimitiveValue(metadataValue)
            ? metadataValue
            : point.category,
        };

        setAppliedFilters((prev) => [...prev, newFilter]);
        setCurrentDrillLevel((prev) => prev + 1);
        onDrillDown?.(nextLevel, [...appliedFilters, newFilter]);
      }
    },
    [
      onDataPointClick,
      enableDrillDown,
      currentDrillLevel,
      drillDownLevels,
      appliedFilters,
      onDrillDown,
    ]
  );

  const handleZoom = useCallback(
    (delta: number, centerX: number, centerY: number) => {
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
          Math.min(1, xCenter + newXRange / 2),
        ],
        y: [
          Math.max(0, yCenter - newYRange / 2),
          Math.min(1, yCenter + newYRange / 2),
        ],
      });
    },
    [enableZoom, zoomLevel]
  );

  const resetZoom = useCallback(() => {
    setZoomLevel({ x: [0, 1], y: [0, 1] });
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const toggleSeries = useCallback((seriesId: string) => {
    setSelectedSeries((prev) =>
      prev.includes(seriesId)
        ? prev.filter((id) => id !== seriesId)
        : [...prev, seriesId]
    );
  }, []);

  const exportChart = useCallback(
    (format: "png" | "svg" | "csv" | "json") => {
      if (format === "csv" || format === "json") {
        const exportData: ChartExportSeries[] = processedData.map((series) => ({
          series: series.name,
          data: series.data.map((point) => ({
            x: point.x,
            y: point.y,
            category: point.category,
            label: point.label,
            ...point.metadata,
          })),
        }));

        const content =
          format === "csv"
            ? convertToCSV(exportData)
            : JSON.stringify(exportData, null, 2);

        const blob = new Blob([content], {
          type: format === "csv" ? "text/csv" : "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chart-data.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      onExport?.(format);
    },
    [processedData, onExport]
  );

  const convertToCSV = (data: ChartExportSeries[]): string => {
    const rows: string[] = ["Series,X,Y,Category,Label"];

    data.forEach((series) => {
      series.data.forEach((point) => {
        rows.push(
          `${series.series},${point.x},${point.y},${point.category || ""},${point.label || ""}`
        );
      });
    });

    return rows.join("\n");
  };

  const renderLineChart = () => {
    return processedData.map((series) => {
      const points = series.data
        .map((point, pointIndex) => ({
          x: scaleValue(
            toXNumber(point.x, pointIndex),
            chartDimensions.xDomain,
            [0, chartDimensions.chartWidth]
          ),
          y: scaleValue(toFiniteNumber(point.y), chartDimensions.yDomain, [
            chartDimensions.chartHeight,
            0,
          ]),
        }))
        .filter(isFinitePoint);

      const pathD = createSVGPath(
        points,
        series.type === "area" ? "area" : "line"
      );

      return (
        <g data-glass-component key={series.id}>
          {series.type === "area" && (
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
            className={enableAnimation ? "transition-all duration-300" : ""}
          />
          {series.data.map((point, index) => (
            <circle
              key={`${point.id}-${index}`}
              cx={points[index]?.x ?? 0}
              cy={points[index]?.y ?? chartDimensions.chartHeight}
              r={4}
              fill={seriesColors[series.id]}
              stroke="white"
              strokeWidth={2}
              className="glass-cursor-pointer glass-hover-r-6 glass-transition-all"
              onClick={() => handleDataPointClick(point, series)}
            />
          ))}
        </g>
      );
    });
  };

  const renderBarChart = () => {
    const visibleSeriesCount = Math.max(1, processedData.length);
    const pointCount = Math.max(1, processedData[0]?.data.length || 0);
    const barWidth = (chartDimensions.chartWidth / pointCount) * 0.8;
    const barGroupWidth = barWidth / visibleSeriesCount;

    return processedData.map((series, seriesIndex) => (
      <g key={series.id}>
        {series.data.map((point, pointIndex) => {
          const x =
            pointIndex * barWidth +
            seriesIndex * barGroupWidth +
            barGroupWidth / 2;
          const y = scaleValue(
            toFiniteNumber(point.y),
            chartDimensions.yDomain,
            [chartDimensions.chartHeight, 0]
          );
          const height = Math.max(0, chartDimensions.chartHeight - y);

          return (
            <rect
              key={`${point.id}-${pointIndex}`}
              x={Number.isFinite(x) ? x : 0}
              y={Number.isFinite(y) ? y : chartDimensions.chartHeight}
              width={Math.max(0, barGroupWidth * 0.8)}
              height={height}
              fill={seriesColors[series.id]}
              className="glass-cursor-pointer hover:glass-opacity-80 glass-transition-all"
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
          const x = (i / Math.max(1, xTicks - 1)) * chartDimensions.chartWidth;
          const value =
            chartDimensions.xDomain[0] +
            (chartDimensions.xDomain[1] - chartDimensions.xDomain[0]) *
              (i / Math.max(1, xTicks - 1));

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
                className="glass-text-xs glass-fill-gray-600"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* Y Axis Ticks */}
        {Array.from({ length: yTicks }, (_, i) => {
          const y =
            chartDimensions.chartHeight -
            (i / Math.max(1, yTicks - 1)) * chartDimensions.chartHeight;
          const value =
            chartDimensions.yDomain[0] +
            (chartDimensions.yDomain[1] - chartDimensions.yDomain[0]) *
              (i / Math.max(1, yTicks - 1));

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
                className="glass-text-xs glass-fill-gray-600"
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
            className="glass-text-sm glass-font-medium glass-fill-gray-700"
          >
            {xAxisLabel}
          </text>
        )}

        {yAxisLabel && (
          <text
            x={-40}
            y={chartDimensions.chartHeight / 2}
            textAnchor="middle"
            className="glass-text-sm glass-font-medium glass-fill-gray-700"
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
      <Glass className="glass-p-6">
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-mb-6">
          <div>
            {title && (
              <h2 className="glass-text-xl glass-font-semibold glass-text-secondary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="glass-text-secondary glass-mt-1">{subtitle}</p>
            )}
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            {enableZoom && (
              <button
                onClick={resetZoom}
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius hover:glass-surface-subtle glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                Reset Zoom
              </button>
            )}

            <div className="glass-flex glass-border glass-border-subtle glass-radius glass-overflow-hidden">
              <button
                onClick={() => exportChart("csv")}
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary hover:glass-surface-subtle glass-border-r glass-border-subtle glass-focus glass-touch-target glass-contrast-guard"
              >
                CSV
              </button>
              <button
                onClick={() => exportChart("json")}
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-subtle glass-text-secondary hover:glass-surface-subtle glass-focus glass-touch-target glass-contrast-guard"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Drill-down breadcrumbs */}
        {enableDrillDown && appliedFilters.length > 0 && (
          <div className="glass-flex glass-items-center glass-gap-2 glass-mb-4 glass-text-sm glass-text-secondary">
            <span>📊</span>
            <span>Filtered by:</span>
            {appliedFilters.map((filter, index) => (
              <span
                key={index}
                className="glass-px-2 glass-py-1 glass-surface-subtle glass-text-primary glass-radius glass-flex glass-items-center glass-gap-1"
              >
                {filter.field}: {formatValue(filter.value)}
                <button
                  onClick={() =>
                    setAppliedFilters((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="glass-text-primary hover:glass-text-primary glass-ml-1 glass-focus glass-touch-target glass-contrast-guard"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="glass-relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ maxWidth: "100%", height: "auto" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() =>
              setTooltip((prev) => ({ ...prev, visible: false }))
            }
            onWheel={(e) => {
              e.preventDefault();
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                const centerX =
                  (e.clientX - rect.left - chartDimensions.margin.left) /
                  chartDimensions.chartWidth;
                const centerY =
                  (e.clientY - rect.top - chartDimensions.margin.top) /
                  chartDimensions.chartHeight;
                handleZoom(e.deltaY, centerX, centerY);
              }
            }}
            className="glass-border glass-border-subtle glass-radius"
          >
            <g
              transform={`translate(${chartDimensions.margin.left}, ${chartDimensions.margin.top})`}
            >
              {renderAxes()}

              {type === "line" || type === "combo" ? renderLineChart() : null}
              {type === "bar" || type === "combo" ? renderBarChart() : null}

              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="var(--glass-gray-100)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect
                width={chartDimensions.chartWidth}
                height={chartDimensions.chartHeight}
                fill="url(#grid)"
                opacity="0.5"
              />
            </g>
          </svg>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-mt-4 glass-pt-4 glass-border-t glass-border-subtle">
            {processedData.map((series) => (
              <button
                key={series.id}
                onClick={() => toggleSeries(series.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded text-sm transition-opacity glass-focus glass-touch-target glass-contrast-guard",
                  selectedSeries.includes(series.id)
                    ? "opacity-100"
                    : "opacity-50"
                )}
              >
                <div
                  className="glass-w-3 glass-h-3 glass-radius-full"
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
          className="glass-fixed glass-z-50 glass-px-3 glass-py-2 glass-surface-subtle glass-text-primary glass-text-sm glass-radius glass-shadow-lg glass-pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform:
              tooltip.x > window.innerWidth - 200
                ? "translateX(-100%)"
                : "none",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
