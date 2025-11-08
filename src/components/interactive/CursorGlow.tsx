'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { forwardRef, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useA11yId } from '../../utils/a11y';

export interface CursorGlowProps {
  size?: number; // diameter in px
  intensity?: number; // 0..1
  color?: string; // CSS color for glow
  opacity?: number; // 0..1
  global?: boolean; // fixed overlay
  
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** ARIA label for accessibility */
  'aria-label'?: string;
  
  /** Custom ID */
  id?: string;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

/**
 * CursorGlow
 * Renders a pointer-following radial glow. Pointer-events: none.
 * Uses rAF to throttle updates. Respects reduced motion.
 */
export const CursorGlow = forwardRef<HTMLDivElement, CursorGlowProps>((
  {
    size = 280,
    intensity = 0.6,
    color = 'var(--glass-white)',
    opacity = 0.18,
    global = true,
    respectMotionPreference = true,
    className,
    'aria-label': ariaLabel,
    id,
    ...props
  },
  ref
) => {
  const reduce = useReducedMotion();
  const componentId = useA11yId(id || 'cursor-glow');
  const localRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const latest = useRef({ x: -9999, y: -9999 });
  
  // Combine refs
  const combinedRef = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    if ((respectMotionPreference && reduce)) return; // respect reduced motion
    const handleMove = (e: MouseEvent) => {
      latest.current = { x: e.clientX, y: e.clientY };
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const el = localRef.current; if (!el) return;
        const { x, y } = latest.current;
        el.style.background = `radial-gradient(${size}px ${size}px at ${x}px ${y}px, ${color}${toAlpha(opacity)}, transparent ${Math.round(
          100 * (1 - opacity)
        )}%)`;
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [size, color, opacity, reduce, respectMotionPreference]);

  return (
    <div
      ref={combinedRef}
      id={componentId}
      className={cn(
        global ? 'glass-fixed' : 'glass-absolute',
        'glass-inset-0 glass-pointer-events-none glass-z-2',
        className
      )}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      style={{
        mixBlendMode: 'screen',
        filter: `blur(${Math.round(size / 16)}px) saturate(${100 + intensity * 60}%)`,
      }}
      {...props}
    />
  );
});

function toAlpha(opacity: number) {
  const a = Math.max(0, Math.min(1, opacity));
  const hex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');
  return hex.length === 2 ? hex : '2d';
}

CursorGlow.displayName = 'CursorGlow';

export default CursorGlow;