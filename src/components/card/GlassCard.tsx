'use client';

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef } from 'react';
import { OptimizedGlassCore as OptimizedGlass, type OptimizedGlassProps } from '../../primitives';
import { LiquidGlassMaterial } from '../../primitives/LiquidGlassMaterial';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassCardProps extends Omit<OptimizedGlassProps, 'variant' | 'tint'> {
  /**
   * Card variant style
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive' | 'feature' | 'minimal' | 'primary' | 'outline';
  /**
   * Tint color (for liquid glass material)
   */
  tint?: string | { r: number; g: number; b: number; a: number };
  /**
   * Card size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether the card is hoverable
   */
  hoverable?: boolean;
  /**
   * Whether the card is clickable
   */
  clickable?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Glass material variant
   */
  material?: 'glass' | 'liquid';
  /**
   * Material properties for liquid glass
   */
  materialProps?: {
    ior?: number;
    thickness?: number;
    tint?: { r: number; g: number; b: number; a: number };
    variant?: 'regular' | 'clear';
    quality?: 'ultra' | 'high' | 'balanced' | 'efficient';
  };
}

/**
 * GlassCard component
 * A versatile card component with glassmorphism styling
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      variant = 'default',
      size = 'md',
      elevation = 'level2',
      hoverable = false,
      clickable = false,
      loading = false,
      disabled = false,
      material = 'glass',
      materialProps,
      tint,
      interactive,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'glass-p-3',
      md: 'glass-p-4',
      lg: 'glass-p-6',
      xl: 'glass-p-8',
    };

    const variantClasses = {
      default: '',
      outlined: 'glass-focus glass-border-subtle',
      elevated: '',
      interactive: 'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
      feature: 'relative overflow-hidden',
      minimal: 'backdrop-blur-md bg-transparent border-0',
      primary: '',
      outline: 'glass-focus glass-border-subtle',
    };

    const getElevation = (): 'level1' | 'level2' | 'level3' | 'level4' | 'level5' => {
      if (variant === 'elevated') return 'level2';
      if (variant === 'feature') return 'level3';
      if (variant === 'minimal') return 'level1';
      return elevation || 'level1';
    };

    const isInteractive = interactive || hoverable || clickable;

    return material === 'liquid' ? (
      <LiquidGlassMaterial
        ref={ref}
        ior={materialProps?.ior || (variant === 'elevated' ? 1.48 : variant === 'feature' ? 1.50 : 1.45)}
        thickness={materialProps?.thickness || (size === 'sm' ? 8 : size === 'md' ? 12 : size === 'lg' ? 16 : 20)}
        tint={
          materialProps?.tint && typeof materialProps.tint === 'object' && 'r' in materialProps.tint
            ? materialProps.tint as { r: number; g: number; b: number; a: number }
            : tint && typeof tint === 'object' && 'r' in tint
            ? tint as { r: number; g: number; b: number; a: number }
            : variant === 'primary'
            ? { r: 59, g: 130, b: 246, a: 0.08 }
            : { r: 0, g: 0, b: 0, a: 0.06 }
        }
        variant={materialProps?.variant || 'regular'}
        quality={materialProps?.quality || (variant === 'feature' ? 'ultra' : 'high')}
        environmentAdaptation
        motionResponsive
        interactive={isInteractive}
        className={cn(
          'liquid-glass-card-surface relative glass-radius-xl overflow-hidden',
          'transition-all duration-300 ease-out',
          hoverable && [
            'group'
          ],
          sizeClasses[size],
          variantClasses[variant],
          {
            'opacity-50 pointer-events-none': disabled,
            'cursor-pointer': clickable && !disabled,
            'hover:scale-105 active:scale-95': hoverable && !disabled,
            'animate-pulse': loading,
          },
          className
        )}
        style={{
          '--liquid-glass-card-density': variant === 'minimal' ? '0.8' : '0.92',
          '--liquid-glass-hover-lift': hoverable ? '8px' : '0px',
          '--liquid-glass-interaction-depth': isInteractive ? '1.05' : '1.0',
        } as React.CSSProperties}
        data-liquid-glass-card="true"
        data-card-variant={variant}
        data-card-size={size}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-white/10 glass-gradient-primary animate-shimmer" />
        )}
        {children}
      </LiquidGlassMaterial>
    ) : (
      <OptimizedGlass
        ref={ref}
        elevation={getElevation()}
        intensity="medium"
        depth={variant === 'elevated' ? 'deep' : 'medium'}
        border={variant === 'outlined' ? 'glow' : 'subtle'}
        interactive={isInteractive}
        tier="high"
        className={cn(
          'glass-foundation-complete relative glass-radius-xl overflow-hidden glass-overlay-noise glass-edge glass-overlay-specular glass-typography-reset',
          'transition-all duration-300 ease-out',
          // Advanced hover effects with glass enhancement
          hoverable && [
            'group'
          ],
          sizeClasses[size],
          variantClasses[variant],
          {
            // Sophisticated micro-interactions
            'hover:scale-[1.008] hover:-translate-y-1': hoverable && !disabled,
            'hover:shadow-2xl hover:shadow-blue-500/10': hoverable && !disabled,
            // Enhanced click feedback
            'cursor-pointer': clickable && !disabled,
            'active:scale-[0.995] active:translate-y-0': clickable && !disabled,
            '': clickable && !disabled, // Remove broken CSS class
            // Disabled state
            'opacity-50 pointer-events-none': disabled,
            // Loading state
            'animate-pulse': loading,
          },
          className
        )}
        {...props}
      >
        {/* Advanced micro-interaction overlays */}
        {hoverable && (
          <>
            {/* Subtle glow overlay on hover */}
            <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-transparent glass-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none glass-radius-lg" />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-white/10 glass-gradient-primary -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none glass-radius-lg" />

            {/* Border glow enhancement */}
            <div className="absolute inset-0 glass-radius-lg border border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
          </>
        )}

        {/* Feature variant enhancement */}
        {variant === 'feature' && (
          <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-secondary/4 glass-gradient-primary glass-radius-lg" />
        )}

        {/* Content with enhanced loading state */}
        <div className="relative z-10">
          {loading ? (
            <div className="glass-auto-gap glass-auto-gap-md">
              <div className="h-4 glass-surface-subtle/20 animate-pulse glass-radius-sm shimmer" />
              <div className="h-4 glass-surface-subtle/15 animate-pulse glass-radius-sm w-3-4 shimmer" />
              <div className="h-4 glass-surface-subtle/10 animate-pulse glass-radius-sm w-1-2 shimmer" />
            </div>
          ) : (
            children
          )}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * CardHeader component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Header size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show border below header
   */
  bordered?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ size = 'md', bordered = false, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'glass-pb-2',
      md: 'glass-pb-3',
      lg: 'glass-pb-4',
    };

    return (
      <div data-glass-component
        ref={ref}
        className={cn(
          'flex flex-col glass-gap-1-5',
          sizeClasses[size],
          {
            'border-b glass-border-subtle': bordered,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Title size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Heading level
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ size = 'md', level = 3, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'glass-text-base font-medium',
      md: 'glass-text-lg font-semibold',
      lg: 'glass-text-xl font-semibold',
      xl: 'glass-text-2xl font-bold',
    };

    const headingProps = {
      ref,
      className: cn(
        'glass-text-primary leading-none tracking-tight',
        sizeClasses[size],
        className
      ),
      ...props,
      children
    };

    switch (level) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      case 5:
        return <h5 {...headingProps} />;
      case 6:
        return <h6 {...headingProps} />;
      default:
        return <h3 {...headingProps} />;
    }
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Description size
   */
  size?: 'sm' | 'md' | 'lg';
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'glass-text-xs',
      md: 'glass-text-sm',
      lg: 'glass-text-base',
    };

    return (
      <p
        ref={ref}
        className={cn(
          'glass-text-secondary',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Automatically add vertical spacing between direct children
   * Defaults to true for better readability across components
   */
  autoSpacing?: boolean;
  /**
   * Spacing size when autoSpacing is enabled
   */
  spacing?: 'sm' | 'md' | 'lg';
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ padding = 'none', autoSpacing = true, spacing = 'md', className, children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'glass-p-2',
      md: 'glass-p-4',
      lg: 'glass-p-6',
    };
    const spacingClass = autoSpacing
      ? spacing === 'sm'
        ? 'glass-auto-gap glass-auto-gap-sm'
        : spacing === 'lg'
          ? 'glass-auto-gap glass-auto-gap-lg'
          : 'glass-auto-gap glass-auto-gap-md'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'glass-text-primary',
          paddingClasses[padding],
          spacingClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Footer alignment
   */
  align?: 'left' | 'center' | 'right' | 'between' | 'around';
  /**
   * Whether to show border above footer
   */
  bordered?: boolean;
  /**
   * Footer padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'left', bordered = false, padding = 'md', className, children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    };

    const paddingClasses = {
      none: '',
      sm: 'glass-pt-2',
      md: 'glass-pt-3',
      lg: 'glass-pt-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          alignClasses[align],
          paddingClasses[padding],
          {
            'border-t glass-border-subtle': bordered,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * CardActions component
 */
export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Actions alignment
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Actions spacing
   */
  spacing?: 'sm' | 'md' | 'lg';
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ align = 'right', spacing = 'md', className, children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    const spacingClasses = {
      sm: 'glass-gap-1',
      md: 'glass-gap-2',
      lg: 'glass-gap-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          alignClasses[align],
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardActions.displayName = 'CardActions';
