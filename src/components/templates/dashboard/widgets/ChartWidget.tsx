'use client';

import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';
import { Glass, Motion } from '../../../../primitives';
import { GlassBadge } from '../../../data-display/GlassBadge';
import { HStack, VStack } from '../../../layout/GlassStack';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  title: string;
  subtitle?: string;
  dataPoints: ChartDataPoint[];
  summary?: {
    total?: number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
  };
}

export interface ChartWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Chart data
   */
  data: ChartData;
  /**
   * Chart type
   */
  type?: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'sparkline';
  /**
   * Widget variant
   */
  variant?: 'default' | 'minimal' | 'featured';
  /**
   * Chart size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color scheme
   */
  colorScheme?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'rainbow';
  /**
   * Whether to show legend
   */
  showLegend?: boolean;
  /**
   * Whether to show grid
   */
  showGrid?: boolean;
  /**
   * Whether to show values on hover
   */
  interactive?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Chart actions
   */
  actions?: React.ReactNode;
  /**
   * Custom chart renderer
   */
  renderChart?: (data: ChartData, config: any) => React.ReactNode;
}

/**
 * ChartWidget component
 * Displays various chart types with glassmorphism styling
 */
export const ChartWidget = forwardRef<HTMLDivElement, ChartWidgetProps>(
  (
    {
      data,
      type = 'bar',
      variant = 'default',
      size = 'md',
      colorScheme = 'default',
      showLegend = true,
      showGrid = true,
      interactive = true,
      loading = false,
      actions,
      renderChart,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: {
        height: 'h-32',
        padding: 'glass-p-3',
        title: 'glass-text-sm',
        subtitle: 'glass-text-xs',
      },
      md: {
        height: 'h-48',
        padding: 'glass-p-4',
        title: 'glass-text-base',
        subtitle: 'glass-text-sm',
      },
      lg: {
        height: 'h-64',
        padding: 'glass-p-6',
        title: 'glass-text-lg',
        subtitle: 'glass-text-base',
      },
    };

    const colorSchemes = {
      default: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
      primary: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#EBF8FF'],
      success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
      warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
      destructive: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
      rainbow: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'],
    };

    const config = sizeClasses?.[size] || sizeClasses.md;
    const colors = colorSchemes?.[colorScheme] || colorSchemes.default;

    // Simple bar chart renderer
    const renderBarChart = () => {
      if (!data?.dataPoints || data.dataPoints.length === 0) {
        return <div className="flex items-center justify-center h-full glass-text-secondary">No data available</div>;
      }

      const maxValue = Math.max(...data.dataPoints.map((d: any) => d.value));
      
      return (
        <div className="flex items-end justify-between gap-2 h-full">
          {data?.dataPoints.map((point, index) => {
            const height = (point.value / maxValue) * 100;
            const color = point.color || colors[index % (colors?.length || 0)];
            
            return (
              <Motion
                key={point.label}
                preset="slideUp"
                delay={index * 100}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full glass-radius-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: '4px',
                  }}
                  title={`${point.label}: ${point.value}`}
                />
                <div className="text-xs glass-text-secondary text-center truncate w-full">
                  {point.label}
                </div>
              </Motion>
            );
          })}
        </div>
      );
    };

    // Simple line chart renderer
    const renderLineChart = () => {
      if (!data?.dataPoints || data.dataPoints.length === 0) {
        return <div className="flex items-center justify-center h-full glass-text-secondary">No data available</div>;
      }

      const maxValue = Math.max(...data.dataPoints.map((d: any) => d.value));
      const points = data?.dataPoints.map((point, index) => {
        const x = (index / ((data.dataPoints?.length || 0) - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
      }).join(' ');

      return (
        <div className="relative h-full w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {showGrid && (
              <g>
                {Array.from({ length: 5 }, (_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 25}
                    x2="100"
                    y2={i * 25}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={colors?.[0] || '#3B82F6'}
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {data?.dataPoints.map((point, index) => {
              const x = (index / ((data.dataPoints?.length || 0) - 1)) * 100;
              const y = 100 - (point.value / maxValue) * 100;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={colors?.[0] || '#3B82F6'}
                  className="hover:r-3 transition-all cursor-pointer"
                />
              );
            })}
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {data?.dataPoints.map((point, index) => (
              <div key={index} className="text-xs text-primary/80">
                {point.label}
              </div>
            ))}
          </div>
        </div>
      );
    };

    // Simple pie chart renderer
    const renderPieChart = () => {
      if (!data?.dataPoints || data.dataPoints.length === 0) {
        return <div className="flex items-center justify-center h-full glass-text-secondary">No data available</div>;
      }

      const total = data.dataPoints.reduce((sum, d) => sum + d.value, 0);
      let cumulative = 0;
      
      return (
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {data?.dataPoints.map((point, index) => {
                const percentage = point.value / total;
                const angle = percentage * 360;
                const startAngle = cumulative;
                cumulative += angle;
                
                const color = point.color || colors[index % (colors?.length || 0)];
                
                // Calculate path for pie slice
                const centerX = 60;
                const centerY = 60;
                const radius = 50;
                
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
                
                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      );
    };

    // Sparkline renderer
    const renderSparkline = () => {
      if (!data?.dataPoints || data.dataPoints.length === 0) {
        return <div className="flex items-center justify-center h-full glass-text-secondary text-xs">No data</div>;
      }

      const maxValue = Math.max(...data.dataPoints.map((d: any) => d.value));
      const points = data?.dataPoints.map((point, index) => {
        const x = (index / ((data.dataPoints?.length || 0) - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
      }).join(' ');

      return (
        <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={colors?.[0] || '#3B82F6'}
            strokeWidth="3"
            className="drop-shadow-sm"
          />
        </svg>
      );
    };

    const renderChartContent = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent glass-radius-full animate-spin" />
          </div>
        );
      }

      if (!data) {
        return <div className="flex items-center justify-center h-full glass-text-secondary">No chart data provided</div>;
      }

      if (renderChart) {
        return renderChart ? renderChart(data, { type, colorScheme, colors, showGrid, interactive }) : <div>Chart not available</div>;
      }

      switch (type) {
        case 'line':
        case 'area':
          return renderLineChart ? renderLineChart() : <div>Line chart not available</div>;
        case 'pie':
        case 'donut':
          return renderPieChart ? renderPieChart() : <div>Pie chart not available</div>;
        case 'sparkline':
          return renderSparkline();
        default:
          return renderBarChart ? renderBarChart() : <div>Bar chart not available</div>;
      }
    };

    const renderLegend = () => {
      if (!showLegend || type === 'sparkline' || !data?.dataPoints || data.dataPoints.length === 0) return null;

      return (
        <div className="flex flex-wrap gap-2">
          {data.dataPoints.map((point, index) => {
            const color = point.color || colors[index % (colors?.length || 0)];
            return (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 glass-radius-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs glass-text-secondary">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <Glass
        ref={ref}
        className={cn('w-full h-full glass-radius-lg', config.padding, className)}
        {...props}
      >
        <VStack space="md" className="h-full">
          {/* Header */}
          <HStack space="sm" align="center" justify="between">
            <VStack space="xs">
              <h3 className={cn('font-medium text-foreground', config.title)}>
                {data?.title || 'Chart'}
              </h3>
              {data?.subtitle && (
                <p className={cn('glass-text-secondary', config.subtitle)}>
                  {data?.subtitle}
                </p>
              )}
            </VStack>
            
            {actions && (
              <div className="flex-shrink-0">
                {actions}
              </div>
            )}
          </HStack>

          {/* Summary */}
          {data?.summary && variant !== 'minimal' && (
            <HStack space="sm" align="center">
              {data?.summary.total && (
                <div className="text-lg font-bold text-primary">
                  {data?.summary.total.toLocaleString()}
                </div>
              )}
              {data?.summary.change && (
                <GlassBadge
                  variant={data?.summary.trend === 'up' ? 'success' : data?.summary.trend === 'down' ? 'error' : 'outline'}
                  size="xs"
                >
                  {data?.summary.change > 0 ? '+' : ''}{data?.summary.change}%
                </GlassBadge>
              )}
            </HStack>
          )}

          {/* Chart */}
          <div className={cn('flex-1', config.height, type === 'sparkline' && 'h-auto')}>
            {renderChartContent()}
          </div>

          {/* Legend */}
          {renderLegend()}
        </VStack>
      </Glass>
    );
  }
);

ChartWidget.displayName = 'ChartWidget';
