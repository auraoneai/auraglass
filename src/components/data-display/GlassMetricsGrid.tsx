'use client';

import React, { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';
import { GlassButton } from '../button';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

export interface MetricValue {
  current: number;
  previous?: number;
  target?: number;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency' | 'bytes' | 'time' | 'custom';
  customFormatter?: (value: number) => string;
}

export interface MetricTrend {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
  period?: string;
}

export interface MetricSpark {
  data: number[];
  color?: string;
  showArea?: boolean;
}

export interface MetricConfig {
  id: string;
  title: string;
  description?: string;
  value: MetricValue;
  trend?: MetricTrend;
  spark?: MetricSpark;
  icon?: React.ReactNode;
  color?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  category?: string;
  clickable?: boolean;
  onClick?: () => void;
  customContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface MetricGridLayout {
  columns: number;
  gap: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export interface GlassMetricsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metrics configuration */
  metrics: MetricConfig[];
  /** Grid layout */
  layout?: MetricGridLayout;
  /** Whether metrics are loading */
  loading?: boolean;
  /** Whether to show animations */
  animated?: boolean;
  /** Whether to show trends */
  showTrends?: boolean;
  /** Whether to show spark lines */
  showSparks?: boolean;
  /** Whether to enable auto-refresh */
  autoRefresh?: boolean;
  /** Auto-refresh interval in milliseconds */
  refreshInterval?: number;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Metric click handler */
  onMetricClick?: (metric: MetricConfig) => void;
  /** Custom metric renderer */
  renderMetric?: (metric: MetricConfig) => React.ReactNode;
  /** Filter options */
  filters?: {
    categories?: string[];
    priorities?: MetricConfig['priority'][];
    statuses?: MetricConfig['status'][];
  };
  /** Sort options */
  sort?: {
    field: keyof MetricConfig;
    direction: 'asc' | 'desc';
  };
  /** Whether to show search */
  searchable?: boolean;
  /** Search query */
  searchQuery?: string;
  /** Search change handler */
  onSearchChange?: (query: string) => void;
  /** Whether to show export options */
  exportable?: boolean;
  /** Export handler */
  onExport?: (format: 'csv' | 'json' | 'png') => void;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassMetricsGrid = forwardRef<HTMLDivElement, GlassMetricsGridProps>(
  (
    {
      metrics,
      layout = { columns: 4, gap: 16 },
      loading = false,
      animated = true,
      showTrends = true,
      showSparks = true,
      autoRefresh = false,
      refreshInterval = 30000,
      onRefresh,
      onMetricClick,
      renderMetric,
      filters,
      sort,
      searchable = false,
      searchQuery = '',
      onSearchChange,
      exportable = false,
      onExport,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play, feedback } = useGlassSound();
    const metricsGridId = useA11yId('glass-metrics-grid');
    
    const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-refresh effect
    useEffect(() => {
      if (autoRefresh && onRefresh && refreshInterval > 0) {
        refreshIntervalRef.current = setInterval(() => {
          onRefresh();
          feedback('notification');
        }, refreshInterval);

        return () => {
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
          }
        };
      }
    }, [autoRefresh, onRefresh, refreshInterval, feedback]);

    // Filter and search metrics
    const filteredMetrics = useMemo(() => {
      let result = [...metrics];

      // Apply search
      if (internalSearchQuery.trim()) {
        const query = internalSearchQuery.toLowerCase();
        result = result.filter(metric =>
          metric.title.toLowerCase().includes(query) ||
          metric.description?.toLowerCase().includes(query) ||
          metric.category?.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          result = result.filter(metric => 
            metric.category && filters.categories!.includes(metric.category)
          );
        }
        if (filters.priorities && filters.priorities.length > 0) {
          result = result.filter(metric => 
            metric.priority && filters.priorities!.includes(metric.priority)
          );
        }
        if (filters.statuses && filters.statuses.length > 0) {
          result = result.filter(metric => 
            metric.status && filters.statuses!.includes(metric.status)
          );
        }
      }

      // Apply sorting
      if (sort) {
        result.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          const direction = sort.direction === 'asc' ? 1 : -1;

          // Handle null/undefined values
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return direction;
          if (bValue == null) return -direction;

          if (aValue < bValue) return -1 * direction;
          if (aValue > bValue) return 1 * direction;
          return 0;
        });
      }

      return result;
    }, [metrics, internalSearchQuery, filters, sort]);

    // Status colors
    const statusColors = {
      success: 'border-green-500/30 bg-green-500/5',
      warning: 'border-yellow-500/30 bg-yellow-500/5',
      error: 'border-red-500/30 bg-red-500/5',
      info: 'border-blue-500/30 bg-blue-500/5',
      neutral: 'border-border/30 bg-background/5',
    };

    // Priority indicators
    const priorityIndicators = {
      low: 'w-1 h-1',
      medium: 'w-1.5 h-1.5',
      high: 'w-2 h-2',
      critical: 'w-2.5 h-2.5 animate-pulse',
    };

    // Format metric value
    const formatValue = useCallback((value: MetricValue): string => {
      if (value.customFormatter) {
        return value.customFormatter(value.current);
      }

      const num = value.current;
      const unit = value.unit || '';

      switch (value.format) {
        case 'percentage':
          return `${num.toFixed(1)}%`;
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(num);
        case 'bytes':
          const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(num) / Math.log(1024));
          return `${(num / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
        case 'time':
          const hours = Math.floor(num / 3600);
          const minutes = Math.floor((num % 3600) / 60);
          const seconds = Math.floor(num % 60);
          if (hours > 0) return `${hours}h ${minutes}m`;
          if (minutes > 0) return `${minutes}m ${seconds}s`;
          return `${seconds}s`;
        default:
          return new Intl.NumberFormat().format(num) + (unit ? ` ${unit}` : '');
      }
    }, []);

    // Calculate trend
    const calculateTrend = useCallback((metric: MetricConfig) => {
      if (!metric.trend || !showTrends) return null;

      const { direction, percentage, period } = metric.trend;
      const isPositive = direction === 'up';
      const isNegative = direction === 'down';

      return (
        <div className={cn(
          'flex items-center glass-gap-1 glass-text-xs',
          isPositive && 'text-green-600',
          isNegative && 'text-red-600',
          direction === 'neutral' && 'glass-text-secondary'
        )}>
          <span className="text-base">
            {isPositive ? '↗' : isNegative ? '↘' : '→'}
          </span>
          <span>{percentage.toFixed(1)}%</span>
          {period && <span className="glass-text-secondary">vs {period}</span>}
        </div>
      );
    }, [showTrends]);

    // Render spark line
    const renderSparkLine = useCallback((spark: MetricSpark) => {
      if (!showSparks) return null;

      const max = Math.max(...spark.data);
      const min = Math.min(...spark.data);
      const range = max - min || 1;

      const points = spark.data
        .map((value, index) => {
          const x = (index / (spark.data.length - 1)) * 100;
          const y = ((max - value) / range) * 100;
          return `${x},${y}`;
        })
        .join(' ');

      return (
        <div className="relative w-full h-8 glass-mt-2">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {spark.showArea && (
              <polygon
                points={`0,100 ${points} 100,100`}
                fill="currentColor"
                className="opacity-10"
                style={{ color: spark.color || 'currentColor' }}
              />
            )}
            <polyline
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-all duration-300"
              style={{ color: spark.color || 'currentColor' }}
            />
          </svg>
        </div>
      );
    }, [showSparks]);

    // Default metric renderer
    const defaultRenderMetric = useCallback((metric: MetricConfig) => {
      const sizeConfig = {
        sm: {
          padding: 'glass-p-3',
          title: 'glass-text-sm',
          value: 'glass-text-lg',
          description: 'glass-text-xs',
        },
        md: {
          padding: 'glass-p-4',
          title: 'glass-text-sm',
          value: 'glass-text-xl',
          description: 'glass-text-xs',
        },
        lg: {
          padding: 'glass-p-6',
          title: 'glass-text-base',
          value: 'glass-text-2xl',
          description: 'glass-text-sm',
        },
        xl: {
          padding: 'p-8',
          title: 'glass-text-lg',
          value: 'text-3xl',
          description: 'glass-text-base',
        },
      };

      const config = sizeConfig[metric.size || 'md'];

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          className={cn(
            'glass-metric-card relative transition-all duration-300',
            'backdrop-blur-md border border-border/20 glass-radius-lg',
            config.padding,
            metric.status && statusColors[metric.status],
            metric.clickable && 'cursor-pointer hover:scale-[1.02] hover:shadow-lg',
            loading && 'animate-pulse opacity-50'
          )}
          onClick={() => {
            if (metric.clickable && metric.onClick) {
              metric.onClick();
              feedback('tap');
            } else if (onMetricClick) {
              onMetricClick(metric);
              feedback('tap');
            }
          }}
          role={metric.clickable ? 'button' : 'article'}
          aria-label={`Metric: ${metric.title}`}
          tabIndex={metric.clickable ? 0 : -1}
        >
          {/* Priority Indicator */}
          {metric.priority && (
            <div
              className={cn(
                'absolute top-2 right-2 glass-radius-full bg-current opacity-60',
                priorityIndicators[metric.priority]
              )}
              style={{ color: metric.color || 'currentColor' }}
            />
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {metric.icon && (
                  <div
                    className="flex-shrink-0"
                    style={{ color: metric.color || 'currentColor' }}
                  >
                    {metric.icon}
                  </div>
                )}
                <h3 className={cn('font-semibold text-foreground truncate', config.title)}>
                  {metric.title}
                </h3>
              </div>
              
              {metric.description && (
                <p className={cn('glass-text-secondary line-clamp-2', config.description)}>
                  {metric.description}
                </p>
              )}
            </div>
          </div>

          {/* Value */}
          <div className={cn('font-bold text-foreground glass-mb-2', config.value)}>
            {loading ? '---' : formatValue(metric.value)}
          </div>

          {/* Progress to Target */}
          {metric.value.target && (
            <div className="mb-2">
              <div className="flex justify-between text-xs glass-text-secondary mb-1">
                <span>Target: {formatValue({ ...metric.value, current: metric.value.target })}</span>
                <span>
                  {((metric.value.current / metric.value.target) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full glass-surface-overlay glass-radius-full h-2">
                <div
                  className="glass-surface-primary h-2 glass-radius-full transition-all duration-500"
                  style={{
                    width: `${Math.min((metric.value.current / metric.value.target) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Trend */}
          {metric.trend && calculateTrend(metric)}

          {/* Spark Line */}
          {metric.spark && renderSparkLine(metric.spark)}

          {/* Custom Content */}
          {metric.customContent && (
            <div className="glass-mt-2">
              {metric.customContent}
            </div>
          )}

          {/* Category Badge */}
          {metric.category && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 text-xs glass-surface-overlay glass-text-secondary glass-radius-full">
                {metric.category}
              </span>
            </div>
          )}
        </OptimizedGlass>
      );
    }, [loading, formatValue, calculateTrend, renderSparkLine, onMetricClick, feedback, statusColors, priorityIndicators]);

    // Handle search
    const handleSearch = useCallback((query: string) => {
      setInternalSearchQuery(query);
      onSearchChange?.(query);
    }, [onSearchChange]);

    // Manual refresh
    const handleRefresh = useCallback(() => {
      if (onRefresh) {
        onRefresh();
        feedback('notification');
      }
    }, [onRefresh, feedback]);

    // Grid styles
    const gridStyle = useMemo(() => {
      const { columns, gap, responsive } = layout;
      
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        ...(responsive && {
          '@media (max-width: 640px)': {
            gridTemplateColumns: `repeat(${responsive.sm || 1}, 1fr)`,
          },
          '@media (max-width: 768px)': {
            gridTemplateColumns: `repeat(${responsive.md || 2}, 1fr)`,
          },
          '@media (max-width: 1024px)': {
            gridTemplateColumns: `repeat(${responsive.lg || 3}, 1fr)`,
          },
          '@media (min-width: 1280px)': {
            gridTemplateColumns: `repeat(${responsive.xl || columns}, 1fr)`,
          },
        }),
      };
    }, [layout]);

    return (
      <OptimizedGlass
        ref={ref}
        id={metricsGridId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-metrics-grid glass-radius-lg backdrop-blur-md border border-border/20',
          className
        )}
        {...props}
      >
        <Motion
          preset={!prefersReducedMotion && respectMotionPreference && animated ? "fadeIn" : "none"}
          className="p-6"
        >
          {/* Header */}
          {(searchable || exportable || autoRefresh) && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {searchable && (
                  <OptimizedGlass
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search metrics..."
                      value={internalSearchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={cn(
                        'w-64 glass-px-4 glass-py-2 bg-transparent border-0 glass-radius-md',
                        'placeholder:glass-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50',
                        'glass-text-sm'
                      )}
                    />
                    <div className="absolute right-3 glass--glass--glass--glass--glassglass--glass-top-1/2 -translate-y-1/2 glass-text-secondary">
                      🔍
                    </div>
                  </OptimizedGlass>
                )}
              </div>

              <div className="flex items-center gap-2">
                {autoRefresh && (
                  <GlassButton
                    onClick={handleRefresh}
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className={cn(
                      'glass-px-3 glass-py-2 glass-text-sm transition-all',
                      'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50'
                    )}
                  >
                    🔄 Refresh
                  </GlassButton>
                )}

                {exportable && onExport && (
                  <GlassButton
                    onClick={() => onExport('json')}
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className={cn(
                      'glass-px-3 glass-py-2 glass-text-sm transition-all',
                      'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50'
                    )}
                  >
                    📊 Export
                  </GlassButton>
                )}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          {filteredMetrics.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-primary mb-2">No Metrics Found</h3>
                <p className="glass-text-secondary">
                  {internalSearchQuery ? 'Try adjusting your search query' : 'No metrics to display'}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="grid"
              style={gridStyle}
            >
              {filteredMetrics.map((metric, index) => (
                <Motion
                  key={metric.id}
                  preset={!prefersReducedMotion && respectMotionPreference && animated ? "slideUp" : "none"}
                  delay={index * 100}
                >
                  {renderMetric ? renderMetric(metric) : defaultRenderMetric(metric)}
                </Motion>
              ))}
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassMetricsGrid.displayName = 'GlassMetricsGrid';

export default GlassMetricsGrid;