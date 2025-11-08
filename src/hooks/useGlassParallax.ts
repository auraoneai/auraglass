'use client';
import { useEffect } from 'react';

export interface UseGlassParallaxOptions {
  strength?: number; // px offset at extremes
  enabled?: boolean;
}

/**
 * Applies a lightweight pointer-based parallax by updating CSS variables
 * --glass-parallax-x and --glass-parallax-y on the target element.
 * Works with CSS utilities that read these variables (e.g., specular overlays).
 */
export function useGlassParallax<T extends HTMLElement>(
  targetRef: React.RefObject<T>,
  { strength = 10, enabled = true }: UseGlassParallaxOptions = {}
) {
  useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current;
    if (!el) return;

    let raf = 0;
    let pending = false;
    let nextX = 0;
    let nextY = 0;

    const setVars = () => {
      pending = false;
      el.style.setProperty('--glass-parallax-x', `${nextX}px`);
      el.style.setProperty('--glass-parallax-y', `${nextY}px`);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2); // -1..1
      const ny = (e.clientY - cy) / (rect.height / 2); // -1..1
      const clampedX = Math.max(-1, Math.min(1, nx));
      const clampedY = Math.max(-1, Math.min(1, ny));
      nextX = clampedX * strength;
      nextY = clampedY * strength;
      if (!pending) {
        pending = true;
        raf = window.requestAnimationFrame(setVars);
      }
    };

    const onLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!pending) {
        pending = true;
        raf = window.requestAnimationFrame(setVars);
      }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetRef, enabled, strength]);
}

export default useGlassParallax;