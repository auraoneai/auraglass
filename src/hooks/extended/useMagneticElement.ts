/**
 * Magnetic Element Hook
 * Creates magnetic attraction effect where elements follow the cursor
 */

import { useCallback, useEffect, useRef, useState, CSSProperties } from 'react';
import { Vector2D, createVector2D } from '../../types/common';
import { useReducedMotion } from '../useReducedMotion';

/**
 * Magnetic element options
 */
export interface UseMagneticElementOptions {
  strength?: number; // Magnetic strength (0-1)
  range?: number; // Activation range in pixels
  speed?: number; // Animation speed
  maxDistance?: number; // Maximum distance element can move
  returnSpeed?: number; // Speed of returning to original position
  onActivate?: () => void;
  onDeactivate?: () => void;
  disabled?: boolean;
}

/**
 * Hook for magnetic element effect
 */
export const useMagneticElement = (options: UseMagneticElementOptions = {}) => {
  const {
    strength = 0.3,
    range = 100,
    speed = 0.15,
    maxDistance = 30,
    returnSpeed = 0.2,
    onActivate,
    onDeactivate,
    disabled = false,
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<Vector2D>(createVector2D(0, 0));
  const [isActive, setIsActive] = useState(false);

  const targetPositionRef = useRef<Vector2D>(createVector2D(0, 0));
  const currentPositionRef = useRef<Vector2D>(createVector2D(0, 0));
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Calculate magnetic force
   */
  const calculateMagneticForce = useCallback(
    (mouseX: number, mouseY: number, element: HTMLElement): Vector2D | null => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if within range
      if (distance > range) {
        return null;
      }

      // Calculate magnetic pull
      const pullStrength = (1 - distance / range) * strength;

      // Calculate target position
      let targetX = dx * pullStrength;
      let targetY = dy * pullStrength;

      // Limit maximum distance
      const targetDistance = Math.sqrt(targetX * targetX + targetY * targetY);
      if (targetDistance > maxDistance) {
        const scale = maxDistance / targetDistance;
        targetX *= scale;
        targetY *= scale;
      }

      return createVector2D(targetX, targetY);
    },
    [strength, range, maxDistance]
  );

  /**
   * Lerp (linear interpolation) function
   */
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    const current = currentPositionRef.current;
    const target = targetPositionRef.current;

    // Lerp current position towards target
    const newX = lerp(current.x, target.x, isActive ? speed : returnSpeed);
    const newY = lerp(current.y, target.y, isActive ? speed : returnSpeed);

    currentPositionRef.current = createVector2D(newX, newY);
    setPosition(createVector2D(newX, newY));

    // Continue animation if not at target
    const distance = Math.sqrt(
      Math.pow(target.x - newX, 2) + Math.pow(target.y - newY, 2)
    );

    if (distance > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isActive, speed, returnSpeed, lerp]);

  /**
   * Handle mouse move
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!elementRef.current || disabled || prefersReducedMotion) return;

      const force = calculateMagneticForce(
        event.clientX,
        event.clientY,
        elementRef.current
      );

      if (force) {
        if (!isActive) {
          setIsActive(true);
          onActivate?.();
        }

        targetPositionRef.current = force;

        // Start animation loop if not already running
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      } else {
        if (isActive) {
          setIsActive(false);
          onDeactivate?.();
        }

        // Return to original position
        targetPositionRef.current = createVector2D(0, 0);

        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    },
    [
      disabled,
      prefersReducedMotion,
      calculateMagneticForce,
      isActive,
      animate,
      onActivate,
      onDeactivate,
    ]
  );

  /**
   * Handle mouse leave (for document)
   */
  const handleMouseLeave = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      onDeactivate?.();
    }

    targetPositionRef.current = createVector2D(0, 0);

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isActive, animate, onDeactivate]);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [handleMouseMove, handleMouseLeave, disabled, prefersReducedMotion]);

  /**
   * Get transform style
   */
  const getStyle = useCallback((): CSSProperties => {
    if (prefersReducedMotion || disabled) {
      return {};
    }

    return {
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      transition: 'none', // Smooth animation handled by RAF
    };
  }, [position, prefersReducedMotion, disabled]);

  /**
   * Reset position
   */
  const reset = useCallback(() => {
    targetPositionRef.current = createVector2D(0, 0);
    currentPositionRef.current = createVector2D(0, 0);
    setPosition(createVector2D(0, 0));
    setIsActive(false);
  }, []);

  return {
    ref: elementRef,
    position,
    isActive,
    style: getStyle(),
    reset,
  };
};
