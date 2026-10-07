'use client';
import React from 'react';
import { useRef, useCallback, useEffect } from 'react';

/**
 * useParallax
 * Adds subtle 3D tilt based on pointer position.
 * - maxTilt: degrees of rotation on each axis
 * - perspective: CSS perspective in px
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  maxTilt: number = 8,
  perspective: number = 800
) {
  const ref = useRef<T | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = -py * maxTilt;
    const ry = px * maxTilt;
    el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0.001px)`;
  }, [maxTilt, perspective]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.willChange = 'transform';
    return () => {
      if (el) el.style.willChange = '';
    };
  }, []);

  return { ref, onMouseMove, onMouseLeave } as const;
}