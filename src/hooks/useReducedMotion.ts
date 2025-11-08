import { useEffect, useState } from 'react';
import { isBrowser, safeMatchMedia } from '../utils/env';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? true
  );

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
