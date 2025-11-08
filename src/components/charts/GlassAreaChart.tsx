import { cn } from "../../lib/utilsComprehensive";
import React, { useMemo, useState } from "react";
import { Motion } from "../../primitives";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface AreaDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface AreaSeries {
  id: string;
  name: string;
  data: AreaDataPoint[];
  color?: string;
  strokeWidth?: number;
  fillOpacity?: number;
}

export interface GlassAreaChartProps {
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart data series
   */
  series: AreaSeries[];
  /**
   * Chart width
   */
  width?: number;
  /**
   * Chart height
   */
  height?: number;
  /**
   * Show grid lines
   */
  showGrid?: boolean;
  /**
   * Show data points
   */
  showPoints?: boolean;
  /**
   * Show legend
   */
  showLegend?: boolean;
  /**
   * X-axis label
   */
  xAxisLabel?: string;
  /**
   * Y-axis label
   */
  yAxisLabel?: string;
  /**
   * Custom colors for series
   */
  colors?: string[];
  /**
   * Animation duration
   */
  animationDuration?: number;
  /**
   * Show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Format function for Y-axis values
   */
  formatYValue?: (value: number) => string;
  /**
   * Format function for X-axis values
   */
  formatXValue?: (value: number | string) => string;
  /**
   * Fill opacity for areas
   */
  fillOpacity?: number;
  /**
   * Show stacked areas
   */
  stacked?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * GlassAreaChart component
 * A glassmorphism area chart with multiple series support and smooth area fills
 */
export const GlassAreaChart: React.FC<GlassAreaChartProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  title,
  series = [],
  width = 600,
  height = 300,
  showGrid = true,
  showPoints = false,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  colors = [
    "var(--glass-color-primary)",
    "var(--glass-color-danger)",
    "var(--glass-color-success)",
    "var(--glass-color-warning)",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "var(--glass-gray-500)",
  ],
  animationDuration = 1200,
  showTooltips = true,
  formatYValue = (value) => value.toString(),
  formatXValue = (value) => value.toString(),
  fillOpacity = 0.6,
  stacked = false,
  className,
  loading = false,
  ...props
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesId: string;
    index: number;
    x: number;
    y: number;
    values: number[];
  } | null>(null);

  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);

  // Chart dimensions with padding
  const padding = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Process data for chart
  const processedData = useMemo(() => {
    if (!series || !Array.isArray(series) || series.length === 0) {
      return { scaledSeries: [], xLabels: [], yLabels: [] };
    }

    // Find min/max values across all series
    const allPoints = series.flatMap((s) => s.data);
    const allXAreNumeric = allPoints.every((p) => typeof p.x === "number");
    const xValues = allPoints.map((p: any) =>
      typeof p.x === "number" ? p.x : 0
    );
    const yValues = allPoints.map((p: any) => p.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    let yMin = Math.min(...yValues);
    let yMax = Math.max(...yValues);

    // For stacked charts, calculate cumulative values
    let stackedSeries = series;
    let stackedData:
      | Array<
          Array<{
            seriesId: string;
            x: number | string;
            y: number;
            originalY: number;
          }>
        >
      | undefined;

    if (stacked && series.length > 1) {
      // Create stacked data by accumulating values at each x point
      const xPoints = new Set(allPoints.map((p: any) => p.x));
      stackedData = Array.from(xPoints).map((x: any) => {
        let cumulativeY = 0;
        return series.map((s: any) => {
          const point = s.data?.find((p: any) => p.x === x);
          const y = point ? point.y : 0;
          cumulativeY += y;
          return {
            seriesId: s.id,
            x,
            y: cumulativeY,
            originalY: y,
          };
        });
      });

      // Calculate new min/max for stacked chart
      yMin = 0;
      yMax = Math.max(...stackedData!.flat().map((p: any) => p.y));

      // Transform series data for stacked display
      stackedSeries = series.map((s, index) => ({
        ...s,
        data: stackedData!.map((stackPoint: any) => ({
          x: stackPoint[index].x,
          y: stackPoint[index].y,
          label: s.data?.find((p: any) => p.x === stackPoint[index].x)?.label,
        })),
      }));
    }

    // Add some padding to Y axis
    const yRange = yMax - yMin;
    const yPadding =
      yRange === 0 ? (yMax === 0 ? 1 : Math.abs(yMax) * 0.1) : yRange * 0.1;
    const yMinPadded = Math.max(0, yMin - yPadding);
    const yMaxPadded = yMax + yPadding;

    // Scale functions with guards against divide-by-zero/NaN
    const maxPoints = Math.max(
      ...series.map((s: any) => s.data?.length || 0),
      1
    );
    const useOrdinalX = !allXAreNumeric || xMax === xMin;
    const scaleXBy = (x: number, idx: number) => {
      if (chartWidth <= 0) return 0;
      if (useOrdinalX) {
        return maxPoints <= 1 ? 0 : (idx / (maxPoints - 1)) * chartWidth;
      }
      const denom = xMax - xMin || 1;
      return ((x - xMin) / denom) * chartWidth;
    };
    const scaleY = (y: number) => {
      if (chartHeight <= 0) return 0;
      const denom = yMaxPadded - yMinPadded || 1;
      return chartHeight - ((y - yMinPadded) / denom) * chartHeight;
    };

    // Process each series
    const scaledSeries = stackedSeries.map((s, seriesIndex) => {
      const rawPoints = s.data || [];
      const points = rawPoints
        .map((point, pointIndex) => {
          const sx =
            padding.left +
            scaleXBy(
              typeof point.x === "number" ? (point.x as number) : 0,
              pointIndex
            );
          const sy = padding.top + scaleY(point.y);
          return {
            ...point,
            scaledX: Number.isFinite(sx) ? sx : padding.left,
            scaledY: Number.isFinite(sy) ? sy : padding.top + chartHeight,
            originalY:
              stacked && stackedData
                ? stackedData.find(
                    (sd: any) => sd[seriesIndex].x === point.x
                  )?.[seriesIndex].originalY || point.y
                : point.y,
          };
        })
        .filter(
          (p: any) => Number.isFinite(p.scaledX) && Number.isFinite(p.scaledY)
        );

      // Generate area path
      let areaPath = "";
      if ((points?.length || 0) > 0) {
        // Start from bottom-left
        areaPath = `M ${points[0].scaledX} ${padding.top + chartHeight}`;

        // Draw to first point
        areaPath += ` L ${points[0].scaledX} ${points[0].scaledY}`;

        // Draw through all points
        for (let i = 1; i < (points?.length || 0); i++) {
          areaPath += ` L ${points[i].scaledX} ${points[i].scaledY}`;
        }

        // Draw back to bottom-right and close
        areaPath += ` L ${points[(points?.length || 0) - 1].scaledX} ${padding.top + chartHeight} Z`;
      }

      return {
        ...s,
        color: s.color || colors[seriesIndex % (colors?.length || 0)],
        points,
        areaPath,
      };
    });

    // Generate axis labels
    const xLabels = (scaledSeries[0]?.points || []).map((point) => ({
      x: Number.isFinite(point.scaledX) ? point.scaledX : padding.left,
      y: height - padding.bottom + 20,
      label: formatXValue(point.x),
    }));

    const yLabels = [0, 0.25, 0.5, 0.75, 1].map((ratio: any) => {
      const value = yMinPadded + (yMaxPadded - yMinPadded) * ratio;
      return {
        x: padding.left - 10,
        y: padding.top + chartHeight - chartHeight * ratio + 4,
        label: formatYValue(value),
      };
    });

    return { scaledSeries, xLabels, yLabels };
  }, [
    series,
    width,
    height,
    padding,
    chartWidth,
    chartHeight,
    formatYValue,
    formatXValue,
    colors,
    stacked,
  ]);

  // Generate path for line
  const generatePath = (points: any[]) => {
    const valid = (points || []).filter(
      (p: any) => Number.isFinite(p?.scaledX) && Number.isFinite(p?.scaledY)
    );
    if (valid.length === 0) return "";
    let path = `M ${valid[0].scaledX} ${valid[0].scaledY}`;
    for (let i = 1; i < valid.length; i++) {
      path += ` L ${valid[i].scaledX} ${valid[i].scaledY}`;
    }
    return path;
  };

  // Handle point hover
  const handlePointHover = (
    seriesId: string,
    pointIndex: number,
    x: number,
    y: number,
    _event: React.MouseEvent
  ) => {
    if (showTooltips) {
      const values = processedData.scaledSeries.map(
        (s: any) => s.points[pointIndex]?.originalY || 0
      );
      setHoveredPoint({ seriesId, index: pointIndex, x, y, values });
    }
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  // Loading skeleton
  if (loading) {
    return (
      <GlassCard data-glass-component className={cn("glass-p-6", className)}>
        <div className="animate-pulse glass-gap-4">
          <div className="h-6 glass-surface-subtle/20 glass-radius-md w-48"></div>
          <div className="h-64 glass-surface-subtle/10 glass-radius-md"></div>
          <div className="glass-flex glass-justify-center glass-gap-4">
            <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
            <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
            <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <Motion preset="fadeIn" className="glass-w-full">
      <GlassCard className={cn("overflow-hidden", className)} {...props}>
        {title && (
          <CardHeader>
            <CardTitle className="text-primary glass-text-lg font-semibold">
              {title}
            </CardTitle>
          </CardHeader>
        )}

        <CardContent className="glass-p-4">
          <div className="relative glass-chart">
            <svg width={width} height={height} className="overflow-visible">
              {/* Grid lines */}
              {showGrid && (
                <g className="opacity-20">
                  {/* Horizontal grid lines */}
                  {processedData.yLabels.map((label, index) => (
                    <line
                      key={`h-grid-${index}`}
                      x1={padding.left}
                      y1={label.y - 4}
                      x2={width - padding.right}
                      y2={label.y - 4}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-primary/30"
                    />
                  ))}
                  {/* Vertical grid lines */}
                  {processedData.xLabels.map((label, index) => (
                    <line
                      key={`v-grid-${index}`}
                      x1={label.x}
                      y1={padding.top}
                      x2={label.x}
                      y2={height - padding.bottom}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-primary/30"
                    />
                  ))}
                </g>
              )}

              {/* Area fills (drawn first, behind lines) */}
              {processedData.scaledSeries.map((s, seriesIndex) => (
                <Motion
                  key={`${s.id}-area`}
                  preset="fadeIn"
                  delay={seriesIndex * 200}
                  className="relative"
                >
                  <defs>
                    <linearGradient
                      id={`area-gradient-${s.id}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={s.color}
                        stopOpacity={fillOpacity}
                      />
                      <stop
                        offset="100%"
                        stopColor={s.color}
                        stopOpacity={fillOpacity * 0.3}
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d={s.areaPath}
                    fill={`url(#area-gradient-${s.id})`}
                    className="transition-opacity duration-300 hover:opacity-80"
                    style={{
                      animation: `areaFill ${animationDuration}ms ease-out ${seriesIndex * 200}ms both`,
                      opacity:
                        hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                    }}
                  />
                </Motion>
              ))}

              {/* Chart lines */}
              {processedData.scaledSeries.map((s, seriesIndex) => (
                <Motion
                  key={`${s.id}-line`}
                  preset="slideUp"
                  delay={seriesIndex * 100 + 300}
                  className="relative"
                >
                  {/* Line */}
                  <path
                    d={generatePath(s.points)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={s.strokeWidth || 2}
                    className="drop-shadow-sm"
                    style={{
                      animation: `drawLine ${animationDuration}ms ease-out ${seriesIndex * 100 + 300}ms both`,
                      opacity:
                        hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                    }}
                  />

                  {/* Data points */}
                  {showPoints &&
                    s.points.map((point, pointIndex) => (
                      <circle
                        key={`${s.id}-point-${pointIndex}`}
                        cx={point.scaledX}
                        cy={point.scaledY}
                        r="4"
                        fill={s.color}
                        stroke="rgba(var(--glass-color-white) / var(--glass-opacity-80))"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all duration-200"
                        role="button"
                        tabIndex={0}
                        aria-label={`Data point ${pointIndex + 1} of ${s.name}: ${formatXValue(point.x)}, ${formatYValue(point.originalY || point.y)}`}
                        onMouseEnter={(e) =>
                          handlePointHover(
                            s.id,
                            pointIndex,
                            point.scaledX,
                            point.scaledY,
                            e
                          )
                        }
                        onMouseLeave={handlePointLeave}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePointHover(
                              s.id,
                              pointIndex,
                              point.scaledX,
                              point.scaledY,
                              e as any
                            );
                          }
                        }}
                        style={{
                          animation: `fadeInPoint 300ms ease-out ${animationDuration + seriesIndex * 100 + pointIndex * 50 + 300}ms both`,
                          opacity:
                            hoveredSeriesId && hoveredSeriesId !== s.id
                              ? 0.35
                              : 1,
                        }}
                      />
                    ))}
                </Motion>
              ))}

              {/* Crosshair */}
              {hoveredPoint && (
                <g className="pointer-events-none">
                  <line
                    x1={hoveredPoint.x}
                    y1={padding.top}
                    x2={hoveredPoint.x}
                    y2={height - padding.bottom}
                    stroke="white"
                    strokeOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={padding.left}
                    y1={hoveredPoint.y}
                    x2={width - padding.right}
                    y2={hoveredPoint.y}
                    stroke="white"
                    strokeOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="8"
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.35}
                  />
                </g>
              )}

              {/* X-axis */}
              <line
                x1={padding.left}
                y1={height - padding.bottom}
                x2={width - padding.right}
                y2={height - padding.bottom}
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/50"
              />

              {/* Y-axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/50"
              />

              {/* Axis labels */}
              {processedData.xLabels.map((label, index) => (
                <text
                  key={`x-label-${index}`}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  className="glass-text-xs fill-white/70"
                  style={{ fontSize: "0.625rem" }}
                >
                  {label.label}
                </text>
              ))}

              {processedData.yLabels.map((label, index) => (
                <text
                  key={`y-label-${index}`}
                  x={label.x}
                  y={label.y}
                  textAnchor="end"
                  className="glass-text-xs fill-white/70"
                  style={{ fontSize: "0.625rem" }}
                >
                  {label.label}
                </text>
              ))}

              {/* Axis titles */}
              {xAxisLabel && (
                <text
                  x={width / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="glass-text-sm fill-white/80 font-medium"
                >
                  {xAxisLabel}
                </text>
              )}

              {yAxisLabel && (
                <text
                  x={15}
                  y={height / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, 15, ${height / 2})`}
                  className="glass-text-sm fill-white/80 font-medium"
                >
                  {yAxisLabel}
                </text>
              )}
            </svg>

            {/* Tooltip */}
            {hoveredPoint && (
              <Motion preset="fadeIn" className="absolute z-10">
                <div
                  role="tooltip"
                  aria-live="polite"
                  className={cn(
                    "absolute glass-radius-xl glass-p-3 shadow-xl",
                    "bg-black/70 glass-backdrop-blur-md ring-1 ring-white/10 glass-radial-reveal glass-lift"
                  )}
                  style={{
                    left: hoveredPoint.x + 10,
                    top: hoveredPoint.y - 10,
                    transform:
                      hoveredPoint.x > width / 2 ? "translateX(-100%)" : "none",
                  }}
                >
                  <div className="text-primary glass-text-sm glass-gap-2">
                    <div className="font-medium">
                      {processedData.scaledSeries[0]?.points[
                        hoveredPoint.index
                      ] &&
                        formatXValue(
                          processedData.scaledSeries[0].points[
                            hoveredPoint.index
                          ].x
                        )}
                    </div>
                    {processedData.scaledSeries.map((s, index) => (
                      <div
                        key={s.id}
                        className="glass-flex glass-items-center glass-gap-2"
                      >
                        <div
                          className="w-3 h-3 glass-radius-md"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-primary/80">
                          {s.name}:{" "}
                          {formatYValue(hoveredPoint.values?.[index] || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Motion>
            )}
          </div>

          {/* Legend */}
          {showLegend && (processedData.scaledSeries?.length || 0) > 0 && (
            <div className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4 mt-6">
              {processedData.scaledSeries.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md transition-all duration-200 hover:-translate-y-0.5",
                    hoveredSeriesId && hoveredSeriesId !== s.id
                      ? "opacity-50"
                      : "opacity-100"
                  )}
                  onMouseEnter={() => setHoveredSeriesId(s.id)}
                  onMouseLeave={() => setHoveredSeriesId(null)}
                >
                  <div
                    className="w-3 h-3 glass-radius-md"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="glass-text-sm text-primary/80">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </GlassCard>
    </Motion>
  );
};

export default GlassAreaChart;
