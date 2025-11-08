/**
 * PageGlassContainer Component
 *
 * A glass container for full page layouts with enhanced glass effects.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass, Motion } from '../../primitives';
import { useReducedMotion } from '../../hooks/useReducedMotion';

import { PageGlassContainerProps } from './types';


/**
 * PageGlassContainer Component
 * Modern implementation using OptimizedGlass with full page layout capabilities
 */
export const PageGlassContainer = React.memo(forwardRef<HTMLDivElement, PageGlassContainerProps>(
  (
    {
      children,
      className,
      style,
      elevation = 'level2',
      blurStrength = 'standard',
      borderRadius = 'none',
      fullWidth = true,
      fullHeight = false,
      fullPage = false,
      maxWidth,
      backgroundColor,
      scrollFade = false,
      dimensionalChildren = false,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !prefersReducedMotion;
    const [scrollPosition, setScrollPosition] = useState(0);

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

    // Handle scroll events for scroll fade effect
    useEffect(() => {
      if (!scrollFade || prefersReducedMotion) return;

      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [scrollFade, prefersReducedMotion]);

    // Calculate max width style
    const maxWidthStyle = maxWidth
      ? typeof maxWidth === 'number'
        ? { maxWidth: `${maxWidth}px` }
        : { maxWidth }
      : {};

    return (
      <Motion
        preset={shouldAnimate ? "fadeIn" : "none"}
        className="relative"
      >
        <OptimizedGlass
          ref={ref}
          intent="neutral"
          elevation={getElevationLevel(elevation)}
          intensity={intensityMap[blurStrength]}
          depth={1}
          tint="neutral"
          border="subtle"
          animation={shouldAnimate && scrollFade ? "breathe" : "none"}
          performanceMode="high"
          className={cn(
            // Base positioning and sizing
            fullPage ? 'fixed inset-0' : 'relative',
            fullWidth ? 'w-full' : 'w-auto',
            fullHeight || fullPage ? 'h-full' : 'h-auto',
            !fullWidth && 'mx-auto',
            
            // Border radius
            radiusMap[borderRadius],
            
            // Layout and spacing
            'p-5 box-border z-0',
            fullPage ? 'overflow-auto' : 'overflow-hidden',
            
            // Scroll fade effect
            scrollFade && shouldAnimate && 'transition-opacity duration-300',
            
            className
          )}
          style={{
            backgroundColor,
            ...maxWidthStyle,
            // Scroll fade opacity
            opacity: scrollFade && scrollPosition > 0 ? Math.max(0.3, 1 - scrollPosition / 500) : 1,
            ...style,
          }}
          {...rest}
        >
          {/* Content wrapper with dimensional effects */}
          <div 
            className={cn(
              'relative z-10',
              dimensionalChildren && shouldAnimate && 'preserve-3d'
            )}
            style={{
              // Parallax effect for dimensional children
              ...(dimensionalChildren && shouldAnimate && {
                transform: `translateZ(${Math.min(20, scrollPosition / 20)}px)`,
                transition: 'transform 100ms ease-out',
              })
            }}
          >
            {children}
          </div>
        </OptimizedGlass>
      </Motion>
    );
  }
));

PageGlassContainer.displayName = 'PageGlassContainer';

export default PageGlassContainer;
