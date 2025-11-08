'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAccessibilitySettings } from './useAccessibilitySettings';
import { useEnhancedPerformance } from './useEnhancedPerformance';
import {
  createGlassStyle,
  type GlassElevation,
  type GlassOptions
} from '../core/mixins/glassMixins';
import { type QualityTier } from '../tokens/glass';

export interface GlassOptimizationConfig {
  enableAdaptiveBlur?: boolean;
  enablePerformanceMode?: boolean;
  enableAccessibilityMode?: boolean;
  enableBatching?: boolean;
  maxConcurrentAnimations?: number;
  throttleAnimations?: boolean;
}

export interface OptimizedGlassStyles {
  base: React.CSSProperties;
  hover: React.CSSProperties;
  focus: React.CSSProperties;
  disabled: React.CSSProperties;
  loading: React.CSSProperties;
}

/**
 * Comprehensive glass optimization hook that adapts to device capabilities and user preferences
 */
export function useGlassOptimization(
  baseOptions: GlassOptions = {},
  config: GlassOptimizationConfig = {}
) {
  const {
    enableAdaptiveBlur = true,
    enablePerformanceMode = true,
    enableAccessibilityMode = true,
    enableBatching = true,
    maxConcurrentAnimations = 5,
    throttleAnimations = true,
  } = config;

  const { settings: a11ySettings } = useAccessibilitySettings();
  const { performanceMode, metrics } = useEnhancedPerformance();
  
  const [optimizedOptions, setOptimizedOptions] = useState(baseOptions);
  const [activeAnimations, setActiveAnimations] = useState(0);
  const animationQueueRef = useRef<(() => void)[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();

  // Adaptive blur based on performance
  const adaptiveBlur = useMemo(() => {
    if (!enableAdaptiveBlur) return baseOptions.tier === 'low' ? 'subtle' : 'medium';

    const frameRate = metrics?.frameRate || 60;
    const memoryUsage = metrics?.memoryUsage || 0;

    if (performanceMode === 'low' || frameRate < 30 || memoryUsage > 0.8) {
      return 'subtle';
    } else if (performanceMode === 'high' && frameRate >= 60 && memoryUsage < 0.5) {
      return 'intense';
    }

    return 'medium';
  }, [enableAdaptiveBlur, baseOptions.tier, metrics, performanceMode]);

  // Get tier based on adaptive blur (for backwards compatibility)
  const getTierFromBlur = (blur: string): QualityTier => {
    switch (blur) {
      case 'subtle':
        return 'low';
      case 'intense':
        return 'high';
      default:
        return 'medium';
    }
  };

  // Performance-aware options
  const performanceAwareOptions = useMemo(() => {
    let options = { ...baseOptions };

    if (enablePerformanceMode) {
      switch (performanceMode) {
        case 'low':
          options = {
            ...options,
            elevation: 'level1',
            tier: 'low',
          };
          break;
        case 'high':
          options = {
            ...options,
            tier: 'high',
          };
          break;
        default:
          options = {
            ...options,
            tier: 'medium',
          };
      }
    }

    return options;
  }, [baseOptions, enablePerformanceMode, performanceMode]);

  // Accessibility-aware options
  const accessibilityAwareOptions = useMemo(() => {
    if (!enableAccessibilityMode) return performanceAwareOptions;

    let options = { ...performanceAwareOptions };

    // Reduce effects for users who prefer reduced motion
    if (a11ySettings.reducedMotion) {
      options = {
        ...options,
        interactive: false,
        elevation: 'level1',
      };
    }

    // Enhance contrast for high contrast mode
    if (a11ySettings.highContrast) {
      options = {
        ...options,
        intent: 'neutral',
        tier: 'high',
      };
    }

    // Adjust for forced colors mode
    if (a11ySettings.forcedColors) {
      options = {
        ...options,
        intent: 'neutral',
        tier: 'high',
      };
    }

    return options;
  }, [performanceAwareOptions, enableAccessibilityMode, a11ySettings]);

  // Update optimized options when dependencies change
  useEffect(() => {
    setOptimizedOptions(accessibilityAwareOptions);
  }, [accessibilityAwareOptions]);

  // Generate optimized styles
  const optimizedStyles = useMemo((): OptimizedGlassStyles => {
    const performanceOptions = {
      mode: performanceMode,
      prefersReducedMotion: a11ySettings.reducedMotion,
    };

    const baseStyles = {
      ...createGlassStyle(optimizedOptions),
      // Performance options applied directly
    };

    return {
      base: baseStyles,
      hover: {
        ...baseStyles,
        transform: a11ySettings.reducedMotion ? 'none' : 'translateY(-2px) scale(1.02)',
        boxShadow: optimizedOptions.elevation ? 
          `0 8px 32px rgba(0, 0, 0, 0.2)` : 
          baseStyles.boxShadow,
      },
      focus: {
        ...baseStyles,
        outline: 'none',
        boxShadow: `${baseStyles.boxShadow}, 0 0 0 3px var(--glass-color-primary, 0.3)`,
      },
      disabled: {
        ...baseStyles,
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
        filter: 'grayscale(0.3)',
      },
      loading: {
        ...baseStyles,
        position: 'relative',
        overflow: 'hidden',
        // Note: CSS pseudo-elements cannot be applied via React.CSSProperties
        // Use styled-components or CSS modules for complex pseudo-element styling
      },
    };
  }, [optimizedOptions, performanceMode, a11ySettings]);

  // Animation batching system
  const batchAnimation = useCallback((animationFn: () => void) => {
    if (!enableBatching) {
      animationFn();
      return;
    }

    animationQueueRef.current.push(animationFn);

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      const animations = animationQueueRef.current.splice(0);
      
      // Execute animations in batches to avoid overwhelming the browser
      const batchSize = Math.min(animations.length, maxConcurrentAnimations);
      
      for (let i = 0; i < animations.length; i += batchSize) {
        const batch = animations.slice(i, i + batchSize);
        
        setTimeout(() => {
          batch.forEach((animation: any) => {
            try {
              animation();
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Batched animation failed:', error);
              }
            }
          });
        }, i * 16); // Stagger batches by 16ms (60fps)
      }
    }, 16); // Batch animations for one frame
  }, [enableBatching, maxConcurrentAnimations]);

  // Throttled animation executor
  const executeAnimation = useCallback((animationFn: () => void) => {
    if (!throttleAnimations || activeAnimations < maxConcurrentAnimations) {
      setActiveAnimations((prev: any) => prev + 1);
      
      try {
        animationFn();
      } finally {
        // Decrement counter after animation completes
        setTimeout(() => {
          setActiveAnimations((prev: any) => Math.max(0, prev - 1));
        }, 300); // Assume average animation duration
      }
    } else {
      // Queue animation for later execution
      batchAnimation(animationFn);
    }
  }, [throttleAnimations, activeAnimations, maxConcurrentAnimations, batchAnimation]);

  // Cleanup batched animations on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      animationQueueRef.current = [];
    };
  }, []);

  return {
    optimizedOptions,
    optimizedStyles,
    performanceMode,
    isHighPerformance: performanceMode === 'high',
    isLowPerformance: performanceMode === 'low',
    shouldReduceEffects: a11ySettings.reducedMotion || performanceMode === 'low',
    shouldUseHighContrast: a11ySettings.highContrast,
    executeAnimation,
    batchAnimation,
    activeAnimations,
    metrics,
  };
}

