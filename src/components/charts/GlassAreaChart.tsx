"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, { useMemo, useState } from "react";
import { Motion } from "../../primitives";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

const DEFAULT_CHART_COLORS = [
  "#70d6ff",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#22d3ee",
  "#fb7185",
  "#c084fc",
  "#60a5fa",
  "#94a3b8",
];

const AXIS_TEXT_FILL = "rgba(226, 232, 240, 0.78)";
const AXIS_TITLE_FILL = "rgba(226, 232, 240, 0.88)";
const CROSSHAIR_STROKE = "rgba(255, 255, 255, 0.28)";

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
  title,
  series = [],
  width = 600,
  height = 300,
  showGrid = true,
  showPoints = false,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  colors = DEFAULT_CHART_COLORS,
  animationDuration = ANIMATION.DURATION.slow,
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
        <div className="glass-animate-pulse glass-gap-4">
          <div className="glass-h-6 glass-surface-subtle/20 glass-radius-md glass-w-48"></div>
          <div className="glass-h-64 glass-surface-subtle/10 glass-radius-md"></div>
          <div className="glass-flex glass-justify-center glass-gap-4">
            <div className="glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20"></div>
            <div className="glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20"></div>
            <div className="glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20"></div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <Motion preset="fadeIn" className="glass-w-full">
      <GlassCard className={cn("glass-overflow-hidden", className)} {...props}>
        {title && (
          <CardHeader>
            <CardTitle className="glass-text-primary glass-text-lg glass-font-semibold">
              {title}
            </CardTitle>
          </CardHeader>
        )}

        <CardContent className="glass-p-4">
          <div className="glass-relative glass-w-full glass-overflow-hidden glass-chart">
            <svg
              width="100%"
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="glass-overflow-hidden"
              style={{
                display: "block",
                maxWidth: "100%",
                minWidth: 0,
                minHeight: height,
              }}
            >
              {/* Grid lines */}
              {showGrid && (
                <g className="glass-opacity-20">
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
                      className="glass-text-primary-glass-opacity-30"
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
                      className="glass-text-primary-glass-opacity-30"
                    />
                  ))}
                </g>
              )}

              {/* Area fills (drawn first, behind lines) */}
              {processedData.scaledSeries.map((s, seriesIndex) => (
                <g key={`${s.id}-area`}>
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
                    className={`glass-transition-opacity glass-duration-[${ANIMATION.DURATION.normal}ms] hover:glass-opacity-80`}
                    style={{
                      animation: `areaFill ${animationDuration}ms ease-out ${seriesIndex * 200}ms both`,
                      opacity:
                        hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                    }}
                  />
                </g>
              ))}

              {/* Chart lines */}
              {processedData.scaledSeries.map((s, seriesIndex) => (
                <g key={`${s.id}-line`}>
                  {/* Line */}
                  <path
                    d={generatePath(s.points)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={s.strokeWidth || 2}
                    className="glass-drop-glass-shadow-sm"
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
                        stroke="color-mix(in srgb, var(--glass-white) 80%, transparent)"
                        strokeWidth="2"
                        className={`glass-cursor-pointer glass-hover-r-6 glass-transition-all glass-duration-[${ANIMATION.DURATION.fast}ms]`}
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
                </g>
              ))}

              {/* Crosshair */}
              {hoveredPoint && (
                <g className="glass-pointer-events-none">
                  <line
                    x1={hoveredPoint.x}
                    y1={padding.top}
                    x2={hoveredPoint.x}
                    y2={height - padding.bottom}
                    stroke={CROSSHAIR_STROKE}
                    strokeOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={padding.left}
                    y1={hoveredPoint.y}
                    x2={width - padding.right}
                    y2={hoveredPoint.y}
                    stroke={CROSSHAIR_STROKE}
                    strokeOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="8"
                    fill="none"
                    stroke={CROSSHAIR_STROKE}
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
                className="glass-text-primary-glass-opacity-50"
              />

              {/* Y-axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                stroke="currentColor"
                strokeWidth="1"
                className="glass-text-primary-glass-opacity-50"
              />

              {/* Axis labels */}
              {processedData.xLabels.map((label, index) => (
                <text
                  key={`x-label-${index}`}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  className="glass-text-xs"
                  style={{ fill: AXIS_TEXT_FILL, fontSize: "0.625rem" }}
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
                  className="glass-text-xs"
                  style={{ fill: AXIS_TEXT_FILL, fontSize: "0.625rem" }}
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
                  className="glass-text-sm glass-font-medium"
                  style={{ fill: AXIS_TITLE_FILL }}
                >
                  <ContrastGuard>{xAxisLabel}</ContrastGuard>
                </text>
              )}

              {yAxisLabel && (
                <text
                  x={15}
                  y={height / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, 15, ${height / 2})`}
                  className="glass-text-sm glass-font-medium"
                  style={{ fill: AXIS_TITLE_FILL }}
                >
                  <ContrastGuard>{yAxisLabel}</ContrastGuard>
                </text>
              )}
            </svg>

            {/* Tooltip */}
            {hoveredPoint && (
              <Motion preset="fadeIn" className="glass-absolute glass-z-10">
                <div
                  role="tooltip"
                  aria-live="polite"
                  className={cn(
                    "glass-absolute glass-radius-xl glass-p-3 glass-shadow-xl",
                    "glass-surface-overlay glass-backdrop-blur-md glass-border glass-border-subtle glass-radial-reveal glass-lift"
                  )}
                  style={{
                    left: hoveredPoint.x + 10,
                    top: hoveredPoint.y - 10,
                    transform:
                      hoveredPoint.x > width / 2 ? "translateX(-100%)" : "none",
                  }}
                >
                  <div className="glass-text-primary glass-text-sm glass-gap-2">
                    <ContrastGuard>
                      <div className="glass-font-medium">
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
                            className="glass-w-3 glass-h-3 glass-radius-md"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="glass-text-primary-glass-opacity-80">
                            {s.name}:{" "}
                            {formatYValue(hoveredPoint.values?.[index] || 0)}
                          </span>
                        </div>
                      ))}
                    </ContrastGuard>
                  </div>
                </div>
              </Motion>
            )}
          </div>

          {/* Legend */}
          {showLegend && (processedData.scaledSeries?.length || 0) > 0 && (
            <div className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4 glass-mt-6">
              {processedData.scaledSeries.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    `glass-flex glass-items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md glass-transition-all glass-duration-[${ANIMATION.DURATION.fast}ms] glass-hover--translate-y-0-5`,
                    hoveredSeriesId && hoveredSeriesId !== s.id
                      ? "glass-opacity-50"
                      : "glass-opacity-100"
                  )}
                  onMouseEnter={() => setHoveredSeriesId(s.id)}
                  onMouseLeave={() => setHoveredSeriesId(null)}
                >
                  <div
                    className="glass-w-3 glass-h-3 glass-radius-md"
                    style={{ backgroundColor: s.color }}
                  />
                  <ContrastGuard>
                    <span className="glass-text-sm glass-text-primary-glass-opacity-80">
                      {s.name}
                    </span>
                  </ContrastGuard>
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
