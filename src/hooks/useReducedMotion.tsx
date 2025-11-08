'use client';
/**
 * Reduced Motion Hook and Utilities
 * Respects user's prefers-reduced-motion preference
 * WCAG 2.1 Success Criterion 2.3.3 (AAA)
 */

import React from 'react';
import { useEffect, useState } from 'react';
import { getSafeDocument, isBrowser, safeMatchMedia } from '../utils/env';

/**
 * Hook to detect user's reduced motion preference
 *
 * CRITICAL: Defaults to `false` (no reduced motion) on both server and initial client render
 * to prevent SSR hydration mismatches. The actual preference is detected after hydration.
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // CRITICAL FIX: Start with `false` on both server and client to prevent hydration mismatch
  // The server cannot access matchMedia, so we default to false (motion allowed)
  // This matches the first client render, preventing inline style mismatches
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect actual motion preference after hydration
    if (!isBrowser()) {
      return;
    }

    const mediaQuery = safeMatchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;

    // Update to actual preference
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    if (typeof (mediaQuery as any).addListener === 'function') {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * @param defaultDuration - Default duration in ms
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns duration in ms (0 if reduced motion)
 */
export function getAnimationDuration(
  defaultDuration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0 : defaultDuration;
}

/**
 * Get transition duration CSS variable
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns CSS duration value
 */
export function getTransitionDuration(prefersReducedMotion: boolean): string {
  return prefersReducedMotion ? '0ms' : 'var(--glass-motion-duration-normal, 250ms)';
}

/**
 * Get animation CSS class based on reduced motion preference
 * @param animationClass - Animation class to apply
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns animation class or empty string
 */
export function getAnimationClass(
  animationClass: string,
  prefersReducedMotion: boolean
): string {
  return prefersReducedMotion ? '' : animationClass;
}

/**
 * Motion configuration based on reduced motion preference
 */
export interface MotionConfig {
  duration: number;
  delay: number;
  easing: string;
  scale: number;
  opacity: number;
}

/**
 * Get motion configuration
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @param defaultConfig - Default motion configuration
 * @returns Motion configuration
 */
export function getMotionConfig(
  prefersReducedMotion: boolean,
  defaultConfig: Partial<MotionConfig> = {}
): MotionConfig {
  const defaults: MotionConfig = {
    duration: 250,
    delay: 0,
    easing: 'ease-in-out',
    scale: 1,
    opacity: 1,
  };

  if (prefersReducedMotion) {
    return {
      duration: 0,
      delay: 0,
      easing: 'linear',
      scale: 1,
      opacity: 1,
    };
  }

  return {
    ...defaults,
    ...defaultConfig,
  };
}

/**
 * Apply reduced motion to inline styles
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns CSS properties object
 */
export function getReducedMotionStyles(prefersReducedMotion: boolean): React.CSSProperties {
  if (prefersReducedMotion) {
    return {
      animationDuration: '0.001ms !important' as any,
      animationIterationCount: '1 !important' as any,
      transitionDuration: '0.001ms !important' as any,
      scrollBehavior: 'auto !important' as any,
    };
  }
  return {};
}

/**
 * Wrapper component that respects reduced motion
 */
export interface ReducedMotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ReducedMotionWrapper: React.FC<ReducedMotionWrapperProps> = ({
  children,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={className}
      style={{
        ...style,
        ...getReducedMotionStyles(prefersReducedMotion),
      }}
      data-reduced-motion={prefersReducedMotion}
    >
      {children}
    </div>
  );
};

/**
 * CSS-in-JS animation utilities
 */
export const reducedMotionStyles = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

/**
 * Add reduced motion CSS to document
 */
export function injectReducedMotionStyles(): void {
  const doc = getSafeDocument();
  if (!doc) return;

  const styleId = 'reduced-motion-styles';

  // Check if already injected
  if (doc.getElementById(styleId)) return;

  const styleElement = doc.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = reducedMotionStyles;
  doc.head?.appendChild(styleElement);
}

/**
 * HOC to add reduced motion support to components
 */
export function withReducedMotion<P extends object>(
  Component: React.ComponentType<P & { prefersReducedMotion?: boolean }>
) {
  return function ReducedMotionComponent(props: P) {
    const prefersReducedMotion = useReducedMotion();

    return <Component {...props} prefersReducedMotion={prefersReducedMotion} />;
  };
}

export default useReducedMotion;