'use client';

// Avoid importing DS aggregator within DS; keep relative
import { GlassButton } from '../button/GlassButton';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant
   */
  variant?:
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | (string & {});
  /**
   * Badge size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * Badge shape
   */
  shape?: 'glass-radius-md' | 'pill' | 'square';
  /**
   * Whether badge has a dot indicator
   */
  dot?: boolean;
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  /**
   * Whether badge is removable
   */
  removable?: boolean;
  /**
   * Remove callback
   */
  onRemove?: () => void;
  /**
   * Animation on mount
   */
  animate?: boolean;
  /**
   * Animation preset
   */
  animation?: 'scale' | 'fade' | 'bounce';
  /**
   * Respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * ARIA label for the badge
   */
  'aria-label'?: string;
}

/**
 * GlassBadge component
 * A glassmorphism badge with various styles and states
 */
export const GlassBadge = forwardRef<HTMLSpanElement, GlassBadgeProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      shape = 'glass-radius-md',
      dot = false,
      leftIcon,
      rightIcon,
      removable = false,
      onRemove,
      animate = false,
      animation = 'scale',
      respectMotionPreference = true,
      'aria-label': ariaLabel,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const badgeId = useA11yId('badge');
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldAnimate = animate && (!respectMotionPreference || !prefersReducedMotion);

    const sizeClasses = {
      xs: dot ? 'w-2 h-2' : 'glass-px-1.5 glass-py-0.5 glass-text-xs',
      sm: dot ? 'w-2.5 h-2.5' : 'glass-px-2 glass-py-1 glass-text-xs',
      md: dot ? 'w-3 h-3' : 'glass-px-2.5 glass-py-1 glass-text-sm',
      lg: dot ? 'w-3.5 h-3.5' : 'glass-px-3 glass-py-1.5 glass-text-sm',
    };

    const shapeClasses = {
      'glass-radius-md': 'glass-radius-md',
      pill: 'glass-radius-full',
      square: 'rounded-none',
    };

    const variantClasses = {
      default: 'bg-muted/50 glass-text-secondary border-0',
      primary: 'glass-surface-primary/10 glass-text-primary border-0',
      secondary: 'bg-secondary/10 glass-text-primary/90 border-0',
      success: 'glass-surface-success/10 glass-text-success border-0',
      warning: 'glass-surface-warning/10 glass-text-primary border-0',
      error: 'glass-surface-danger/10 glass-text-danger border-0',
      info: 'glass-surface-info/10 glass-text-primary border-0',
      outline: 'bg-transparent text-foreground border border-white/10',
      ghost: 'bg-transparent glass-text-primary/70 border-0',
    };

    const dotVariantClasses = {
      default: 'bg-muted-foreground',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      info: 'bg-info',
      outline: 'bg-foreground',
      ghost: 'bg-muted-foreground',
    };

    const iconSize = {
      xs: 'w-3 h-3',
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-4 h-4',
    };

    const getAnimationPreset = () => {
      switch (animation) {
        case 'scale':
          return 'scaleIn';
        case 'fade':
          return 'fadeIn';
        case 'bounce':
          return 'bounceIn';
        default:
          return 'scaleIn';
      }
    };

    if (dot) {
      const content = (
        <span
          ref={ref}
          id={badgeId}
          className={cn(
            'inline-block glass-radius-full flex-shrink-0',
            sizeClasses[size],
            (dotVariantClasses as any)[variant] ?? dotVariantClasses.default,
            className
          )}
          role="status"
          aria-label={ariaLabel || `${variant} status indicator`}
          {...props}
        />
      );

      return shouldAnimate ? (
        <Motion preset={getAnimationPreset()}>
          {content}
        </Motion>
      ) : content;
    }

    const content = (
      <OptimizedGlass
        elevation={variant === 'ghost' ? undefined : 'level1'}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        ref={ref as any}
        id={badgeId}
        className={cn(
          'inline-flex items-center glass-gap-1 font-medium',
          'transition-all duration-200',
          sizeClasses[size],
          shapeClasses[shape],
          (variantClasses as any)[variant] ?? variantClasses.default,
          className
        )}
        role={removable ? 'button' : 'status'}
        aria-label={ariaLabel || (children ? `Badge: ${children}` : `${variant} badge`)}
        {...props}
      >
        {leftIcon && (
          <span className={cn('flex-shrink-0', iconSize[size])}>
            {leftIcon}
          </span>
        )}

        {children && (
          <span className="whitespace-nowrap">
            {children}
          </span>
        )}

        {rightIcon && !removable && (
          <span className={cn('flex-shrink-0', iconSize[size])}>
            {rightIcon}
          </span>
        )}

        {removable && (
          <GlassButton
            type="button"
            onClick={onRemove}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'hover:bg-current/20 glass-radius-full transition-colors',
              'focus:outline-none focus:ring-1 focus:ring-current',
              iconSize[size]
            )}
            aria-label="Remove badge"
          >
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </GlassButton>
        )}
      </OptimizedGlass>
    );

    return shouldAnimate ? (
      <Motion preset={getAnimationPreset()}>
        {content}
      </Motion>
    ) : content;
  }
);

