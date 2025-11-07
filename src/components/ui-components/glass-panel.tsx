'use client';

import React from 'react';
// PerformantGlass removed - using OptimizedGlass
import { OptimizedGlassCore as OptimizedGlass, OptimizedGlassProps } from '../../primitives/OptimizedGlassCore';
import { cn } from '@/lib/utils';

export interface GlassPanelProps extends Omit<OptimizedGlassProps, 'variant' | 'elevation'> {
  /**
   * Panel variant style
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /**
   * Panel elevation
   */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  /**
   * Whether the panel is interactive
   */
  interactive?: boolean;
  /**
   * Panel padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Panel content
   */
  children: React.ReactNode;
}

/**
 * GlassPanel component
 * A glassmorphism panel using the proper PerformantGlass primitive
 */
const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({
    className,
    elevation = 'level1',
    variant = 'default',
    interactive = false,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    const getGlassIntent = (): 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
      switch (variant) {
        case 'primary':
          return 'primary';
        case 'success':
          return 'success';
        case 'warning':
          return 'warning';
        case 'error':
          return 'danger';
        default:
          return 'neutral';
      }
    };

    return (
      <OptimizedGlass data-glass-component
        ref={ref}
        elevation={elevation}
        intent={getGlassIntent()}
        interactive={interactive}
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          // Map padding to className since OptimizedGlass doesn't have padding prop
          padding === 'none' ? 'glass-p-0' :
            padding === 'sm' ? 'glass-p-2' :
              padding === 'md' ? 'glass-p-4' :
                padding === 'lg' ? 'glass-p-6' :
                  padding === 'xl' ? 'p-8' : 'glass-p-4',
          className
        )}
        {...props}
      >
        {children}
      </OptimizedGlass>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export { GlassPanel };
