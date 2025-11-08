'use client';
/**
 * ThemedGlassComponents Component
 *
 * A component that applies themed glass styling to its children.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, createContext, useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedGlass, Motion } from '../../primitives';
import { useReducedMotion } from '../../hooks/useReducedMotion';

import { useGlassTheme } from '../../hooks/useGlassTheme';

// Create a context to pass down theme information to children
interface ThemedGlassContextType {
  glassIntensity: number;
  applyGlassEffect: boolean;
  contextData?: Record<string, any>;
}

const ThemedGlassContext = createContext<ThemedGlassContextType>({
  glassIntensity: 0.7,
  applyGlassEffect: true,
});

// Hook to use the themed glass context
export const useThemedGlass = () => useContext(ThemedGlassContext);

// Helper to map glass intensity to elevation level
const mapIntensityToElevation = (intensity: number): 'level1' | 'level2' | 'level3' | 'level4' => {
  if (intensity <= 0.3) return 'level1';
  if (intensity <= 0.6) return 'level2';
  if (intensity <= 0.8) return 'level3';
  return 'level4';
};

/**
 * ThemedGlassComponents Component Props
 * A component that applies themed glass styling to its children
 */
interface ThemedGlassComponentsProps {
  children: React.ReactNode;
  variant?: string;
  colorMode?: string;
  glassIntensity?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  applyGlassEffect?: boolean;
  preserveOriginalStyle?: boolean;
  contextData?: Record<string, any>;
  transitionDuration?: number;
}

export const ThemedGlassComponents = forwardRef<HTMLDivElement, ThemedGlassComponentsProps>(
  (
    {
      children,
      variant,
      colorMode,
      glassIntensity = 0.7,
      animated = true,
      className,
      style,
      applyGlassEffect = true,
      preserveOriginalStyle = true,
      contextData,
      transitionDuration = 300,
      ...rest
    },
    ref
  ) => {
    // Hooks
    const { theme } = useGlassTheme();
    const prefersReducedMotion = useReducedMotion();
    const isDarkMode = theme === 'dark';

    // Track transitions for animation
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Use provided values or fallback to current context
    const effectiveColorMode = colorMode || (isDarkMode ? 'dark' : 'light');
    const effectiveVariant = variant || 'default';
    
    // Map glass intensity to elevation level
    const elevation = mapIntensityToElevation(glassIntensity);

    // Create context value
    const contextValue: ThemedGlassContextType = {
      glassIntensity,
      applyGlassEffect,
      contextData,
    };

    // Handle transition state
    useEffect(() => {
      if (animated) {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration);

        return () => clearTimeout(timer);
      }
    }, [effectiveColorMode, effectiveVariant, animated, transitionDuration]);

    // Render with OptimizedGlass architecture
    return (
      <ThemedGlassContext.Provider value={contextValue}>
        <OptimizedGlass
          ref={ref}
          elevation={elevation}
          intent="neutral"
          tier="high"
          interactive={animated && !prefersReducedMotion}
          className={cn(
            'themed-glass-container',
            animated && !prefersReducedMotion && 'transition-all duration-300',
            isTransitioning && 'glass-transitioning',
            className
          )}
          style={{
            ...style,
            ...(animated && !prefersReducedMotion && {
              transitionDuration: `${transitionDuration}ms`,
            }),
          }}
          {...rest}
        >
          {children}
        </OptimizedGlass>
      </ThemedGlassContext.Provider>
    );
  }
);

ThemedGlassComponents.displayName = 'ThemedGlassComponents';