/**
 * Hook for optimized glass component rendering
 */
export function useOptimizedGlassComponent<P extends object>(
  Component: React.ComponentType<P>,
  glassOptions: GlassOptions = {},
  optimizationConfig: GlassOptimizationConfig = {}
) {
  const {
    optimizedStyles,
    shouldReduceEffects,
    executeAnimation,
  } = useGlassOptimization(glassOptions, optimizationConfig);

  const OptimizedComponent = useMemo(() => {
    return React.memo(React.forwardRef<any, P>((props, ref) => {
      const componentRef = useRef<HTMLElement>(null);
      const mergedRef = useCallback((node: HTMLElement | null) => {
        if (componentRef.current !== node) {
          (componentRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }, [ref]);

      // Apply optimized styles
      useEffect(() => {
        const element = componentRef.current;
        if (!element) return;

        Object.assign(element.style, optimizedStyles.base);

        // Set up interaction handlers if not reduced motion
        if (!shouldReduceEffects) {
          const handleMouseEnter = () => {
            executeAnimation(() => {
              Object.assign(element.style, optimizedStyles.hover);
            });
          };

          const handleMouseLeave = () => {
            executeAnimation(() => {
              Object.assign(element.style, optimizedStyles.base);
            });
          };

          element.addEventListener('mouseenter', handleMouseEnter);
          element.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
          };
        }
      }, []);

      return <Component {...(props as P)} ref={mergedRef} />;
    }));
  }, [Component, optimizedStyles, shouldReduceEffects, executeAnimation]);

  return OptimizedComponent;
}

/**
 * Hook for adaptive component loading based on performance
 */
export function useAdaptiveComponentLoading<T>(
  heavyComponent: () => Promise<{ default: React.ComponentType<T> }>,
  lightComponent: React.ComponentType<T>,
  threshold: {
    memoryUsage?: number;
    frameRate?: number;
    networkSpeed?: string[];
  } = {}
): {
  Component: React.ComponentType<T> | null;
  isLoading: boolean;
  error: Error | null;
} {
  const {
    memoryUsage = 0.7,
    frameRate = 45,
    networkSpeed = ['4g', '5g'],
  } = threshold;

  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { metrics } = useEnhancedPerformance();

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Determine if we should load the heavy component
        const shouldLoadHeavy = (
          !metrics ||
          (
            (metrics.memoryUsage < memoryUsage) &&
            (metrics.frameRate >= frameRate) &&
            (networkSpeed.includes(metrics.networkSpeed))
          )
        );

        if (shouldLoadHeavy) {
          const heavyModule = await heavyComponent();
          setComponent(() => heavyModule.default);
        } else {
          setComponent(() => lightComponent);
        }
      } catch (err) {
        setError(err as Error);
        setComponent(() => lightComponent); // Fallback to light component
      } finally {
        setIsLoading(false);
      }
    };

    loadComponent();
  }, [heavyComponent, lightComponent, metrics, memoryUsage, frameRate, networkSpeed]);

  return {
    Component,
    isLoading,
    error,
  };
}