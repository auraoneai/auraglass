'use client';

import { cn } from '../../lib/utilsComprehensive';
import { Activity, DollarSign, Minus, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React, { forwardRef } from 'react';
import { Motion } from '../../primitives';
import { CardContent, CardHeader, CardTitle, GlassCard } from '../card';

export interface GlassMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Metric title/label
     */
    title: string;
    /**
     * Main metric value
     */
    value: string | number;
    /**
     * Metric unit (e.g., '$', '%', 'users')
     */
    unit?: string;
    /**
     * Metric description/subtitle
     */
    description?: string;
    /**
     * Icon to display
     */
    icon?: React.ReactNode;
    /**
     * Metric type for automatic icon
     */
    type?: 'revenue' | 'users' | 'conversion' | 'performance' | 'growth' | 'target' | 'custom';
    /**
     * Color variant for the card
     */
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Layout variant
     */
    layout?: 'horizontal' | 'vertical' | 'compact';
    /**
     * Show progress indicator
     */
    showProgress?: boolean;
    /**
     * Progress value (0-100)
     */
    progress?: number;
    /**
     * Progress label
     */
    progressLabel?: string;
    /**
     * Trend information
     */
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
    /**
     * Comparison value
     */
    comparison?: {
        value: string | number;
        label: string;
    };
    /**
     * Additional content to display
     */
    children?: React.ReactNode;
    /**
     * Loading state
     */
    loading?: boolean;
    /**
     * Click handler
     */
    onClick?: () => void;
}

/**
 * GlassMetricCard component
 * A glassmorphism metric card for displaying various dashboard metrics
 */
