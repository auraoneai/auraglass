'use client';
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { Motion } from "../../../../primitives";
import GlassCore from "../../../../primitives/GlassCore";
import { GlassBadge } from "../../../data-display/GlassBadge";
import { HStack, VStack } from "../../../layout/GlassStack";

export interface MetricData {
  value: string | number;
  label: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  target?: number;
  unit?: string;
  description?: string;
}

export interface MetricWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Metric data
   */
  data: MetricData;
  /**
   * Widget variant
   */
  variant?: "default" | "minimal" | "featured" | "compact";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color scheme
   */
  colorScheme?: "default" | "primary" | "success" | "warning" | "destructive";
  /**
   * Whether to show trend indicator
   */
  showTrend?: boolean;
  /**
   * Whether to show target progress
   */
  showTarget?: boolean;
  /**
   * Custom trend icons
   */
  trendIcons?: {
    up: React.ReactNode;
    down: React.ReactNode;
    neutral: React.ReactNode;

    /** Glass surface intent */
    intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

    /** Glass surface elevation */
    elevation?: "level1" | "level2" | "level3" | "level4";

    /** Performance tier */
    tier?: "low" | "medium" | "high";
  };
}

/**
 * MetricWidget component
 * Display key metrics with trends and targets
 */
export const MetricWidget = forwardRef<HTMLDivElement, MetricWidgetProps>(
  (
    {
      data,
      variant = "default",
      size = "md",
      colorScheme = "default",
      showTrend = true,
      showTarget = false,
      trendIcons,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: {
        value: "glass-text-lg",
        label: "glass-text-xs",
        icon: "glass-text-lg",
        padding: "glass-p-3",
      },
      md: {
        value: "glass-text-2xl",
        label: "glass-text-sm",
        icon: "glass-text-xl",
        padding: "glass-p-4",
      },
      lg: {
        value: "text-3xl",
        label: "glass-text-base",
        icon: "glass-text-2xl",
        padding: "glass-p-6",
      },
    };

    const colorSchemes = {
      default: {
        value: "text-foreground",
        change: {
          up: "text-success",
          down: "text-destructive",
          neutral: "glass-text-secondary",
        },
        icon: "glass-text-secondary",
        background: "",
      },
      primary: {
        value: "text-primary",
        change: {
          up: "text-success",
          down: "text-destructive",
          neutral: "glass-text-secondary",
        },
        icon: "text-primary/70",
        background: "bg-primary/5",
      },
      success: {
        value: "text-success",
        change: {
          up: "text-success",
          down: "text-destructive",
          neutral: "glass-text-secondary",
        },
        icon: "text-success/70",
        background: "bg-success/5",
      },
      warning: {
        value: "text-warning",
        change: {
          up: "text-success",
          down: "text-destructive",
          neutral: "glass-text-secondary",
        },
        icon: "text-warning/70",
        background: "bg-warning/5",
      },
      destructive: {
        value: "text-destructive",
        change: {
          up: "text-success",
          down: "text-destructive",
          neutral: "glass-text-secondary",
        },
        icon: "text-destructive/70",
        background: "bg-destructive/5",
      },
    };

    const config = sizeClasses?.[size];
    const colors = colorSchemes?.[colorScheme];

    const defaultTrendIcons = {
      up: "↗️",
      down: "↘️",
      neutral: "→",
    };

    const icons = trendIcons || defaultTrendIcons;

    const formatValue = (value: string | number) => {
      if (typeof value === "number") {
        return new Intl.NumberFormat().format(value);
      }
      return value;
    };

    const getTrendIcon = () => {
      if (!data?.trend) return null;
      return icons?.[data?.trend];
    };

    const getChangeColor = () => {
      if (!data?.change) return colors.change.neutral;

      if (data?.change > 0) return colors.change.up;
      if (data?.change < 0) return colors.change.down;
      return colors.change.neutral;
    };

    const getTargetProgress = () => {
      if (!data?.target || typeof data?.value !== "number") return 0;
      return Math.min((data?.value / data?.target) * 100, 100);
    };

    const renderContent = () => {
      switch (variant) {
        case "minimal":
          return (
            <HStack data-glass-component space="sm" align="center">
              {data?.icon && (
                <div className={cn(config.icon, colors.icon)}>{data?.icon}</div>
              )}
              <VStack space="none">
                <div className={cn("font-bold", config.value, colors.value)}>
                  {formatValue(data?.value)}
                  {data?.unit}
                </div>
                <div className={cn("glass-text-secondary", config.label)}>
                  {data?.label || "Metric"}
                </div>
              </VStack>
              {showTrend && data?.change && (
                <GlassBadge
                  variant="outline"
                  size="xs"
                  className={getChangeColor()}
                >
                  {getTrendIcon()} {data?.change > 0 ? "+" : ""}
                  {data?.change}%
                </GlassBadge>
              )}
            </HStack>
          );

        case "featured":
          return (
            <VStack space="md">
              <HStack space="sm" align="center" justify="between">
                <div className={cn("glass-text-secondary", config.label)}>
                  {data?.label || "Metric"}
                </div>
                {data?.icon && (
                  <div className={cn(config.icon, colors.icon)}>
                    {data?.icon}
                  </div>
                )}
              </HStack>

              <VStack space="xs">
                <div className={cn("font-bold", config.value, colors.value)}>
                  {formatValue(data?.value)}
                  {data?.unit}
                </div>

                {showTarget && data?.target && (
                  <div className="glass-w-full">
                    <div className='glass-flex glass-justify-between glass-text-xs glass-text-secondary mb-1'>
                      <span>Progress</span>
                      <span>{Math.round(getTargetProgress())}%</span>
                    </div>
                    <div className='glass-w-full glass-surface-subtle glass-radius-full h-2'>
                      <Motion
                        className={cn(
                          "h-full glass-radius-full transition-all duration-500",
                          getTargetProgress() >= 100
                            ? "bg-success"
                            : "bg-primary"
                        )}
                        style={{ width: `${getTargetProgress()}%` }}
                      />
                    </div>
                  </div>
                )}
              </VStack>

              {showTrend && (data?.change || data?.changeLabel) && (
                <HStack space="sm" align="center">
                  {data?.change && (
                    <div
                      className={cn(
                        "glass-text-xs font-medium flex items-center glass-gap-1",
                        getChangeColor()
                      )}
                    >
                      <span>{getTrendIcon()}</span>
                      <span>
                        {data?.change > 0 ? "+" : ""}
                        {data?.change}%
                      </span>
                    </div>
                  )}
                  {data?.changeLabel && (
                    <div className="glass-text-xs glass-text-secondary">
                      {data?.changeLabel}
                    </div>
                  )}
                </HStack>
              )}

              {data?.description && (
                <div className="glass-text-xs glass-text-secondary">
                  {data?.description}
                </div>
              )}
            </VStack>
          );

        case "compact":
          return (
            <HStack space="sm" align="center" justify="between">
              <VStack space="none">
                <div className={cn("font-bold glass-text-lg", colors.value)}>
                  {formatValue(data?.value)}
                  {data?.unit}
                </div>
                <div className="glass-text-xs glass-text-secondary">
                  {data?.label || "Metric"}
                </div>
              </VStack>
              {data?.icon && (
                <div className={cn("glass-text-lg", colors.icon)}>
                  {data?.icon}
                </div>
              )}
            </HStack>
          );

        default:
          return (
            <VStack space="md">
              <HStack space="sm" align="center" justify="between">
                <div className={cn("glass-text-secondary", config.label)}>
                  {data?.label || "Metric"}
                </div>
                {data?.icon && (
                  <div className={cn(config.icon, colors.icon)}>
                    {data?.icon}
                  </div>
                )}
              </HStack>

              <div className={cn("font-bold", config.value, colors.value)}>
                {formatValue(data?.value)}
                {data?.unit}
              </div>

              {showTrend && data?.change && (
                <HStack space="sm" align="center">
                  <div
                    className={cn(
                      "glass-text-sm font-medium flex items-center glass-gap-1",
                      getChangeColor()
                    )}
                  >
                    <span>{getTrendIcon()}</span>
                    <span>
                      {data?.change > 0 ? "+" : ""}
                      {data?.change}%
                    </span>
                  </div>
                  {data?.changeLabel && (
                    <div className="glass-text-sm glass-text-secondary">
                      {data?.changeLabel}
                    </div>
                  )}
                </HStack>
              )}
            </VStack>
          );
      }
    };

    return (
      <GlassCore
        ref={ref}
        className={cn(
          "w-full h-full glass-radius-lg",
          config.padding,
          colors.background,
          className
        )}
        {...props}
      >
        {renderContent()}
      </GlassCore>
    );
  }
);

MetricWidget.displayName = "MetricWidget";