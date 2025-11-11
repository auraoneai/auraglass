'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { useGlassFocus } from '../../hooks/extended/useGlassFocus';
import type { GlassFocusRingProps } from '../interactive/types';
import { ACCESSIBILITY } from '../../tokens/designConstants';
import styles from './GlassFocusRing.module.css';

// No longer need mergeRefs if attaching ref to wrapper div
// import { mergeRefs } from '../../utils/refUtils'; 

/**
 * A component that wraps a focusable element to provide an animated,
 * glass-styled focus indicator ring.
 */
export const GlassFocusRing: React.FC<GlassFocusRingProps> = ({
  children,
  color,
  ringStyle,
  offset,
  thickness,
  borderRadius,
  disabled,
  className,
  // Extract other potential UseGlassFocusOptions if needed
}) => {
  const childNodes = React.Children.toArray(children);
  const child = childNodes.length === 1 ? childNodes[0] : (
    <span className={styles.placeholder} aria-hidden>
      {childNodes}
    </span>
  );

  // Determine effective color (fallback to accessibility token)
  const effectiveColor = color ?? ACCESSIBILITY.focusRing.color;

  // Hook manages focus classes and state; attach its ref to our wrapper
  const { ref, options } = useGlassFocus({
    color: effectiveColor,
    width: thickness ?? 2,
    offset,
    keyboardNavigation: true,
    enabled: !disabled,
  });

  const focusVars = React.useMemo<React.CSSProperties>(() => ({
    '--glass-focus-color': options.color,
    '--glass-focus-width': `${options.width}px`,
    '--glass-focus-blur': `${options.blur}px`,
    '--glass-focus-offset': `${options.offset}px`,
    '--glass-focus-spread': `${options.spread}px`,
    '--glass-focus-duration': `${options.duration}ms`,
    borderRadius: borderRadius != null ? `${borderRadius}px` : undefined,
  }), [options, borderRadius]);

  return (
    // Wrapper div to capture focus and position the ring
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(styles.wrapper, 'glass-relative glass-inline-block glass-outline-none', className)}
      style={focusVars}
      // Make wrapper focusable only if not disabled
      tabIndex={disabled ? -1 : 0}
    >
      {child}
    </div>
  );
};

// Add default export if this is the main export of the file
// export default GlassFocusRing; 
