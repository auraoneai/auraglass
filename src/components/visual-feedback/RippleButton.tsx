'use client';
/**
 * RippleButton Component
 *
 * A button component with ripple effect feedback.
 */
import React, { forwardRef, useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassButton as Button } from '../button';
import { createGlassStyle } from '../../core/mixins/glassMixins';
// Import base Button
import { GlassButtonProps as ButtonProps } from '../button/types'; // Import ButtonProps from correct file

import { RippleButtonProps } from './types';
import styles from './RippleButton.module.css';

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
    case 'white':
      return '255, 255, 255';
    default:
      // If it's already an RGB value in format 'r, g, b'
      if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
        return color;
      }
      // Default color (white)
      return '255, 255, 255';
  }
};

// Get ripple size based on button size
const getRippleSize = (size: string): number => {
  switch (size) {
    case 'small':
      return 100;
    case 'large':
      return 200;
    case 'medium':
    default:
      return 150;
  }
};

// Get ripple duration based on speed - Adjusted default
const getRippleDuration = (speed: string): number => {
  switch (speed) {
    case 'slow':
      return 900;
    case 'fast':
      return 400;
    case 'medium':
    default:
      return 300; // Shortened default duration further for better sync with physics
  }
};

/**
 * RippleButton Component Implementation
 * Wraps the base Button component to add a ripple effect.
 */
function RippleButtonComponent(
  // Inherit ButtonProps and add Ripple-specific props
  props: RippleButtonProps & Omit<ButtonProps, 'onClick' | 'onMouseDown'>, 
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const {
    children,
    disabled = false,
    rippleColor = 'white',
    rippleSize: rippleSizeProp, // Rename prop to avoid conflict
    rippleSpeed = 'medium',
    centerRipple = false,
    onClick,
    onMouseDown, // Capture original onMouseDown
    // Extract Button props
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    style,
    ...rest // Rest are Button props
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleCount = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null); // Ref for the wrapper

  // Handle ripple creation on mouse down
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || prefersReducedMotion) {
        if (onMouseDown) onMouseDown(event); // Call original handler
        return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    let x, y;

    if (centerRipple) {
      x = rect.width / 2;
      y = rect.height / 2;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    const id = rippleCount.current++;
    const duration = getRippleDuration(rippleSpeed);
    
    // Start ripple animation
    setRipples((prev: any) => [...prev, { id, x, y }]);

    // Schedule ripple removal after animation duration
    setTimeout(() => {
      setRipples((prev: any) => prev.filter((r: any) => r.id !== id));
    }, duration);

    // Call the original onMouseDown handler if provided
    if (onMouseDown) {
        onMouseDown(event);
    }
  }, [disabled, prefersReducedMotion, centerRipple, rippleSpeed, onMouseDown]); // Added dependencies

  const rippleSizeValue = rippleSizeProp ? getRippleSize(rippleSizeProp) : getRippleSize(size); // Use prop or button size
  const rippleDuration = getRippleDuration(rippleSpeed);
  const rippleColorRgb = colorToRgb(rippleColor);

  const wrapperStyle = useMemo<React.CSSProperties>(() => {
    const base = createGlassStyle({ intent: 'neutral', elevation: 'level2', tier: 'high' });
    const { position, ...rest } = base;
    return {
      ...rest,
      '--ripple-color-rgb': rippleColorRgb,
    } as React.CSSProperties;
  }, [rippleColorRgb]);

  return (
    // Apply ripple color CSS variable to the wrapper
    <div
        ref={wrapperRef}
        style={wrapperStyle}
        className={cn(styles.wrapper, 'glass-ripple-button glass-contrast-guard', className)} // Pass className to wrapper for styling
    >
      <Button
        ref={ref} // Forward the ref to the underlying Button
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        className="glass-focus glass-touch-target"
        style={style} // Pass style to Button
        onClick={onClick} // Pass original onClick
        onMouseDown={handleMouseDown} // Use our wrapper mouse down
        {...{
          ...rest,
          'aria-pressed': rest['aria-pressed'] === 'true' ? true :
                         rest['aria-pressed'] === 'false' ? false :
                         rest['aria-pressed'] === 'mixed' ? undefined :
                         rest['aria-pressed'],
          'aria-expanded': rest['aria-expanded'] === 'true' ? true :
                          rest['aria-expanded'] === 'false' ? false :
                          rest['aria-expanded']
        }} // Pass rest of Button props with aria attribute transformations
      >
        {children}
      </Button>

      {/* Render ripples */}
      {!prefersReducedMotion && (
        <div className={styles.ripples} aria-hidden="true">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x - rippleSizeValue / 2,
                top: ripple.y - rippleSizeValue / 2,
                width: rippleSizeValue,
                height: rippleSizeValue,
                animationDuration: `${rippleDuration}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * RippleButton Component
 *
 * A button component that wraps the base Button to add a ripple effect feedback.
 * It inherits physics interactions from the base Button.
 */
const RippleButton = forwardRef(RippleButtonComponent);

export default RippleButton;
