import React, { forwardRef } from 'react';
import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

import styles from './ChartContainerStyles.module.css';

export interface ChartContainerStyles {
  container: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  legend: CSSProperties;
  grid: CSSProperties;
  tooltip: CSSProperties;
}

const getGlassBackground = (variant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous', color?: string) => {
  switch (variant) {
    case 'clear':
      return 'transparent';
    case 'dynamic':
      return 'color-mix(in srgb, var(--aura-color-glass-overlay) 70%, rgba(12, 18, 32, 0.5))';
    case 'tinted':
      return color ? `color-mix(in srgb, ${color} 18%, rgba(12, 18, 32, 0.65))` : 'rgba(255, 255, 255, 0.08)';
    case 'luminous':
      return 'color-mix(in srgb, var(--aura-color-semantic-primary) 12%, rgba(255, 255, 255, 0.08))';
    default:
      return 'color-mix(in srgb, var(--aura-color-glass-surface) 92%, transparent)';
  }
};

const getBlurValue = (strength?: 'none' | 'light' | 'standard' | 'heavy') => {
  switch (strength) {
    case 'none':
      return 'none';
    case 'light':
      return 'blur(var(--aura-glass-neutral-level1-backdrop-blur))';
    case 'heavy':
      return 'blur(var(--aura-glass-neutral-level3-backdrop-blur))';
    default:
      return 'blur(var(--aura-glass-neutral-level2-backdrop-blur))';
  }
};

const getElevationShadow = (elevation?: number) => {
  switch (elevation) {
    case 0:
      return 'none';
    case 1:
      return '0 12px 28px rgba(15, 23, 42, 0.18)';
    case 2:
      return '0 18px 48px rgba(15, 23, 42, 0.24)';
    case 3:
      return '0 24px 60px rgba(15, 23, 42, 0.28)';
    case 4:
      return '0 32px 80px rgba(15, 23, 42, 0.32)';
    default:
      return '0 18px 48px rgba(15, 23, 42, 0.24)';
  }
};

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  $glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  $blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  $color?: string;
  $borderRadius?: string | number;
  $borderColor?: string;
  $elevation?: number;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>((props, ref) => {
  const {
    $glassVariant = 'frosted',
    $blurStrength = 'standard',
    $color,
    $borderRadius = '12px',
    $borderColor,
    $elevation = 3,
    className,
    style,
    children,
    ...rest
  } = props;

  const background = getGlassBackground($glassVariant, $color);
  const blur = getBlurValue($blurStrength);
  const shadow = getElevationShadow($elevation);

  return (
    <div
      ref={ref}
      className={cn(styles.container, className)}
      style={{
        borderRadius: typeof $borderRadius === 'number' ? `${$borderRadius}px` : $borderRadius,
        background,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        border: `1px solid ${$borderColor || 'color-mix(in srgb, var(--aura-color-global-border-soft) 78%, transparent)'}`,
        boxShadow: shadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
ChartContainer.displayName = 'ChartContainer';

export const ChartHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn(styles.header, className)} {...props} />
);

export const ChartTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn(styles.title, className)} {...props} />
);

export const ChartSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn(styles.subtitle, className)} {...props} />
);

export const createChartContainerStyles = (
  theme: 'light' | 'dark' | 'glass' = 'glass',
  variant: 'default' | 'minimal' | 'detailed' = 'default'
): ChartContainerStyles => {
  const baseStyles: ChartContainerStyles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      padding: '16px',
      borderRadius: '12px',
      background: theme === 'glass'
        ? 'var(--glass-bg-default)'
        : theme === 'dark'
          ? '#1a1a1a'
          : 'var(--glass-white)',
      // Use createGlassStyle() instead,
      border: theme === 'glass' ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))' : '1px solid #e0e0e0',
      boxShadow: theme === 'glass'
        ? '0 8px 32px rgba(var(--glass-color-black) / var(--glass-opacity-10))'
        : '0 2px 8px rgba(var(--glass-color-black) / var(--glass-opacity-10))',
      overflow: 'hidden',
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      color: theme === 'dark' ? 'var(--glass-white)' : '#1a1a1a',
      marginBottom: '8px',
      textAlign: 'center' as const,
    },
    subtitle: {
      fontSize: '14px',
      color: theme === 'dark' ? '#cccccc' : '#666666',
      marginBottom: '16px',
      textAlign: 'center' as const,
    },
    legend: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '12px',
      marginTop: '16px',
      padding: '8px',
    },
    grid: {
      stroke: theme === 'dark' ? '#333333' : '#e0e0e0',
      strokeWidth: 1,
      opacity: 0.3,
    },
    tooltip: {
      background: theme === 'glass'
        ? 'var(--glass-text-secondary-dark)'
        : theme === 'dark'
          ? '#333333'
          : 'var(--glass-white)',
      color: theme === 'dark' ? 'var(--glass-white)' : '#1a1a1a',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(var(--glass-color-black) / var(--glass-opacity-15))',
      border: theme === 'glass' ? '1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))' : 'none',
    },
  };

  // Apply variant-specific modifications
  if (variant === 'minimal') {
    baseStyles.container.padding = '8px';
    baseStyles.title.fontSize = '16px';
    baseStyles.legend.marginTop = '8px';
  } else if (variant === 'detailed') {
    baseStyles.container.padding = '24px';
    baseStyles.title.fontSize = '20px';
    baseStyles.legend.marginTop = '24px';
  }

  return baseStyles;
};
