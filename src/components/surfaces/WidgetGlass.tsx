/**
 * WidgetGlass Component
 *
 * A specialized glass component for UI widgets with enhanced effects.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass, Motion } from '../../primitives';
import { useReducedMotion } from '../../hooks/useReducedMotion';

import { WidgetGlassProps } from './types';


/**
 * WidgetGlass Component
 * Modern implementation using OptimizedGlass with widget-specific features
 */
export const WidgetGlass = React.memo(forwardRef<HTMLDivElement, WidgetGlassProps>(
  (
    {
      children,
      className,
      style,
      elevation = 'level2',
      blurStrength = 'standard',
      opacity = 'medium',
      borderOpacity = 'medium',
      borderWidth = 1,
      fullWidth = false,
      fullHeight = false,
      borderRadius = 'md',
      interactive = true,
      padding = 16,
      widgetType = 'card',
      highlightOnHover = true,
      animateOnMount = true,
      priority = 'medium',
      backgroundColor,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animateOnMount && !prefersReducedMotion;
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Map blur strength to intensity
    const intensityMap = {
      none: 'subtle' as const,
      light: 'subtle' as const,
      standard: 'medium' as const,
      heavy: 'strong' as const,
    };

    // Map border radius
    const radiusMap = {
      none: 'rounded-none',
      sm: 'glass-radius-sm',
      md: 'glass-radius-md',
      lg: 'glass-radius-lg',
      xl: 'glass-radius-xl',
      full: 'glass-radius-full',
    };

    // Map elevation to OptimizedGlass elevation levels
    const getElevationLevel = (elev: any) => {
      if (typeof elev === 'string' && elev.startsWith('level')) {
        return elev as 'level1' | 'level2' | 'level3' | 'level4';
      }
      const numElev = typeof elev === 'number' ? elev : 2;
      if (numElev <= 1) return 'level1';
      if (numElev <= 2) return 'level2';
      if (numElev <= 3) return 'level3';
      return 'level4';
    };

    // Calculate depth based on priority
    const getDepth = (priority: 'low' | 'medium' | 'high') => {
      switch (priority) {
        case 'high': return 4;
        case 'low': return 1;
        default: return 2;
      }
    };

    // Calculate z-index based on priority
    const getZIndex = (priority: 'low' | 'medium' | 'high') => {
      switch (priority) {
        case 'high': return 10;
        case 'low': return 1;
        default: return 5;
      }
    };

    // Handle mouse events
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Mount animation
    useEffect(() => {
      if (shouldAnimate) {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer);
      } else {
        setIsMounted(true);
      }
    }, [shouldAnimate]);

    return (
      <Motion
        preset={shouldAnimate ? "bounceIn" : "none"}
        className="relative"
      >
        <OptimizedGlass
          ref={ref}
          intent="neutral"
          elevation={getElevationLevel(elevation)}
          intensity={intensityMap[blurStrength]}
          depth={getDepth(priority)}
          tint="neutral"
          border={borderOpacity === 'none' ? 'none' : 'subtle'}
          animation={shouldAnimate ? "breathe" : "none"}
          performanceMode="high"
          liftOnHover={interactive && highlightOnHover}
          press={interactive}
          className={cn(
            // Base styles
            'relative block box-border overflow-hidden transition-all duration-300',
            
            // Widget type styles
            widgetType === 'card' && 'bg-gradient-to-br from-white/10 to-white/5',
            widgetType === 'panel' && 'bg-gradient-to-r from-white/8 to-white/12',
            widgetType === 'container' && 'bg-white/5',
            widgetType === 'overlay' && 'bg-white/20 backdrop-blur-md',
            
            // Size
            fullWidth && 'w-full',
            fullHeight && 'h-full',
            !fullWidth && !fullHeight && 'w-auto h-auto',
            
            // Border radius
            typeof borderRadius === 'string' ? radiusMap[borderRadius] : `rounded-[${borderRadius}px]`,
            
            // Padding
            typeof padding === 'number' ? `p-${Math.round(padding / 4)}` : 'glass-p-4',
            
            // Interactive styles
            interactive && [
              'cursor-pointer',
              'hover:-translate-y-0.5 hover:shadow-lg',
              'active:translate-y-0 active:scale-[0.98]',
            ],
            
            // Priority-based shadow
            priority === 'high' && 'shadow-2xl',
            priority === 'medium' && 'shadow-lg',
            priority === 'low' && 'shadow-md',
            
            // Highlight on hover
            highlightOnHover && isHovered && 'ring-2 ring-blue-500/30 shadow-blue-500/20',
            
            // Mount animation
            shouldAnimate && [
              !isMounted ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0',
            ],
            
            className
          )}
          style={{
            backgroundColor,
            borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
            zIndex: getZIndex(priority),
            ...style,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...rest}
        >
          {/* Widget highlight overlay */}
          {highlightOnHover && isHovered && interactive && (
            <div 
              className="absolute inset-0 pointer-events-none glass-radius-inherit transition-opacity duration-200"
              style={{
                background: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
                opacity: 0.6,
              }}
            />
          )}
          
          {/* Pulse animation for high priority widgets */}
          {priority === 'high' && shouldAnimate && (
            <div 
              className="absolute inset-0 pointer-events-none glass-radius-inherit animate-pulse"
              style={{
                boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                opacity: isHovered ? 0.6 : 0.3,
                transition: 'opacity 300ms ease',
              }}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </OptimizedGlass>
      </Motion>
    );
  }
));

WidgetGlass.displayName = 'WidgetGlass';

export default WidgetGlass;
