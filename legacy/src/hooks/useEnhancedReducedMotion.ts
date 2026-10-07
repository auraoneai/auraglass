'use client';
import { useEffect, useState } from 'react';
import { isBrowser, safeMatchMedia } from '../utils/env';

/**
 * Enhanced hook for detecting user's reduced motion preference.
 *
 * This hook monitors the user's system-level preference for reduced motion
 * and updates reactively when the preference changes. It's SSR-safe and
 * provides more granular control compared to the basic `useReducedMotion` hook.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useEnhancedReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 *
 * @see {@link useReducedMotion} for a simpler version
 */
export function useEnhancedReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // SSR-safe initialization with conservative default
    return safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? true;
  });

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQuery = safeMatchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    if (typeof (mediaQuery as any).addListener === 'function') {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}