"use client";
import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { GlassButton } from "../button";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface MetricValue {
  current: number;
  previous?: number;
  target?: number;
  unit?: string;
  format?: "number" | "percentage" | "currency" | "bytes" | "time" | "custom";
  customFormatter?: (value: number) => string;
}

export interface MetricTrend {
  direction: "up" | "down" | "neutral";
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
  priority?: "low" | "medium" | "high" | "critical";
  status?: "success" | "warning" | "error" | "info" | "neutral";
  category?: string;
  clickable?: boolean;
  onClick?: () => void;
  customContent?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
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
  metrics?: MetricConfig[];
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
    priorities?: MetricConfig["priority"][];
    statuses?: MetricConfig["status"][];
  };
  /** Sort options */
  sort?: {
    field: keyof MetricConfig;
    direction: "asc" | "desc";
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
  onExport?: (format: "csv" | "json" | "png") => void;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

const metricsSurfaceStyle: React.CSSProperties = {
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
  border: "1px solid rgba(148, 163, 184, 0.2)",
  boxShadow:
    "0 12px 30px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
};

const metricsCardSurfaceStyle: React.CSSProperties = {
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
  border: "1px solid rgba(148, 163, 184, 0.2)",
  boxShadow:
    "0 10px 24px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};

export const GlassMetricsGrid = forwardRef<
  HTMLDivElement,
  GlassMetricsGridProps
>(
  (
    {
      // ContrastGuard text coverage is tracked in the manual accessibility QA report.

      metrics = [],
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
      searchQuery = "",
      onSearchChange,
      exportable = false,
      onExport,
      respectMotionPreference = true,
      className,
      style,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play, feedback } = useGlassSound();
    const metricsGridId = useA11yId("glass-metrics-grid");

    const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-refresh effect
    useEffect(() => {
      if (autoRefresh && onRefresh && refreshInterval > 0) {
        refreshIntervalRef.current = setInterval(() => {
          onRefresh();
          feedback("notification");
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
        result = result.filter(
          (metric: any) =>
            metric.title.toLowerCase().includes(query) ||
            metric.description?.toLowerCase().includes(query) ||
            metric.category?.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          result = result.filter(
            (metric: any) =>
              metric.category && filters.categories!.includes(metric.category)
          );
        }
        if (filters.priorities && filters.priorities.length > 0) {
          result = result.filter(
            (metric: any) =>
              metric.priority && filters.priorities!.includes(metric.priority)
          );
        }
        if (filters.statuses && filters.statuses.length > 0) {
          result = result.filter(
            (metric: any) =>
              metric.status && filters.statuses!.includes(metric.status)
          );
        }
      }

      // Apply sorting
      if (sort) {
        result.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          const direction = sort.direction === "asc" ? 1 : -1;

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
      success: "glass-border-green-500/30 bg-green-500/5",
      warning: "glass-border-yellow-500/30 bg-yellow-500/5",
      error: "glass-border-red-500/30 bg-red-500/5",
      info: "glass-border-blue-500/30 bg-blue-500/5",
      neutral: "glass-border-glass-border/30 bg-background/5",
    };

    // Priority indicators
    const priorityIndicators = {
      low: "glass-w-1 glass-h-1",
      medium: "glass-w-2 glass-h-2",
      high: "glass-w-2 glass-h-2",
      critical: "glass-w-3 glass-h-3 animate-pulse",
    };

    // Format metric value
    const formatValue = useCallback((value: MetricValue): string => {
      if (value.customFormatter) {
        return value.customFormatter(value.current);
      }

      const num = value.current;
      const unit = value.unit || "";

      switch (value.format) {
        case "percentage":
          return `${num.toFixed(1)}%`;
        case "currency":
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(num);
        case "bytes":
          const sizes = ["B", "KB", "MB", "GB", "TB"];
          const i = Math.floor(Math.log(num) / Math.log(1024));
          return `${(num / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
        case "time":
          const hours = Math.floor(num / 3600);
          const minutes = Math.floor((num % 3600) / 60);
          const seconds = Math.floor(num % 60);
          if (hours > 0) return `${hours}h ${minutes}m`;
          if (minutes > 0) return `${minutes}m ${seconds}s`;
          return `${seconds}s`;
        default:
          return new Intl.NumberFormat().format(num) + (unit ? ` ${unit}` : "");
      }
    }, []);

    // Calculate trend
    const calculateTrend = useCallback(
      (metric: MetricConfig) => {
        if (!metric.trend || !showTrends) return null;

        const { direction, percentage, period } = metric.trend;
        const isPositive = direction === "up";
        const isNegative = direction === "down";

        return (
          <div
            className={cn(
              "glass-flex glass-items-center glass-gap-1 glass-text-xs",
              isPositive && "text-green-600",
              isNegative && "text-red-600",
              direction === "neutral" && "glass-text-secondary"
            )}
          >
            <span className="glass-text-base">
              {isPositive ? "↗" : isNegative ? "↘" : "→"}
            </span>
            <span>{percentage.toFixed(1)}%</span>
            {period && (
              <span className="glass-text-secondary">vs {period}</span>
            )}
          </div>
        );
      },
      [showTrends]
    );

    // Render spark line
    const renderSparkLine = useCallback(
      (spark: MetricSpark) => {
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
          .join(" ");

        return (
          <div className="glass-relative glass-w-full glass-h-8 glass-mt-2">
            <svg
              className="glass-absolute glass-inset-0 glass-w-full glass-h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {spark.showArea && (
                <polygon
                  points={`0,100 ${points} 100,100`}
                  fill="currentColor"
                  className="glass-opacity-10"
                  style={{ color: spark.color || "currentColor" }}
                />
              )}
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="glass-transition-all glass-duration-300"
                style={{ color: spark.color || "currentColor" }}
              />
            </svg>
          </div>
        );
      },
      [showSparks]
    );

    // Default metric renderer
    const defaultRenderMetric = useCallback(
      (metric: MetricConfig) => {
        const sizeConfig = {
          sm: {
            padding: "glass-p-3",
            title: "glass-text-sm",
            value: "glass-text-lg",
            description: "glass-text-xs",
          },
          md: {
            padding: "glass-p-4",
            title: "glass-text-sm",
            value: "glass-text-xl",
            description: "glass-text-xs",
          },
          lg: {
            padding: "glass-p-6",
            title: "glass-text-base",
            value: "glass-text-2xl",
            description: "glass-text-sm",
          },
          xl: {
            padding: "p-8",
            title: "glass-text-lg",
            value: "text-3xl",
            description: "glass-text-base",
          },
        };

        const config = sizeConfig[metric.size || "md"];

        return (
          <OptimizedGlass
            elevation="level2"
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            className={cn(
              "glass-metric-card glass-relative glass-transition glass-min-w-0",
              "glass-backdrop-blur-md glass-border glass-border-white/10 glass-radius-lg glass-surface-dark/40",
              config.padding,
              metric.status && statusColors[metric.status],
              metric.clickable &&
                "glass-cursor-pointer hover:scale-[1.02] hover:shadow-lg",
              loading && "animate-pulse opacity-50"
            )}
            style={metricsCardSurfaceStyle}
            onClick={() => {
              if (metric.clickable && metric.onClick) {
                metric.onClick();
                feedback("tap");
              } else if (onMetricClick) {
                onMetricClick(metric);
                feedback("tap");
              }
            }}
            role={metric.clickable ? "button" : "article"}
            aria-label={`Metric: ${metric.title}`}
            tabIndex={metric.clickable ? 0 : -1}
          >
            {/* Priority Indicator */}
            {metric.priority && (
              <div
                className={cn(
                  "glass-absolute top-2 right-2 glass-radius-full bg-current opacity-60",
                  priorityIndicators[metric.priority]
                )}
                style={{ color: metric.color || "currentColor" }}
              />
            )}

            {/* Header */}
            <div className="glass-flex glass-items-start glass-justify-between glass-mb-2">
              <div className="glass-flex-1 glass-min-w-0">
                <div className="glass-flex glass-items-center glass-gap-2 glass-mb-1">
                  {metric.icon && (
                    <div
                      className="glass-flex-shrink-0"
                      style={{ color: metric.color || "currentColor" }}
                    >
                      {metric.icon}
                    </div>
                  )}
                  <h3
                    className={cn(
                      "glass-font-semibold glass-text-primary glass-truncate",
                      config.title
                    )}
                  >
                    {metric.title}
                  </h3>
                </div>

                {metric.description && (
                  <p
                    className={cn(
                      "glass-text-secondary line-clamp-2",
                      config.description
                    )}
                  >
                    {metric.description}
                  </p>
                )}
              </div>
            </div>

            {/* Value */}
            <div
              className={cn(
                "glass-font-bold glass-text-primary glass-mb-2 glass-break-words",
                config.value
              )}
            >
              {loading ? "---" : formatValue(metric.value)}
            </div>

            {/* Progress to Target */}
            {metric.value.target && (
              <div className="glass-mb-2">
                <div className="glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mb-1">
                  <span>
                    Target:{" "}
                    {formatValue({
                      ...metric.value,
                      current: metric.value.target,
                    })}
                  </span>
                  <span>
                    {(
                      (metric.value.current / metric.value.target) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="glass-w-full glass-surface-overlay glass-radius-full glass-h-2">
                  <div
                    className="glass-surface-primary glass-h-2 glass-radius-full glass-transition-all glass-duration-500"
                    style={{
                      width: `${Math.min((metric.value.current / metric.value.target) * 100, 100)}%`,
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
              <div className="glass-mt-2">{metric.customContent}</div>
            )}

            {/* Category Badge */}
            {metric.category && (
              <div className="glass-absolute glass-bottom-2 glass-right-2">
                <span className="glass-px-2 glass-py-1 glass-text-xs glass-surface-overlay glass-text-secondary glass-radius-full">
                  {metric.category}
                </span>
              </div>
            )}
          </OptimizedGlass>
        );
      },
      [
        loading,
        formatValue,
        calculateTrend,
        renderSparkLine,
        onMetricClick,
        feedback,
        statusColors,
        priorityIndicators,
      ]
    );

    // Handle search
    const handleSearch = useCallback(
      (query: string) => {
        setInternalSearchQuery(query);
        onSearchChange?.(query);
      },
      [onSearchChange]
    );

    // Manual refresh
    const handleRefresh = useCallback(() => {
      if (onRefresh) {
        onRefresh();
        feedback("notification");
      }
    }, [onRefresh, feedback]);

    // Grid styles
    const gridStyle = useMemo(() => {
      const { columns, gap } = layout;
      const minColumnWidth = columns >= 4 ? 132 : 148;

      return {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}px, 100%), 1fr))`,
        gap: `${gap}px`,
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
          "glass-metrics-grid glass-radius-lg glass-backdrop-blur-md glass-border glass-border-white/10 glass-w-full glass-min-w-0 glass-overflow-hidden glass-surface-dark/40",
          className
        )}
        role="region"
        aria-label={ariaLabel || "Metrics Grid"}
        data-testid={dataTestId}
        style={{
          ...metricsSurfaceStyle,
          ...style,
        }}
        {...props}
      >
        <Motion
          preset={
            !prefersReducedMotion && respectMotionPreference && animated
              ? "fadeIn"
              : "none"
          }
          className="glass-p-4 glass-min-w-0"
        >
          {/* Header */}
          {(searchable || exportable || autoRefresh) && (
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-6">
              <div className="glass-flex glass-items-center glass-gap-4">
                {searchable && (
                  <OptimizedGlass
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className="glass-relative"
                  >
                    <input
                      type="text"
                      placeholder="Search metrics..."
                      value={internalSearchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={cn(
                        "glass-w-64 glass-px-4 glass-py-2 bg-transparent glass-border-0 glass-radius-md",
                        "placeholder:glass-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50",
                        "glass-text-sm"
                      )}
                    />
                    <div className="glass-absolute glass-right-3 glass-top-1/2 glass--translate-y-1-2 glass-text-secondary">
                      🔍
                    </div>
                  </OptimizedGlass>
                )}
              </div>

              <div className="glass-flex glass-items-center glass-gap-2">
                {autoRefresh && (
                  <GlassButton
                    onClick={handleRefresh}
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className={cn(
                      "glass-px-3 glass-py-2 glass-text-sm transition-all",
                      "glass-hover-scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    )}
                  >
                    🔄 Refresh
                  </GlassButton>
                )}

                {exportable && onExport && (
                  <GlassButton
                    onClick={() => onExport("json")}
                    elevation="level2"
                    intensity="medium"
                    depth={1}
                    tint="neutral"
                    border="subtle"
                    className={cn(
                      "glass-px-3 glass-py-2 glass-text-sm transition-all",
                      "glass-hover-scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
            <div className="glass-flex glass-items-center glass-justify-center glass-h-64 glass-text-center">
              <div>
                <div className="glass-text-4xl glass-mb-4">📊</div>
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">
                  No Metrics Found
                </h3>
                <p className="glass-text-secondary">
                  {internalSearchQuery
                    ? "Try adjusting your search query"
                    : "No metrics to display"}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-grid" style={{ ...gridStyle }}>
              {filteredMetrics.map((metric, index) => (
                <Motion
                  key={metric.id}
                  preset={
                    !prefersReducedMotion && respectMotionPreference && animated
                      ? "slideUp"
                      : "none"
                  }
                  delay={index * 100}
                >
                  {renderMetric
                    ? renderMetric(metric)
                    : defaultRenderMetric(metric)}
                </Motion>
              ))}
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassMetricsGrid.displayName = "GlassMetricsGrid";

export default GlassMetricsGrid;
