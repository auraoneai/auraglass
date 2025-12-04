'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  BarChart3,
  Download,
  LineChart,
  Maximize2,
  Minimize2,
  MoreVertical,
  PieChart,
  RefreshCw,
  Settings,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { GlassBadge } from "../data-display";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface ChartWidgetAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface GlassChartWidgetProps {
  /**
   * Widget title
   */
  title?: string;
  /**
   * Widget subtitle/description
   */
  subtitle?: string;
  /**
   * Chart content to display
   */
  children: React.ReactNode;
  /**
   * Widget size
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: string;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Show header
   */
  showHeader?: boolean;
  /**
   * Show actions menu
   */
  showActions?: boolean;
  /**
   * Custom actions
   */
  actions?: ChartWidgetAction[];
  /**
   * Chart type indicator
   */
  chartType?: "line" | "bar" | "area" | "pie" | "donut" | "custom";
  /**
   * Show chart type indicator
   */
  showChartType?: boolean;
  /**
   * Time range indicator
   */
  timeRange?: string;
  /**
   * Last updated timestamp
   */
  lastUpdated?: Date;
  /**
   * Show refresh button
   */
  showRefresh?: boolean;
  /**
   * Show download button
   */
  showDownload?: boolean;
  /**
   * Show fullscreen toggle
   */
  showFullscreen?: boolean;
  /**
   * Fullscreen state
   */
  fullscreen?: boolean;
  /**
   * Fullscreen change handler
   */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /**
   * Refresh handler
   */
  onRefresh?: () => void;
  /**
   * Download handler
   */
  onDownload?: () => void;
  /**
   * Custom header content
   */
  headerContent?: React.ReactNode;
  /**
   * Custom footer content
   */
  footerContent?: React.ReactNode;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * GlassChartWidget component
 * A glassmorphism chart container widget with header, actions, and fullscreen support
 */
export const GlassChartWidget: React.FC<GlassChartWidgetProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  title = "Chart Widget",
  subtitle,
  children,
  size = "md",
  loading = false,
  error,
  emptyMessage,
  showHeader = true,
  showActions = true,
  actions = [],
  chartType,
  showChartType = true,
  timeRange,
  lastUpdated,
  showRefresh = true,
  showDownload = true,
  showFullscreen = true,
  fullscreen = false,
  onFullscreenChange,
  onRefresh,
  onDownload,
  headerContent,
  footerContent,
  className,
  ...props
}) => {
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Size configurations
  const sizeConfigs = {
    sm: {
      cardClass: "glass-p-4",
      titleClass: "glass-text-lg font-semibold",
      contentClass: "glass-min-h-200px",
    },
    md: {
      cardClass: "glass-p-6",
      titleClass: "glass-text-xl font-semibold",
      contentClass: "glass-min-h-300px",
    },
    lg: {
      cardClass: "p-8",
      titleClass: "glass-text-2xl font-semibold",
      contentClass: "glass-min-h-400px",
    },
    xl: {
      cardClass: "glass-p-10",
      titleClass: "text-3xl font-semibold",
      contentClass: "min-glass-h-500px",
    },
  };

  const config = sizeConfigs[size];

  // Get chart type icon
  const getChartTypeIcon = () => {
    switch (chartType) {
      case "line":
        return <LineChart className='glass-w-5 glass-h-5' />;
      case "bar":
        return <BarChart3 className='glass-w-5 glass-h-5' />;
      case "area":
        return <TrendingUp className='glass-w-5 glass-h-5' />;
      case "pie":
        return <PieChart className='glass-w-5 glass-h-5' />;
      case "donut":
        return <PieChart className='glass-w-5 glass-h-5' />;
      default:
        return <BarChart3 className='glass-w-5 glass-h-5' />;
    }
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    onFullscreenChange?.(newFullscreen);
  };

  // Handle refresh
  const handleRefresh = () => {
    onRefresh?.();
  };

  // Handle download
  const handleDownload = () => {
    onDownload?.();
  };

  // Format last updated time
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Motion data-glass-component preset="fadeIn" className="glass-w-full">
      <GlassCard
        variant="elevated"
        elevation={"level3"}
        className={cn(
          config.cardClass,
          isFullscreen && "fixed inset-4 z-50",
          className
        )}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <CardHeader className='glass-pb-4'>
            <div className="glass-flex glass-items-start glass-justify-between">
              <div className="glass-flex-1 glass-min-glass-w-0">
                <div className='glass-flex glass-items-center glass-gap-3 glass-mb-2'>
                  <CardTitle
                    className={cn(
                      config.titleClass,
                      "glass-text-primary flex items-center glass-gap-2"
                    )}
                  >
                    {showChartType && chartType && (
                      <span className='glass-text-primary-glass-opacity-60'>
                        {getChartTypeIcon()}
                      </span>
                    )}
                    {title}
                  </CardTitle>

                  {/* Time range badge */}
                  {timeRange && (
                    <GlassBadge variant="secondary" size="sm">
                      {timeRange}
                    </GlassBadge>
                  )}
                </div>

                {subtitle && (
                  <p className='glass-text-sm glass-text-primary-glass-opacity-60 glass-mb-2'>
                    {subtitle}
                  </p>
                )}

                {/* Last updated */}
                {lastUpdated && (
                  <p className='glass-text-xs glass-text-primary-glass-opacity-50'>
                    Last updated: {formatLastUpdated(lastUpdated)}
                  </p>
                )}
              </div>

              {/* Header Actions */}
              <div className="glass-flex glass-items-center glass-gap-2">
                {headerContent}

                {/* Quick Actions */}
                <div className="glass-flex glass-items-center glass-gap-1">
                  {showRefresh && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={loading}
                      className="glass-p-2"
                      aria-label="Refresh chart data"
                    >
                      <RefreshCw
                        className={cn("w-4 h-4", loading && "animate-spin")}
                      />
                    </GlassButton>
                  )}

                  {showDownload && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      className="glass-p-2"
                      aria-label="Download chart data"
                    >
                      <Download className='glass-w-4 glass-h-4' />
                    </GlassButton>
                  )}

                  {showFullscreen && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreenToggle}
                      className="glass-p-2"
                      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className='glass-w-4 glass-h-4' />
                      ) : (
                        <Maximize2 className='glass-w-4 glass-h-4' />
                      )}
                    </GlassButton>
                  )}
                </div>

                {/* Actions Menu */}
                {showActions && actions.length > 0 && (
                  <div className='glass-relative'>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => setShowActionMenu(!showActionMenu)}
                      className="glass-p-2"
                      aria-label="Chart actions menu"
                    >
                      <MoreVertical className='glass-w-4 glass-h-4' />
                    </GlassButton>

                    {showActionMenu && (
                      <Motion
                        preset="fadeIn"
                        className='glass-absolute glass-right-0 glass-top-full glass-mt-2 glass-z-10'
                      >
                        <div className="glass-surface-dark/80 glass-backdrop-blur-md glass-border glass-border-white/20 glass-radius-lg glass-shadow-xl glass-min-glass-w-48 glass-contrast-guard">
                          {actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                action.onClick();
                                setShowActionMenu(false);
                              }}
                              disabled={action.disabled}
                              className={cn(
                                "w-full text-left glass-px-4 glass-py-2 glass-text-sm glass-text-primary/80 hover:bg-white/10",
                                "first:rounded-t-lg last:rounded-b-lg",
                                "disabled:opacity-50 glass-disabled-cursor-not-allowed",
                                "flex items-center glass-gap-2"
                              )}
                            >
                              {action.icon && (
                                <span className='glass-w-4 glass-h-4'>{action.icon}</span>
                              )}
                              {action.label}
                            </button>
                          ))}

                          {/* Default actions */}
                          <div className="glass-border-t glass-border-white/10">
                            <button
                              onClick={(e) => {
                                onRefresh?.();
                                setShowActionMenu(false);
                              }}
                              className='glass-w-full glass-text-left glass-px-4 glass-py-2 glass-text-sm glass-text-primary-glass-opacity-80 hover:glass-surface-subtle/10 glass-flex glass-items-center glass-gap-2 glass-focus glass-touch-target glass-contrast-guard'
                            >
                              <RefreshCw className='glass-w-4 glass-h-4' />
                              Refresh Data
                            </button>
                            <button
                              onClick={(e) => {
                                onDownload?.();
                                setShowActionMenu(false);
                              }}
                              className='glass-w-full glass-text-left glass-px-4 glass-py-2 glass-text-sm glass-text-primary-glass-opacity-80 hover:glass-surface-subtle/10 glass-flex glass-items-center glass-gap-2 glass-radius-b-lg glass-focus glass-touch-target glass-contrast-guard'
                            >
                              <Download className='glass-w-4 glass-h-4' />
                              Export Data
                            </button>
                          </div>
                        </div>
                      </Motion>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        )}

        {/* Content */}
        <CardContent className='glass-pt-0'>
          {error ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                config.contentClass
              )}
            >
              <div className='glass-text-primary glass-mb-2'>
                <Settings className='glass-w-8 glass-h-8' />
              </div>
              <p className='glass-text-primary-glass-opacity-80 glass-text-center glass-mb-4'>{error}</p>
              <GlassButton variant="outline" onClick={handleRefresh}>
                Try Again
              </GlassButton>
            </div>
          ) : !children && emptyMessage ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                config.contentClass
              )}
            >
              <div className='glass-text-primary-glass-opacity-40 glass-mb-2'>
                <BarChart3 className='glass-w-8 glass-h-8' />
              </div>
              <p className='glass-text-primary-glass-opacity-60 glass-text-center'>{emptyMessage}</p>
            </div>
          ) : (
            <div className={config.contentClass}>
              {loading ? (
                <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
                  <div className='glass-animate-spin glass-radius-full glass-h-8 glass-w-8 glass-border-2 glass-border-white/20 glass-border-t-white/60'></div>
                </div>
              ) : (
                children
              )}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        {footerContent && (
          <div className='glass-mt-4 glass-pt-4 glass-border-t glass-border-white/10'>
            {footerContent}
          </div>
        )}
      </GlassCard>
    </Motion>
  );
};

// Chart Widget Grid Component
export interface GlassChartWidgetGridProps {
  widgets: Array<Omit<GlassChartWidgetProps, "size">>;
  columns?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GlassChartWidgetGrid: React.FC<GlassChartWidgetGridProps> = ({
  widgets,
  columns = 2,
  size = "md",
  className,
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid glass-gap-6",
        gridCols[columns as keyof typeof gridCols],
        className
      )}
    >
      {widgets.map((widget, index) => (
        <GlassChartWidget key={widget.title} {...widget} size={size} />
      ))}
    </div>
  );
};

export default GlassChartWidget;