export const GlassMetricCard = forwardRef<HTMLDivElement, GlassMetricCardProps>(
  (
    {
      title,
      value,
      unit = '',
      description,
      icon,
      type = 'custom',
      variant = 'default',
      size = 'md',
      layout = 'vertical',
      showProgress = false,
      progress = 0,
      progressLabel,
      trend,
      comparison,
      children,
      loading = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    // Size configurations
    const sizeConfigs = {
        sm: {
            cardClass: 'glass-p-4',
            titleClass: 'glass-text-sm font-medium',
            valueClass: 'glass-text-xl font-bold',
            iconSize: 'w-6 h-6',
            progressHeight: 'h-1',
        },
        md: {
            cardClass: 'glass-p-6',
            titleClass: 'glass-text-base font-medium',
            valueClass: 'glass-text-2xl font-bold',
            iconSize: 'w-8 h-8',
            progressHeight: 'h-2',
        },
        lg: {
            cardClass: 'p-8',
            titleClass: 'glass-text-lg font-semibold',
            valueClass: 'text-3xl font-bold',
            iconSize: 'w-10 h-10',
            progressHeight: 'h-3',
        },
        xl: {
            cardClass: 'glass-p-10',
            titleClass: 'glass-text-xl font-semibold',
            valueClass: 'text-4xl font-bold',
            iconSize: 'w-12 h-12',
            progressHeight: 'h-4',
        },
    };

    // Get automatic icon based on type
    const getTypeIcon = () => {
        switch (type) {
            case 'revenue': return <DollarSign className={sizeConfigs[size].iconSize} />;
            case 'users': return <Users className={sizeConfigs[size].iconSize} />;
            case 'conversion': return <Target className={sizeConfigs[size].iconSize} />;
            case 'performance': return <Activity className={sizeConfigs[size].iconSize} />;
            case 'growth': return <TrendingUp className={sizeConfigs[size].iconSize} />;
            case 'target': return <Target className={sizeConfigs[size].iconSize} />;
            default: return null;
        }
    };

    // Variant color configurations
    const variantConfigs = {
        default: {
            iconColor: 'glass-text-primary/70',
            valueColor: 'glass-text-primary',
            trendUpColor: 'text-green-400',
            trendDownColor: 'text-red-400',
            trendNeutralColor: 'text-yellow-400',
            progressBg: 'bg-white/20',
            progressFill: 'bg-white/60',
        },
        success: {
            iconColor: 'text-green-400',
            valueColor: 'text-green-200',
            trendUpColor: 'text-green-300',
            trendDownColor: 'text-red-400',
            trendNeutralColor: 'text-yellow-400',
            progressBg: 'bg-green-500/20',
            progressFill: 'bg-green-500',
        },
        warning: {
            iconColor: 'text-yellow-400',
            valueColor: 'text-yellow-200',
            trendUpColor: 'text-green-400',
            trendDownColor: 'text-red-400',
            trendNeutralColor: 'text-yellow-300',
            progressBg: 'bg-yellow-500/20',
            progressFill: 'bg-yellow-500',
        },
        error: {
            iconColor: 'text-red-400',
            valueColor: 'text-red-200',
            trendUpColor: 'text-red-400',
            trendDownColor: 'text-red-300',
            trendNeutralColor: 'text-yellow-400',
            progressBg: 'bg-red-500/20',
            progressFill: 'bg-red-500',
        },
        info: {
            iconColor: 'text-blue-400',
            valueColor: 'text-blue-200',
            trendUpColor: 'text-green-400',
            trendDownColor: 'text-red-400',
            trendNeutralColor: 'text-yellow-400',
            progressBg: 'bg-blue-500/20',
            progressFill: 'bg-blue-500',
        },
        primary: {
            iconColor: 'text-primary',
            valueColor: 'text-primary-foreground',
            trendUpColor: 'text-green-400',
            trendDownColor: 'text-red-400',
            trendNeutralColor: 'text-yellow-400',
            progressBg: 'bg-primary/20',
            progressFill: 'bg-primary',
        },
    };

    const config = sizeConfigs?.[size];
    const variantConfig = variantConfigs?.[variant];
    const displayIcon = icon || getTypeIcon();

    // Loading skeleton
    if (loading) {
        return (
            <GlassCard className={cn('animate-pulse', config.cardClass, className)}>
                <div className="gap-4">
                    <div className="flex items-center justify-between">
                        <div className="h-4 glass-surface-subtle/20 glass-radius-md w-24"></div>
                        <div className="w-8 h-8 glass-surface-subtle/20 glass-radius-md"></div>
                    </div>
                    <div className="gap-2">
                        <div className="h-8 glass-surface-subtle/20 glass-radius-md w-32"></div>
                        <div className="h-4 glass-surface-subtle/20 glass-radius-md w-20"></div>
                    </div>
                    {showProgress && (
                        <div className="h-2 glass-surface-subtle/10 glass-radius-md"></div>
                    )}
                </div>
            </GlassCard>
        );
    }

    return (
        <Motion preset="fadeIn" className="w-full glass-metric-card">
            <GlassCard
                ref={ref}
                elevation="level2"
                intensity="medium"
                depth={2}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                hoverable={!!onClick}
                clickable={!!onClick}
                onClick={onClick}
                className={cn(
                    config.cardClass,
                    'group relative overflow-hidden',
                    onClick && [
                        'cursor-pointer',
                        'hover:shadow-2xl hover:shadow-blue-500/20',
                        'transition-all duration-500 ease-out'
                    ],
                    className
                )}
                {...props}
            >
                <CardHeader className="pb-2">
                    <div className={cn(
                        'flex items-start justify-between',
                        layout === 'horizontal' ? 'flex-row items-center' : 'flex-col'
                    )}>
                        <div className="flex-1">
                            <CardTitle className={cn(config.titleClass, 'glass-text-primary/90 flex items-center glass-gap-2')}>
                                {displayIcon && (
                                    <div className={cn(
                                        'inline-flex items-center justify-center glass-radius-lg',
                                        'bg-gradient-to-br from-white/10 to-white/5',
                                        'border border-white/20 glass-p-2 mr-3',
                                        'group-hover:from-white/15 group-hover:to-white/8',
                                        'group-hover:border-white/30 group-hover:shadow-lg',
                                        'group-hover:scale-110 group-hover:-rotate-2',
                                        'transition-all duration-300 ease-out',
                                        variantConfig.iconColor
                                    )}>
                                        {/* Icon glow effect */}
                                        <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className={cn(config.iconSize, 'relative z-10 transition-transform duration-300 group-hover:scale-110')}>
                                            {displayIcon}
                                        </span>
                                    </div>
                                )}
                                {title}
                            </CardTitle>
                            {description && (
                                <p className="text-sm text-primary/60 glass-mt-1">{description}</p>
                            )}
                        </div>

                        {/* Trend indicator */}
                        {trend && (
                            <div className="flex items-center gap-1 glass-mt-2">
                                {trend.direction === 'up' && <TrendingUp className={cn('w-4 h-4', variantConfig.trendUpColor)} />}
                                {trend.direction === 'down' && <TrendingDown className={cn('w-4 h-4', variantConfig.trendDownColor)} />}
                                {trend.direction === 'neutral' && <Minus className={cn('w-4 h-4', variantConfig.trendNeutralColor)} />}
                                <span className={cn('glass-text-sm font-medium',
                                    trend.direction === 'up' ? variantConfig.trendUpColor :
                                        trend.direction === 'down' ? variantConfig.trendDownColor :
                                            variantConfig.trendNeutralColor
                                )}>
                                    {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                                </span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className={cn(
                        'flex items-baseline glass-gap-2 glass-mb-4 relative',
                        layout === 'horizontal' ? 'justify-start' : 'justify-center'
                    )}>
                        {/* Value with sophisticated hover effects */}
                        <div className="relative">
                            {/* Background glow on hover */}
                            <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-purple-400/30 glass-gradient-primary blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150" />

                            <span className={cn(
                                config.valueClass,
                                variantConfig.valueColor,
                                'relative z-10 font-bold tracking-tight',
                                'group-hover:scale-105 group-hover:glass-text-primary',
                                'transition-all duration-300 ease-out',
                                'drop-shadow-sm group-hover:drop-shadow-lg'
                            )}>
                                {value}
                            </span>
                        </div>

                        {unit && (
                            <span className={cn(
                                'glass-text-lg glass-text-primary/70 font-medium relative',
                                'group-hover:glass-text-primary/90 transition-colors duration-300'
                            )}>
                                {unit}
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    {showProgress && (
                        <div className="mb-4">
                            <div className={cn('w-full glass-radius-full overflow-hidden', config.progressHeight, variantConfig.progressBg)}>
                                <Motion
                                    preset="slideRight"
                                    className={cn('h-full', variantConfig.progressFill)}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                            {progressLabel && (
                                <div className="flex justify-between items-center glass-mt-2">
                                    <span className="text-xs text-primary/60">{progressLabel}</span>
                                    <span className="text-xs text-primary/60">{Math.round(progress)}%</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Comparison */}
                    {comparison && (
                        <div className="mb-4 p-3 glass-surface-subtle/5 glass-radius-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-primary/70">{comparison.label}</span>
                                <span className="text-sm font-medium text-primary">{comparison.value}</span>
                            </div>
                        </div>
                    )}

                    {children && (
                        <div className="glass-mt-4">
                            {children}
                        </div>
                    )}
                </CardContent>
            </GlassCard>
        </Motion>
    );
  }
);

GlassMetricCard.displayName = 'GlassMetricCard';

// Metric Grid Component
export interface GlassMetricGridProps {
    metrics: Array<Omit<GlassMetricCardProps, 'size'>>;
    columns?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const GlassMetricGrid: React.FC<GlassMetricGridProps> = ({
    metrics,
    columns = 3,
    size = 'md',
    className
}) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    return (
        <div className={cn('grid glass-gap-6', gridCols?.[columns as keyof typeof gridCols], className)}>
            {metrics.map((metric, index) => (
                <GlassMetricCard
                    key={metric?.title}
                    {...metric}
                    size={size}
                />
            ))}
        </div>
    );
};

export default GlassMetricCard;
