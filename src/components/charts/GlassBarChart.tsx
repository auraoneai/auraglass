import { cn } from "../../lib/utilsComprehensive";
import React, { useMemo, useState } from "react";
import { Motion } from "../../primitives";
import {
  CardContent,
  CardHeader,
  CardTitle,
  GlassCard,
} from "../card/GlassCard";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface BarDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface BarSeries {
  id: string;
  name: string;
  data: BarDataPoint[];
  color?: string;
}

export interface GlassBarChartProps {
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart data series
   */
  series: BarSeries[];
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
   * Show data labels on bars
   */
  showDataLabels?: boolean;
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
  formatXValue?: (value: string | number) => string;
  /**
   * Bar orientation (vertical or horizontal)
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Bar padding between groups
   */
  barPadding?: number;
  /**
   * Bar width ratio
   */
  barWidthRatio?: number;
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
 * GlassBarChart component
 * A glassmorphism bar chart with multiple series support and interactive features
 */
export const GlassBarChart: React.FC<GlassBarChartProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  title,
  series = [],
  width = 600,
  height = 400,
  showGrid = true,
  showDataLabels = false,
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
  animationDuration = 1000,
  showTooltips = true,
  formatYValue = (value) => value.toString(),
  formatXValue = (value) => value.toString(),
  orientation = "vertical",
  barPadding = 0.1,
  barWidthRatio = 0.8,
  className,
  loading = false,
  ...props
}) => {
  const [hoveredBar, setHoveredBar] = useState<{
    seriesId: string;
    dataIndex: number;
    x: number;
    y: number;
    value: number;
  } | null>(null);
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);

  // Chart dimensions with padding
  const padding = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Process data for chart
  const processedData = useMemo(() => {
    if (!series || !Array.isArray(series) || series.length === 0) {
      return { bars: [], xLabels: [], yLabels: [] };
    }

    // Combine all data points from all series
    const allDataPoints: Array<{
      seriesId: string;
      seriesIndex: number;
      data: BarDataPoint;
      index: number;
    }> = [];

    series.forEach((s, seriesIndex) => {
      s.data?.forEach((dataPoint, dataIndex) => {
        allDataPoints.push({
          seriesId: s.id,
          seriesIndex,
          data: dataPoint,
          index: dataIndex,
        });
      });
    });

    // Group by X value (for grouped bars)
    const groupedData = new Map<
      string | number,
      Array<{
        seriesId: string;
        seriesIndex: number;
        data: BarDataPoint;
        index: number;
      }>
    >();

    allDataPoints.forEach((point: any) => {
      const key = point.data?.x;
      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key)!.push(point);
    });

    // Find min/max values
    const allYValues = allDataPoints.map((p: any) => p.data?.y);
    const yMin = Math.min(...allYValues);
    const yMax = Math.max(...allYValues);

    // Add some padding to Y axis
    const yRange = yMax - yMin;
    const yPadding = yRange * 0.1;
    const yMinPadded = Math.max(0, yMin - yPadding);
    const yMaxPadded = yMax + yPadding;

    // Scale functions
    const scaleY = (y: number) => {
      if (orientation === "vertical") {
        return (
          chartHeight -
          ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * chartHeight
        );
      } else {
        return ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * chartWidth;
      }
    };

    // Generate bars
    const bars: Array<{
      seriesId: string;
      seriesIndex: number;
      dataIndex: number;
      x: number;
      y: number;
      width: number;
      height: number;
      value: number;
      label: string;
      color: string;
    }> = [];

    const xLabels: Array<{ x: number; y: number; label: string }> = [];
    const numGroups = groupedData.size;
    const groupWidth =
      orientation === "vertical"
        ? chartWidth / numGroups
        : chartHeight / numGroups;

    let groupIndex = 0;
    groupedData.forEach((group, xValue) => {
      const groupStart =
        orientation === "vertical"
          ? padding.left + groupIndex * groupWidth
          : padding.top + groupIndex * groupWidth;

      const barsInGroup = group?.length || 0;
      const barWidth =
        (groupWidth * barWidthRatio - (barsInGroup - 1) * barPadding) /
        barsInGroup;

      group.forEach((point, barIndex) => {
        const currentSeries = series?.[point.seriesIndex];
        const color =
          point.data?.color ||
          currentSeries.color ||
          colors[point.seriesIndex % (colors?.length || 0)];

        if (orientation === "vertical") {
          const barX =
            groupStart +
            barIndex * (barWidth + barPadding) +
            (groupWidth - groupWidth * barWidthRatio) / 2;
          const barHeight = chartHeight - scaleY(point.data?.y);
          const barY = padding.top + scaleY(point.data?.y);

          bars.push({
            seriesId: point.seriesId,
            seriesIndex: point.seriesIndex,
            dataIndex: point.index,
            x: barX,
            y: barY,
            width: barWidth,
            height: barHeight,
            value: point.data?.y,
            label: point.data?.label || formatXValue(point.data?.x),
            color,
          });
        } else {
          // Horizontal bars
          const barY =
            groupStart +
            barIndex * (barWidth + barPadding) +
            (groupWidth - groupWidth * barWidthRatio) / 2;
          const barWidthH = scaleY(point.data?.y);
          const barX = padding.left;

          bars.push({
            seriesId: point.seriesId,
            seriesIndex: point.seriesIndex,
            dataIndex: point.index,
            x: barX,
            y: barY,
            width: barWidthH,
            height: barWidth,
            value: point.data?.y,
            label: point.data?.label || formatXValue(point.data?.x),
            color,
          });
        }
      });

      // Add X label
      if (orientation === "vertical") {
        xLabels.push({
          x: groupStart + groupWidth / 2,
          y: height - padding.bottom + 20,
          label: formatXValue(xValue),
        });
      } else {
        xLabels.push({
          x: groupStart + groupWidth / 2,
          y: padding.left - 10,
          label: formatXValue(xValue),
        });
      }

      groupIndex++;
    });

    // Generate Y axis labels
    const yLabels = [0, 0.25, 0.5, 0.75, 1].map((ratio: any) => {
      const value = yMinPadded + (yMaxPadded - yMinPadded) * ratio;
      if (orientation === "vertical") {
        return {
          x: padding.left - 10,
          y: padding.top + chartHeight - chartHeight * ratio + 4,
          label: formatYValue(value),
        };
      } else {
        return {
          x: padding.left + chartWidth * ratio,
          y: height - padding.bottom + 20,
          label: formatYValue(value),
        };
      }
    });

    return { bars, xLabels, yLabels };
  }, [
    series,
    width,
    height,
    orientation,
    barPadding,
    barWidthRatio,
    formatYValue,
    formatXValue,
    colors,
  ]);

  // Handle bar hover
  const handleBarHover = (
    bar: (typeof processedData.bars)[0],
    _event: React.MouseEvent
  ) => {
    if (showTooltips) {
      const svgX =
        orientation === "vertical" ? bar.x + bar.width / 2 : bar.x + bar.width;
      const svgY = orientation === "vertical" ? bar.y : bar.y + bar.height / 2;
      setHoveredBar({
        seriesId: bar.seriesId,
        dataIndex: bar.dataIndex,
        x: svgX,
        y: svgY,
        value: bar.value,
      });
    }
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  // Loading skeleton
  if (loading) {
    return (
      <GlassCard data-glass-component className={cn("glass-p-6", className)}>
        <div className="animate-pulse glass-gap-4">
          <div className="h-6 glass-surface-subtle/20 glass-radius-md w-48"></div>
          <div className="h-64 glass-surface-subtle/10 glass-radius-md glass-flex glass-items-end glass-justify-center glass-gap-2">
            {Array.from({ length: 8 }).map((_: any, i: any) => (
              <div
                key={i}
                className="glass-surface-subtle/20 glass-radius-t"
                style={{
                  width: "20px",
                  height: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
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
          <div className="relative">
            <svg width={width} height={height} className="overflow-visible">
              {/* Grid lines */}
              {showGrid && (
                <g className="opacity-20">
                  {processedData.yLabels.map((label, index) => {
                    if (orientation === "vertical") {
                      return (
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
                      );
                    } else {
                      return (
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
                      );
                    }
                  })}
                </g>
              )}

              {/* Bars */}
              {processedData.bars.map((bar, index) => (
                <Motion
                  key={`${bar.seriesId}-${bar.dataIndex}`}
                  preset="slideUp"
                  delay={index * 50}
                  className="relative"
                >
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    style={{
                      animation: `barGrow ${animationDuration}ms ease-out ${index * 50}ms both`,
                    }}
                    onMouseEnter={(e) => handleBarHover(bar, e)}
                    onMouseLeave={handleBarLeave}
                    opacity={
                      hoveredSeriesId && hoveredSeriesId !== bar.seriesId
                        ? 0.35
                        : 1
                    }
                  />

                  {/* Data labels */}
                  {showDataLabels && (
                    <text
                      x={bar.x + bar.width / 2}
                      y={
                        orientation === "vertical"
                          ? bar.y - 5
                          : bar.y + bar.height / 2 + 4
                      }
                      textAnchor="middle"
                      className="glass-text-xs fill-white/80 font-medium"
                      style={{ fontSize: "0.625rem" }}
                    >
                      {formatYValue(bar.value)}
                    </text>
                  )}
                </Motion>
              ))}

              {/* X-axis */}
              {orientation === "vertical" ? (
                <line
                  x1={padding.left}
                  y1={height - padding.bottom}
                  x2={width - padding.right}
                  y2={height - padding.bottom}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/50"
                />
              ) : (
                <line
                  x1={padding.left}
                  y1={height - padding.bottom}
                  x2={padding.left}
                  y2={padding.top}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/50"
                />
              )}

              {/* Y-axis */}
              {orientation === "vertical" ? (
                <line
                  x1={padding.left}
                  y1={padding.top}
                  x2={padding.left}
                  y2={height - padding.bottom}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/50"
                />
              ) : (
                <line
                  x1={padding.left}
                  y1={padding.top}
                  x2={width - padding.right}
                  y2={padding.top}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/50"
                />
              )}

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
                  textAnchor={orientation === "vertical" ? "end" : "middle"}
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

              {yAxisLabel && orientation === "vertical" && (
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

              {yAxisLabel && orientation === "horizontal" && (
                <text
                  x={width / 2}
                  y={15}
                  textAnchor="middle"
                  className="glass-text-sm fill-white/80 font-medium"
                >
                  {yAxisLabel}
                </text>
              )}
            </svg>

            {/* Crosshair and Tooltip */}
            {hoveredBar && (
              <>
                <svg
                  width={width}
                  height={height}
                  className="absolute inset-0 pointer-events-none"
                >
                  {orientation === "vertical" ? (
                    <line
                      x1={hoveredBar.x}
                      y1={padding.top}
                      x2={hoveredBar.x}
                      y2={height - padding.bottom}
                      stroke="white"
                      strokeOpacity={0.25}
                      strokeDasharray="4 4"
                    />
                  ) : (
                    <line
                      x1={padding.left}
                      y1={hoveredBar.y}
                      x2={width - padding.right}
                      y2={hoveredBar.y}
                      stroke="white"
                      strokeOpacity={0.25}
                      strokeDasharray="4 4"
                    />
                  )}
                </svg>
                <Motion preset="fadeIn" className="absolute z-10">
                  <div
                    className={cn(
                      "absolute glass-radius-xl glass-p-3 shadow-xl",
                      "bg-black/70 glass-backdrop-blur-md ring-1 ring-white/10 glass-radial-reveal glass-lift"
                    )}
                    style={{
                      left: hoveredBar.x + 10,
                      top: hoveredBar.y - 10,
                      transform:
                        hoveredBar.x > width / 2 ? "translateX(-100%)" : "none",
                    }}
                  >
                    <div className="text-primary glass-text-sm">
                      <div className="font-medium">
                        {series.find((s) => s.id === hoveredBar.seriesId)?.name}
                      </div>
                      <div className="text-primary/80">
                        Value: {formatYValue(hoveredBar.value)}
                      </div>
                    </div>
                  </div>
                </Motion>
              </>
            )}
          </div>

          {/* Legend */}
          {showLegend && series.length > 0 && (
            <div
              className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4 mt-6"
              role="list"
              aria-label="Chart legend"
            >
              {series.map((s, idx) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md transition-all duration-200 hover:-translate-y-0.5",
                    hoveredSeriesId && hoveredSeriesId !== s.id
                      ? "opacity-50"
                      : "opacity-100"
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
                    className="w-3 h-3 glass-radius-md"
                    style={{
                      backgroundColor:
                        s.color || colors[idx % (colors?.length || 0)],
                    }}
                    aria-hidden="true"
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

export default GlassBarChart;
