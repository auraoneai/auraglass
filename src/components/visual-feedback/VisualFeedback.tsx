'use client';
/**
 * VisualFeedback Component
 *
 * A component that provides visual feedback effects.
 */
import React, { forwardRef, useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createGlassStyle } from '../../core/mixins/glassMixins';

import { VisualFeedbackProps } from './types';
import styles from './VisualFeedback.module.css';

// Convert color string to RGB values
const colorToRgb = (color: string): string => {
  // Convert named colors to their RGB values
  switch (color) {
    case 'primary':
      return '99, 102, 241'; // Indigo
    case 'secondary':
      return '156, 39, 176'; // Purple
    case 'error':
      return '240, 82, 82'; // Red
    case 'info':
      return '3, 169, 244'; // Light Blue
    case 'success':
      return '76, 175, 80'; // Green
    case 'warning':
      return '255, 152, 0'; // Orange
    default:
      // If it's already an RGB value in format 'r, g, b'
      if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
        return color;
      }
      // Default color (white)
      return '255, 255, 255';
  }
};

/**
 * VisualFeedback Component Implementation
 */
function VisualFeedbackComponent(
  props: VisualFeedbackProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    children,
    effect = 'highlight',
    active = false,
    color = 'primary',
    duration = 1000,
    glass = false,
    intensity = 0.5,
    className,
    style,
    ...rest
  } = props;

  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // State for ripple effect
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>(
    []
  );
  const rippleCount = useRef(0);

  // Handle ripple effect
  const handleRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (effect !== 'ripple' || !active || prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add new ripple
    const id = rippleCount.current;
    rippleCount.current += 1;

    const newRipple = { id, x, y, size };
    setRipples(prevRipples => [...prevRipples, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter((r: any) => r.id !== id));
    }, duration);
  };

  // Clean up ripples when component unmounts
  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);

  // Handle forwarded ref
  const setRefs = (element: HTMLDivElement | null) => {
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;

    // Handle the forwarded ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };

  const animationClass = useMemo(() => {
    if (!active || effect === 'none' || prefersReducedMotion) {
      return undefined;
    }

    switch (effect) {
      case 'pulse':
        return styles.pulse;
      case 'glow':
        return styles.glow;
      case 'highlight':
        return styles.highlight;
      case 'bounce':
        return styles.bounce;
      case 'shake':
        return styles.shake;
      default:
        return undefined;
    }
  }, [active, effect, prefersReducedMotion]);

  const containerClassName = cn(
    styles.container,
    effect === 'ripple' && styles.rippleOverflow,
    animationClass,
    'glass-visual-feedback',
    className
  );

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      '--feedback-color-rgb': colorToRgb(color),
      animationDuration: `${duration}ms`,
      ...style,
    }),
    [color, duration, style]
  );

  return (
    <div
      ref={setRefs}
      className={containerClassName}
      style={containerStyle}
      onClick={effect === 'ripple' ? handleRipple : undefined}
      {...rest}
    >
      {glass && active && !prefersReducedMotion ? (
        <div
          className={styles.glassOverlay}
          style={{
            opacity: intensity * 0.5,
            ...createGlassStyle({ intent: 'neutral', elevation: 'level2' }),
          }}
        />
      ) : null}

      <div className={styles.content}>{children}</div>

      {effect === 'ripple' && (
        <div className={styles.ripples}>
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className={styles.ripple}
              style={{
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
                animationDuration: `${duration}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * VisualFeedback Component
 *
 * A component that provides visual feedback effects.
 */
const VisualFeedback = forwardRef(VisualFeedbackComponent);

export default VisualFeedback;
