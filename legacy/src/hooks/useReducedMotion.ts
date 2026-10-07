'use client';
import { useEffect, useState } from 'react';
import { isBrowser, safeMatchMedia } from '../utils/env';

/**
 * Hook to detect if user prefers reduced motion
 *
 * CRITICAL: Defaults to `false` (no reduced motion) on both server and initial client render
 * to prevent SSR hydration mismatches. The actual preference is detected after hydration.
 */
export function useReducedMotion(): boolean {
  // CRITICAL FIX: Start with `false` on both server and client to prevent hydration mismatch
  // The server cannot access matchMedia, so we default to false (motion allowed)
  // This matches the first client render, preventing inline style mismatches
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect actual motion preference after hydration
    if (!isBrowser()) return;

    const mediaQuery = safeMatchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;

    // Update to actual preference
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