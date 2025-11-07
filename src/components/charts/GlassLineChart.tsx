'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { useMemo, useState } from 'react';
import { Motion } from '../../primitives';
import { CardContent, CardHeader, CardTitle, GlassCard } from '../card';

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
    colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
    ],
    animationDuration = 1000,
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
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Process data for chart
    const processedData = useMemo(() => {
        if (!series || !Array.isArray(series) || series.length === 0) {
            return { scaledSeries: [], xLabels: [], yLabels: [] };
        }

        // Find min/max values across all series
        const allPoints = series.flatMap(s => s.data);
        const xValues = allPoints.map((p: any) => typeof p.x === 'number' ? p.x : 0);
        const yValues = allPoints.map((p: any) => p.y);

        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);

        // Add some padding to Y axis
        const yRange = yMax - yMin;
        const yPadding = yRange * 0.1;
        const yMinPadded = Math.max(0, yMin - yPadding);
        const yMaxPadded = yMax + yPadding;

        // Scale functions
        const scaleX = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth;
        const scaleY = (y: number) => chartHeight - ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * chartHeight;

        // Process each series
        const scaledSeries = series.map((s, seriesIndex) => ({
            ...s,
            color: s.color || colors[seriesIndex % (colors?.length || 0)],
            points: s.data?.map((point, pointIndex) => ({
                ...point,
                scaledX: padding.left + scaleX(typeof point.x === 'number' ? point.x : pointIndex),
                scaledY: padding.top + scaleY(point.y),
                originalIndex: pointIndex
            }))
        }));

        // Generate axis labels
        const xLabels = scaledSeries[0]?.points.map((point, index) => ({
            x: point.scaledX,
            y: height - padding.bottom + 20,
            label: formatXValue(point.x)
        })) || [];

        const yLabels = [0, 0.25, 0.5, 0.75, 1].map((ratio: any) => {
            const value = yMinPadded + (yMaxPadded - yMinPadded) * ratio;
            return {
                x: padding.left - 10,
                y: padding.top + chartHeight - (chartHeight * ratio),
                label: formatYValue(value)
            };
        });

        return { scaledSeries, xLabels, yLabels };
    }, [series, width, height, padding, chartWidth, chartHeight, formatYValue, formatXValue, colors]);

    // Generate path for line
    const generatePath = (points: any[]) => {
        if ((points?.length || 0) === 0) return '';

        let path = `M ${points[0].scaledX} ${points[0].scaledY}`;
        for (let i = 1; i < (points?.length || 0); i++) {
            path += ` L ${points[i].scaledX} ${points[i].scaledY}`;
        }
        return path;
    };

    // Handle point hover
    const handlePointHover = (seriesId: string, pointIndex: number, x: number, y: number) => {
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
            <GlassCard className={cn('glass-p-6', className)}>
                <div className="animate-pulse gap-4">
                    <div className="h-6 glass-surface-subtle/20 glass-radius-md w-48"></div>
                    <div className="h-64 glass-surface-subtle/10 glass-radius-md"></div>
                    <div className="flex justify-center gap-4">
                        <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
                        <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
                        <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
                    </div>
                </div>
            </GlassCard>
        );
    }

    return (
        <Motion preset="fadeIn" className="w-full">
            <GlassCard className={cn('overflow-hidden', className)} {...props}>
                {title && (
                    <CardHeader>
                        <CardTitle className="text-primary text-lg font-semibold">
                            {title}
                        </CardTitle>
                    </CardHeader>
                )}

                <CardContent className="p-4">
                    <div className="relative">
                        <svg width={width} height={height} className="overflow-visible">
                            {/* Grid lines */}
                            {showGrid && (
                                <g className="opacity-20">
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

                            {/* Chart lines */}
                            {processedData.scaledSeries.map((s, seriesIndex) => (
                                <Motion
                                    key={s.id}
                                    preset="slideUp"
                                    delay={seriesIndex * 100}
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
                                            animation: `drawLine ${animationDuration}ms ease-out ${seriesIndex * 100}ms both`,
                                            opacity: hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                                        }}
                                    />

                                    {/* Area fill (optional) */}
                                    <defs>
                                        <linearGradient id={`gradient-${s.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Data points */}
                                    {showPoints && s.points.map((point, pointIndex) => (
                                        <circle
                                            key={`${s.id}-point-${pointIndex}`}
                                            cx={point.scaledX}
                                            cy={point.scaledY}
                                            r="4"
                                            fill={s.color}
                                            stroke="rgba(var(--glass-color-white) / var(--glass-opacity-80))"
                                            strokeWidth="2"
                                            className="cursor-pointer hover:r-6 transition-all duration-200"
                                            onMouseEnter={() => handlePointHover(s.id, pointIndex, point.scaledX, point.scaledY)}
                                            onMouseLeave={handlePointLeave}
                                            style={{
                                                animation: `fadeInPoint 300ms ease-out ${animationDuration + seriesIndex * 100 + pointIndex * 50}ms both`,
                                                opacity: hoveredSeriesId && hoveredSeriesId !== s.id ? 0.35 : 1,
                                            }}
                                        />
                                    ))}
                                </Motion>
                            ))}

                            {/* Crosshair when hovering a point */}
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
                                    {/* Highlight ring around hovered point */}
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
                                    className="text-xs fill-white/70"
                                    style={{ fontSize: '0.625rem' }}
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
                                    className="text-xs fill-white/70"
                                    style={{ fontSize: '0.625rem' }}
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
                                    className="text-sm fill-white/80 font-medium"
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
                                    className="text-sm fill-white/80 font-medium"
                                >
                                    {yAxisLabel}
                                </text>
                            )}
                        </svg>

                        {/* Tooltip */}
                        {hoveredPoint && (
                            <Motion preset="fadeIn" className="absolute z-10">
                                <div
                                    className={cn(
                                        'absolute glass-radius-xl glass-p-3 shadow-xl',
                                        'bg-black/70 backdrop-blur-md ring-1 ring-white/10 glass-radial-reveal glass-lift'
                                    )}
                                    style={{
                                        left: hoveredPoint.x + 10,
                                        top: hoveredPoint.y - 10,
                                        transform: hoveredPoint.x > width / 2 ? 'translateX(-100%)' : 'none'
                                    }}
                                >
                                    <div className="text-primary text-sm">
                                        <div className="font-medium">
                                            {processedData.scaledSeries.find(s => s.id === hoveredPoint.seriesId)?.name}
                                        </div>
                                        <div className="text-primary/80">
                                            {(() => {
                                                const series = processedData.scaledSeries.find(s => s.id === hoveredPoint.seriesId);
                                                const dataPoint = series?.data?.[hoveredPoint.index];
                                                if (dataPoint) {
                                                    return `${formatXValue(dataPoint.x)}: ${formatYValue(dataPoint.y)}`;
                                                }
                                                return '';
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </Motion>
                        )}
                    </div>

                    {/* Legend */}
                    {showLegend && (processedData.scaledSeries?.length || 0) > 0 && (
                        <div 
                            className="flex flex-wrap justify-center gap-4 mt-6"
                            role="list"
                            aria-label="Chart legend"
                        >
                            {processedData.scaledSeries.map((s) => (
                                <div
                                    key={s.id}
                                    className={cn('flex items-center glass-gap-2 glass-px-2 glass-py-1 glass-radius-md transition-all duration-200 hover:-translate-y-0.5',
                                      hoveredSeriesId && hoveredSeriesId !== s.id ? 'opacity-50' : 'opacity-100'
                                    )}
                                    role="listitem"
                                    tabIndex={0}
                                    aria-label={`${s.name} data series`}
                                    onMouseEnter={() => setHoveredSeriesId(s.id)}
                                    onMouseLeave={() => setHoveredSeriesId(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setHoveredSeriesId(hoveredSeriesId === s.id ? null : s.id);
                                        }
                                    }}
                                >
                                    <div
                                        className="w-3 h-3 glass-radius-full"
                                        style={{ backgroundColor: s.color }}
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm text-primary/80">{s.name}</span>
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
    className
}) => {
    return (
        <GlassCard className={cn('glass-p-6', className)}>
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && (
                        <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-primary/60">{subtitle}</p>
                    )}
                </div>
            )}
            {children}
        </GlassCard>
    );
};

export default GlassLineChart;
