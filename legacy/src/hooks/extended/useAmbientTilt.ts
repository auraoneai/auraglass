'use client';
/**
 * Ambient Tilt Hook
 * Provides subtle ambient tilting effects based on device orientation or cursor position
 */

import { useCallback, useEffect, useRef, useState, CSSProperties } from 'react';
import { useReducedMotion } from '../useReducedMotion';

/**
 * Tilt configuration options
 */
export interface UseAmbientTiltOptions {
  maxTilt?: number; // Maximum tilt angle in degrees
  reverse?: boolean; // Reverse tilt direction
  perspective?: number; // CSS perspective value
  scale?: number; // Scale on tilt
  speed?: number; // Animation speed (higher = slower)
  easing?: string; // CSS easing function
  glare?: boolean; // Enable glare effect
  gyroscope?: boolean; // Use device gyroscope
  onTilt?: (tiltX: number, tiltY: number) => void;
}

/**
 * Tilt state
 */
interface TiltState {
  tiltX: number;
  tiltY: number;
  glareOpacity: number;
  glarePosition: { x: number; y: number };
}

/**
 * Hook for ambient tilt effects
 */
export const useAmbientTilt = (options: UseAmbientTiltOptions = {}) => {
  const {
    maxTilt = 15,
    reverse = false,
    perspective = 1000,
    scale = 1.05,
    speed = 300,
    easing = 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
    glare = false,
    gyroscope = false,
    onTilt,
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const [tiltState, setTiltState] = useState<TiltState>({
    tiltX: 0,
    tiltY: 0,
    glareOpacity: 0,
    glarePosition: { x: 50, y: 50 },
  });

  const [isHovering, setIsHovering] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Calculate tilt from cursor position
   */
  const calculateTilt = useCallback(
    (clientX: number, clientY: number, element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center
      const offsetX = clientX - centerX;
      const offsetY = clientY - centerY;

      // Calculate tilt angles
      let tiltX = (offsetY / (rect.height / 2)) * maxTilt;
      let tiltY = (offsetX / (rect.width / 2)) * maxTilt;

      if (reverse) {
        tiltX = -tiltX;
        tiltY = -tiltY;
      }

      // Calculate glare position (as percentage)
      const glareX = ((clientX - rect.left) / rect.width) * 100;
      const glareY = ((clientY - rect.top) / rect.height) * 100;

      return {
        tiltX: -tiltX, // Invert X for natural feel
        tiltY: tiltY,
        glarePosition: { x: glareX, y: glareY },
      };
    },
    [maxTilt, reverse]
  );

  /**
   * Handle mouse move
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || prefersReducedMotion) return;

      const { tiltX, tiltY, glarePosition } = calculateTilt(
        event.clientX,
        event.clientY,
        containerRef.current
      );

      setTiltState({
        tiltX,
        tiltY,
        glareOpacity: glare ? 0.3 : 0,
        glarePosition,
      });

      onTilt?.(tiltX, tiltY);
    },
    [calculateTilt, glare, onTilt, prefersReducedMotion]
  );

  /**
   * Handle mouse enter
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTiltState({
      tiltX: 0,
      tiltY: 0,
      glareOpacity: 0,
      glarePosition: { x: 50, y: 50 },
    });
    onTilt?.(0, 0);
  }, [onTilt]);

  /**
   * Handle device orientation (gyroscope)
   */
  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (!gyroscope || prefersReducedMotion) return;

      // Beta is the front-to-back tilt in degrees (-180 to 180)
      // Gamma is the left-to-right tilt in degrees (-90 to 90)
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      const tiltX = Math.max(-maxTilt, Math.min(maxTilt, (beta / 90) * maxTilt));
      const tiltY = Math.max(-maxTilt, Math.min(maxTilt, (gamma / 90) * maxTilt));

      setTiltState((prev) => ({
        ...prev,
        tiltX: reverse ? -tiltX : tiltX,
        tiltY: reverse ? -tiltY : tiltY,
      }));

      onTilt?.(tiltX, tiltY);
    },
    [gyroscope, maxTilt, reverse, onTilt, prefersReducedMotion]
  );

  /**
   * Set up event listeners
   */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove as EventListener);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Add device orientation listener if gyroscope is enabled
    if (gyroscope && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
    }

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);

      if (gyroscope) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleDeviceOrientation, gyroscope]);

  /**
   * Get transform style
   */
  const getTransformStyle = useCallback((): CSSProperties => {
    if (prefersReducedMotion) {
      return {
        transform: 'none',
      };
    }

    const scaleValue = isHovering ? scale : 1;

    return {
      transform: `perspective(${perspective}px) rotateX(${tiltState.tiltX}deg) rotateY(${tiltState.tiltY}deg) scale3d(${scaleValue}, ${scaleValue}, ${scaleValue})`,
      transition: `transform ${speed}ms ${easing}`,
      transformStyle: 'preserve-3d' as const,
    };
  }, [tiltState, isHovering, perspective, scale, speed, easing, prefersReducedMotion]);

  /**
   * Get glare style
   */
  const getGlareStyle = useCallback((): CSSProperties => {
    if (!glare || prefersReducedMotion) {
      return { display: 'none' };
    }

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle at ${tiltState.glarePosition.x}% ${tiltState.glarePosition.y}%, rgba(255, 255, 255, ${tiltState.glareOpacity}), transparent 50%)`,
      pointerEvents: 'none',
      transition: `opacity ${speed}ms ${easing}`,
      borderRadius: 'inherit',
    };
  }, [glare, tiltState, speed, easing, prefersReducedMotion]);

  /**
   * Reset tilt
   */
  const reset = useCallback(() => {
    setTiltState({
      tiltX: 0,
      tiltY: 0,
      glareOpacity: 0,
      glarePosition: { x: 50, y: 50 },
    });
    setIsHovering(false);
    onTilt?.(0, 0);
  }, [onTilt]);

  /**
   * Set manual tilt
   */
  const setTilt = useCallback((tiltX: number, tiltY: number) => {
    setTiltState((prev) => ({
      ...prev,
      tiltX: Math.max(-maxTilt, Math.min(maxTilt, tiltX)),
      tiltY: Math.max(-maxTilt, Math.min(maxTilt, tiltY)),
    }));
    onTilt?.(tiltX, tiltY);
  }, [maxTilt, onTilt]);

  return {
    ref: containerRef,
    tiltX: tiltState.tiltX,
    tiltY: tiltState.tiltY,
    isHovering,
    transformStyle: getTransformStyle(),
    glareStyle: getGlareStyle(),
    reset,
    setTilt,
  };
};