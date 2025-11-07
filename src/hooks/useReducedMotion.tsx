/**
 * Reduced Motion Hook and Utilities
 * Respects user's prefers-reduced-motion preference
 * WCAG 2.1 Success Criterion 2.3.3 (AAA)
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
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
  if (typeof document === 'undefined') return;

  const styleId = 'reduced-motion-styles';

  // Check if already injected
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = reducedMotionStyles;
  document.head.appendChild(styleElement);
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
