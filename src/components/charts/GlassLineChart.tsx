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

const toFiniteNumber = (value: unknown, fallback = 0): number => {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : fallback;
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const getSeriesColor = (
  explicitColor: string | undefined,
  colors: string[],
  index: number
) => explicitColor || colors[index % Math.max(1, colors.length)] || "#70d6ff";

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

export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color?: string;
  strokeWidth?: number;
}

export interface GlassLineChartProps {
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart data series
   */
  series: ChartSeries[];
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
   * Custom className
   */
  className?: string;
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * GlassLineChart component
 * A glassmorphism line chart with multiple series support and interactive features
 */
export const GlassLineChart: React.FC<GlassLineChartProps> = ({
  title,
  series = [],
  width = 600,
  height = 300,
  showGrid = true,
  showPoints = true,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  colors = DEFAULT_CHART_COLORS,
  animationDuration = ANIMATION.DURATION.normal,
  showTooltips = true,
  formatYValue = (value) => value.toString(),
  formatXValue = (value) => value.toString(),
  className,
  loading = false,
  ...props
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesId: string;
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);

  // Chart dimensions with padding
  const padding = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);

  // Process data for chart
  const processedData = useMemo(() => {
    if (!series || !Array.isArray(series) || series.length === 0) {
      return { scaledSeries: [], xLabels: [], yLabels: [] };
    }

    const sanitizedSeries = series.map((s) => ({
      ...s,
      data: (Array.isArray(s.data) ? s.data : [])
        .map((point, pointIndex) => ({
          ...point,
          x: point?.x ?? pointIndex,
          y: toFiniteNumber(point?.y),
        }))
        .filter((point) => Number.isFinite(point.y)),
    }));

    const allPoints = sanitizedSeries.flatMap((s) => s.data);
    if (allPoints.length === 0) {
      return { scaledSeries: [], xLabels: [], yLabels: [] };
    }

    const allXAreNumeric = allPoints.every((p) => typeof p.x === "number");
    const xValues = allPoints.map((p: any) =>
      typeof p.x === "number" && Number.isFinite(p.x) ? p.x : 0
    );
    const yValues = allPoints.map((p: any) => p.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Add some padding to Y axis
    const yRange = yMax - yMin;
    const yPadding =
      yRange === 0 ? (yMax === 0 ? 1 : Math.abs(yMax) * 0.1) : yRange * 0.1;
    const yMinPadded = Math.max(0, yMin - yPadding);
    const yMaxPadded = yMax + yPadding;

    const maxPoints = Math.max(...sanitizedSeries.map((s) => s.data.length), 1);
    const useOrdinalX = !allXAreNumeric || xMax === xMin;
    const scaleX = (x: number, index: number) => {
      if (useOrdinalX) {
        return maxPoints <= 1
          ? chartWidth / 2
          : (index / (maxPoints - 1)) * chartWidth;
      }
      return ((x - xMin) / (xMax - xMin || 1)) * chartWidth;
    };
    const scaleY = (y: number) =>
      chartHeight -
      ((y - yMinPadded) / (yMaxPadded - yMinPadded || 1)) * chartHeight;

    // Process each series
    const scaledSeries = sanitizedSeries.map((s, seriesIndex) => ({
      ...s,
      color: getSeriesColor(s.color, colors, seriesIndex),
      points: s.data
        .map((point, pointIndex) => {
          const scaledX =
            padding.left +
            scaleX(typeof point.x === "number" ? point.x : 0, pointIndex);
          const scaledY = padding.top + scaleY(point.y);
          return {
            ...point,
            scaledX: Number.isFinite(scaledX) ? scaledX : padding.left,
            scaledY: Number.isFinite(scaledY)
              ? scaledY
              : padding.top + chartHeight,
            originalIndex: pointIndex,
          };
        })
        .filter(
          (point) =>
            Number.isFinite(point.scaledX) && Number.isFinite(point.scaledY)
        ),
    }));

    // Generate axis labels
    const xLabels =
      scaledSeries[0]?.points.map((point, index) => ({
        x: point.scaledX,
        y: height - padding.bottom + 20,
        label: formatXValue(point.x),
      })) || [];

    const yLabels = [0, 0.25, 0.5, 0.75, 1].map((ratio: any) => {
      const value = yMinPadded + (yMaxPadded - yMinPadded) * ratio;
      return {
        x: padding.left - 10,
        y: padding.top + chartHeight - chartHeight * ratio,
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
  ]);

  // Generate path for line
  const generatePath = (points: any[]) => {
    const validPoints = (points || []).filter(
      (point) =>
        Number.isFinite(point?.scaledX) && Number.isFinite(point?.scaledY)
    );
    if (validPoints.length === 0) return "";

    let path = `M ${validPoints[0].scaledX} ${validPoints[0].scaledY}`;
    for (let i = 1; i < validPoints.length; i++) {
      path += ` L ${validPoints[i].scaledX} ${validPoints[i].scaledY}`;
    }
    return path;
  };

  // Handle point hover
  const handlePointHover = (
    seriesId: string,
    pointIndex: number,
    x: number,
    y: number
  ) => {
    if (showTooltips) {
      setHoveredPoint({ seriesId, index: pointIndex, x, y });
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
          <div className="glass-relative glass-w-full glass-overflow-hidden">
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
                      y1={label.y}
                      x2={width - padding.right}
                      y2={label.y}
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

              {/* Chart lines */}
              {processedData.scaledSeries.map((s, seriesIndex) => (
                <g key={s.id}>
                  {/* Line */}
                  <path
                    d={generatePath(s.points)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={s.strokeWidth || 2}
                    className="glass-drop-glass-shadow-sm"
                    style={{
                      animation: `drawLine ${animationDuration}ms ease-out ${seriesIndex * 100}ms both`,
                      opacity:
                        hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                    }}
                  />

                  {/* Area fill (optional) */}
                  <defs>
                    <linearGradient
                      id={`gradient-${s.id}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>

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
                        onMouseEnter={() =>
                          handlePointHover(
                            s.id,
                            pointIndex,
                            point.scaledX,
                            point.scaledY
                          )
                        }
                        onMouseLeave={handlePointLeave}
                        style={{
                          animation: `fadeInPoint 300ms ease-out ${animationDuration + seriesIndex * 100 + pointIndex * 50}ms both`,
                          opacity:
                            hoveredSeriesId && hoveredSeriesId !== s.id
                              ? 0.35
                              : 1,
                        }}
                      />
                    ))}
                </g>
              ))}

              {/* Crosshair when hovering a point */}
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
                  {/* Highlight ring around hovered point */}
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
                  y={label.y + 4}
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
                  <div className="glass-text-primary glass-text-sm">
                    <ContrastGuard>
                      <div className="glass-font-medium">
                        {
                          processedData.scaledSeries.find(
                            (s) => s.id === hoveredPoint.seriesId
                          )?.name
                        }
                      </div>
                      <div className="glass-text-primary-glass-opacity-80">
                        {(() => {
                          const series = processedData.scaledSeries.find(
                            (s) => s.id === hoveredPoint.seriesId
                          );
                          const dataPoint = series?.data?.[hoveredPoint.index];
                          if (dataPoint) {
                            return `${formatXValue(dataPoint.x)}: ${formatYValue(dataPoint.y)}`;
                          }
                          return "";
                        })()}
                      </div>
                    </ContrastGuard>
                  </div>
                </div>
              </Motion>
            )}
          </div>

          {/* Legend */}
          {showLegend && (processedData.scaledSeries?.length || 0) > 0 && (
            <div
              className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4 glass-mt-6"
              role="list"
              aria-label="Chart legend"
            >
              {processedData.scaledSeries.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    `glass-flex glass-items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md glass-transition-all glass-duration-[${ANIMATION.DURATION.fast}ms] glass-hover--translate-y-0-5`,
                    hoveredSeriesId && hoveredSeriesId !== s.id
                      ? "glass-opacity-50"
                      : "glass-opacity-100"
                  )}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${s.name} data series`}
                  onMouseEnter={() => setHoveredSeriesId(s.id)}
                  onMouseLeave={() => setHoveredSeriesId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setHoveredSeriesId(
                        hoveredSeriesId === s.id ? null : s.id
                      );
                    }
                  }}
                >
                  <div
                    className="glass-w-3 glass-h-3 glass-radius-full"
                    style={{ backgroundColor: s.color }}
                    aria-hidden="true"
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

// Chart container component
export interface GlassChartContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const GlassChartContainer: React.FC<GlassChartContainerProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <GlassCard className={cn("glass-p-6", className)}>
      {(title || subtitle) && (
        <div className="glass-mb-6">
          {title && (
            <ContrastGuard>
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-1">
                {title}
              </h3>
            </ContrastGuard>
          )}
          {subtitle && (
            <ContrastGuard>
              <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                {subtitle}
              </p>
            </ContrastGuard>
          )}
        </div>
      )}
      {children}
    </GlassCard>
  );
};

export default GlassLineChart;
