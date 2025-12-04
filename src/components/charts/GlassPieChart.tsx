'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, { useMemo, useState, forwardRef } from "react";
import { Motion } from "../../primitives";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface GlassPieChartProps {
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart data
   */
  data: PieDataPoint[];
  /**
   * Chart width and height
   */
  size?: number;
  /**
   * Inner radius for donut chart (0 for pie chart)
   */
  innerRadius?: number;
  /**
   * Show legend
   */
  showLegend?: boolean;
  /**
   * Legend position
   */
  legendPosition?: "right" | "bottom" | "top";
  /**
   * Show data labels on segments
   */
  showLabels?: boolean;
  /**
   * Show percentage labels
   */
  showPercentages?: boolean;
  /**
   * Custom colors for segments
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
   * Format function for values
   */
  formatValue?: (value: number) => string;
  /**
   * Format function for percentages
   */
  formatPercentage?: (percentage: number) => string;
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
 * GlassPieChart component
 * A glassmorphism pie/donut chart with interactive segments and smooth animations
 */
export const GlassPieChart = forwardRef<HTMLDivElement, GlassPieChartProps>(
  function GlassPieChartComponent(
    {
      // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

      title,
      data = [],
      size = 300,
      innerRadius = 0,
      showLegend = true,
      legendPosition = "right",
      showLabels = false,
      showPercentages = true,
      colors,
      animationDuration = 1000,
      showTooltips = true,
      formatValue,
      formatPercentage,
      loading = false,
      className,
      ...props
    },
    ref
  ) {
    const defaultColors = [
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
    ];
    const actualColors = colors || defaultColors;
    const actualAnimationDuration = animationDuration;
    const actualShowTooltips = showTooltips;
    const actualFormatValue = formatValue || ((value) => value.toString());
    const actualFormatPercentage =
      formatPercentage || ((percentage) => `${Math.round(percentage)}%`);
    const actualLoading = loading;
    const [hoveredSegment, setHoveredSegment] = useState<{
      index: number;
      x: number;
      y: number;
      label: string;
      value: number;
      percentage: number;
    } | null>(null);
    const [hoveredLegendIndex, setHoveredLegendIndex] = useState<number | null>(
      null
    );

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - 40) / 2; // Padding around the chart
    const labelRadius = radius + 30; // Distance for labels

    // Process data for chart
    const processedData = useMemo(() => {
      if (!data || !Array.isArray(data) || data?.length === 0) {
        return { segments: [], total: 0 };
      }

      const total = data?.reduce((sum, item) => sum + item?.value, 0);
      let currentAngle = -Math.PI / 2; // Start from top

      const segments = data?.map((item, index) => {
        const percentage = (item?.value / total) * 100;
        const angle = (item?.value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        // Calculate path for segment
        const x1 = centerX + Math.cos(startAngle) * radius;
        const y1 = centerY + Math.sin(startAngle) * radius;
        const x2 = centerX + Math.cos(endAngle) * radius;
        const y2 = centerY + Math.sin(endAngle) * radius;

        const largeArcFlag = angle > Math.PI ? 1 : 0;

        let path = "";
        if (innerRadius > 0) {
          // Donut chart
          const innerX1 = centerX + Math.cos(startAngle) * innerRadius;
          const innerY1 = centerY + Math.sin(startAngle) * innerRadius;
          const innerX2 = centerX + Math.cos(endAngle) * innerRadius;
          const innerY2 = centerY + Math.sin(endAngle) * innerRadius;

          path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${innerX2} ${innerY2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} Z`;
        } else {
          // Pie chart
          path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        }

        // Calculate label position
        const labelAngle = startAngle + angle / 2;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        currentAngle = endAngle;

        return {
          ...item,
          path,
          percentage,
          startAngle,
          endAngle,
          labelX,
          labelY,
          color:
            item?.color || actualColors[index % (actualColors?.length || 0)],
        };
      });

      return { segments, total };
    }, [
      data,
      centerX,
      centerY,
      radius,
      innerRadius,
      labelRadius,
      actualColors,
    ]);

    // Handle segment hover
    const handleSegmentHover = (
      segment: (typeof processedData.segments)[0],
      event: React.MouseEvent
    ) => {
      if (actualShowTooltips) {
        const rect = event.currentTarget.getBoundingClientRect();
        setHoveredSegment({
          index: processedData.segments.indexOf(segment),
          x: rect.left + rect.width / 2,
          y: rect.top,
          label: segment.label,
          value: segment.value,
          percentage: segment.percentage,
        });
      }
    };

    const handleSegmentLeave = () => {
      setHoveredSegment(null);
    };

    // Calculate legend layout
    const legendItems = processedData.segments.map((segment, index) => ({
      ...segment,
      index,
    }));

    // Loading skeleton
    if (actualLoading) {
      return (
        <GlassCard data-glass-component className={cn("glass-p-6", className)}>
          <div className='glass-animate-pulse glass-gap-4'>
            <div className='glass-h-6 glass-surface-subtle/20 glass-radius-md glass-w-48'></div>
            <div className="glass-flex glass-items-center glass-justify-center">
              <div className='glass-w-64 glass-h-64 glass-surface-subtle/10 glass-radius-full'></div>
            </div>
            {showLegend && (
              <div className="glass-flex glass-justify-center glass-gap-4">
                <div className='glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20'></div>
                <div className='glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20'></div>
                <div className='glass-h-4 glass-surface-subtle/20 glass-radius-md glass-w-20'></div>
              </div>
            )}
          </div>
        </GlassCard>
      );
    }

    return (
      <Motion ref={ref} preset="fadeIn" className="glass-w-full">
        <GlassCard className={cn("overflow-hidden", className)} {...props}>
          {title && (
            <CardHeader>
              <CardTitle className='glass-text-primary glass-text-lg glass-font-semibold'>
                {title}
              </CardTitle>
            </CardHeader>
          )}

          <CardContent className="glass-p-4">
            <div
              className={cn(
                "flex",
                legendPosition === "right" ? "flex-row" : "flex-col",
                "items-center glass-gap-6"
              )}
            >
              {/* Chart */}
              <div className='glass-relative glass-flex-shrink-0'>
                <svg width={size} height={size} className='glass-overflow-visible'>
                  {/* Segments */}
                  {processedData.segments.map((segment, index) => (
                    <Motion
                      key={`${segment.label}-${index}`}
                      preset="scaleIn"
                      delay={index * 100}
                      className='glass-relative'
                    >
                      <path
                        d={segment.path}
                        fill={segment.color}
                        stroke="rgba(var(--glass-color-white) / var(--glass-opacity-20))"
                        strokeWidth="1"
                        className='glass-cursor-pointer glass-transition-all glass-duration-200 hover:glass-opacity-80'
                        onMouseEnter={(e) => handleSegmentHover(segment, e)}
                        onMouseLeave={handleSegmentLeave}
                        style={{
                          animation: `pieSegment ${actualAnimationDuration}ms ease-out ${index * 100}ms both`,
                          opacity:
                            hoveredLegendIndex !== null &&
                            hoveredLegendIndex !== index
                              ? 0.35
                              : 1,
                        }}
                      />

                      {/* Segment labels */}
                      {showLabels && (
                        <text
                          x={segment.labelX}
                          y={segment.labelY}
                          textAnchor={
                            segment.labelX > centerX ? "start" : "end"
                          }
                          className='glass-text-xs glass-fill-white-opacity-80 glass-font-medium'
                          style={{ fontSize: "var(--typography-caption-size)" }}
                        >
                          {segment.label}
                          {showPercentages && (
                            <tspan
                              x={segment.labelX}
                              dy="14"
                              className='glass-text-xs glass-fill-white/60'
                            >
                              {actualFormatPercentage(segment.percentage)}
                            </tspan>
                          )}
                        </text>
                      )}
                    </Motion>
                  ))}

                  {/* Center text for donut chart */}
                  {innerRadius > 0 && (
                    <g>
                      <circle
                        cx={centerX}
                        cy={centerY}
                        r={innerRadius}
                        fill="var(--glass-bg-default)"
                        stroke="rgba(var(--glass-color-white) / var(--glass-opacity-20))"
                        strokeWidth="1"
                      />
                      <text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        className='glass-text-sm glass-fill-white-opacity-80 glass-font-medium'
                      >
                        Total
                      </text>
                      <text
                        x={centerX}
                        y={centerY + 15}
                        textAnchor="middle"
                        className='glass-text-lg glass-fill-white glass-font-semibold'
                      >
                        {actualFormatValue(processedData.total)}
                      </text>
                    </g>
                  )}
                </svg>

                {/* Tooltip */}
                {hoveredSegment && (
                  <Motion preset="fadeIn" className='glass-absolute glass-z-10'>
                    <div
                      className={cn(
                        "absolute glass-radius-xl glass-p-3 shadow-xl",
                        "bg-black/70 glass-backdrop-blur-md ring-1 ring-white/10 glass-radial-reveal glass-lift"
                      )}
                      style={{
                        left: hoveredSegment.x + 10,
                        top: hoveredSegment.y - 10,
                        transform:
                          hoveredSegment.x > size / 2
                            ? "translateX(-100%)"
                            : "none",
                      }}
                    >
                      <div className='glass-text-primary glass-text-sm'>
                        <div className='glass-font-medium'>
                          {hoveredSegment.label}
                        </div>
                        <div className='glass-text-primary-glass-opacity-80'>
                          {actualFormatValue(hoveredSegment.value)} (
                          {actualFormatPercentage(hoveredSegment.percentage)})
                        </div>
                      </div>
                    </div>
                  </Motion>
                )}
              </div>

              {/* Legend */}
              {showLegend && (legendItems?.length || 0) > 0 && (
                <div
                  className={cn(
                    "flex flex-wrap glass-gap-3",
                    legendPosition === "right" ? "flex-col" : "justify-center"
                  )}
                >
                  {legendItems.map((item) => (
                    <Motion
                      key={item?.label}
                      preset="slideUp"
                      delay={item?.index * 50}
                      className={cn(
                        "flex items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md transition-all duration-200 glass-hover--translate-y-0-5",
                        hoveredLegendIndex !== null &&
                          hoveredLegendIndex !== item?.index
                          ? "opacity-50"
                          : "opacity-100"
                      )}
                      onMouseEnter={() => setHoveredLegendIndex(item?.index)}
                      onMouseLeave={() => setHoveredLegendIndex(null)}
                    >
                      <div
                        className='glass-w-3 glass-h-3 glass-radius-md'
                        style={{ backgroundColor: item?.color }}
                      />
                      <div className='glass-text-sm glass-text-primary-glass-opacity-80'>
                        <span className='glass-font-medium'>{item?.label}</span>
                        <span className='glass-ml-2 glass-text-primary-glass-opacity-60'>
                          {actualFormatValue(item?.value)} (
                          {actualFormatPercentage(item?.percentage)})
                        </span>
                      </div>
                    </Motion>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </GlassCard>
      </Motion>
    );
  }
);

GlassPieChart.displayName = "GlassPieChart";

// Donut Chart variant
export interface GlassDonutChartProps
  extends Omit<GlassPieChartProps, "innerRadius"> {
  /**
   * Inner radius as percentage of outer radius (0-1)
   */
  innerRadiusRatio?: number;
}

export const GlassDonutChart = forwardRef<HTMLDivElement, GlassDonutChartProps>(
  ({ size = 300, innerRadiusRatio = 0.6, ...props }, ref) => {
    const innerRadius = ((size - 40) / 2) * innerRadiusRatio;

    return (
      <GlassPieChart
        ref={ref}
        {...props}
        size={size}
        innerRadius={innerRadius}
      />
    );
  }
);

GlassDonutChart.displayName = "GlassDonutChart";

export default GlassPieChart;