GlassBadge.displayName = 'GlassBadge';

/**
 * StatusBadge component
 */
export interface StatusBadgeProps extends Omit<GlassBadgeProps, 'variant' | 'dot'> {
  /**
   * Status type
   */
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'active' | 'inactive';
  /**
   * Whether to show as dot only
   */
  dotOnly?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, dotOnly = false, ...props }, ref) => {
    const statusConfig = {
      online: { variant: 'success' as const, label: 'Online' },
      offline: { variant: 'default' as const, label: 'Offline' },
      away: { variant: 'warning' as const, label: 'Away' },
      busy: { variant: 'error' as const, label: 'Busy' },
      pending: { variant: 'warning' as const, label: 'Pending' },
      active: { variant: 'success' as const, label: 'Active' },
      inactive: { variant: 'default' as const, label: 'Inactive' },
    };

    const config = statusConfig[status];

    return (
      <GlassBadge
        ref={ref}
        variant={config.variant}
        dot={dotOnly}
        {...props}
      >
        {!dotOnly && config.label}
      </GlassBadge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

/**
 * CountBadge component
 */
export interface CountBadgeProps extends Omit<GlassBadgeProps, 'children'> {
  /**
   * Count value
   */
  count: number;
  /**
   * Maximum count to display
   */
  max?: number;
  /**
   * Whether to show zero count
   */
  showZero?: boolean;
}

export const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ count, max = 99, showZero = false, ...props }, ref) => {
    if (count <= 0 && !showZero) {
      return null;
    }

    const displayCount = count > max ? `${max}+` : count.toString();

    return (
      <GlassBadge
        ref={ref}
        variant="default"
        size="xs"
        shape="pill"
        {...props}
      >
        {displayCount}
      </GlassBadge>
    );
  }
);

CountBadge.displayName = 'CountBadge';

/**
 * BadgeGroup component
 */
export interface BadgeGroupProps {
  /**
   * Badges to display
   */
  badges: Array<{
    id: string;
    label: string;
    variant?: GlassBadgeProps['variant'];
    removable?: boolean;
    onRemove?: () => void;
  }>;
  /**
   * Maximum badges to show
   */
  max?: number;
  /**
   * Spacing between badges
   */
  spacing?: 'tight' | 'normal' | 'relaxed';
  /**
   * Whether badges wrap to new lines
   */
  wrap?: boolean;
  className?: string;
}

export function BadgeGroup({
  badges,
  max,
  spacing = 'normal',
  wrap = true,
  className,
}: BadgeGroupProps) {
  const spacingClasses = {
    tight: 'glass-gap-1',
    normal: 'glass-gap-2',
    relaxed: 'glass-gap-3',
  };

  const visibleBadges = max ? badges.slice(0, max) : badges;
  const hiddenCount = max && badges.length > max ? badges.length - max : 0;

  return (
    <div
      className={cn(
        'flex items-center',
        spacingClasses[spacing],
        wrap ? 'flex-wrap' : 'overflow-hidden',
        className
      )}
    >
      {visibleBadges.map((badge) => (
        <GlassBadge
          key={badge.id}
          variant={badge.variant}
          removable={badge.removable}
          onRemove={badge.onRemove}
          animate
        >
          {badge.label}
        </GlassBadge>
      ))}

      {hiddenCount > 0 && (
        <GlassBadge variant="outline" size="sm">
          +{hiddenCount} more
        </GlassBadge>
      )}
    </div>
  );
}
