'use client';
/**
 * 3D Transform Hook
 * Provides advanced 3D CSS transform capabilities with perspective and rotation
 */

import { useCallback, useState, useRef, CSSProperties } from 'react';
import { Vector2D } from '../../types/common';

/**
 * 3D Transform state
 */
export interface Transform3DState {
  rotateX: number; // Rotation around X axis (degrees)
  rotateY: number; // Rotation around Y axis (degrees)
  rotateZ: number; // Rotation around Z axis (degrees)
  translateX: number; // Translation on X axis (px)
  translateY: number; // Translation on Y axis (px)
  translateZ: number; // Translation on Z axis (px)
  scale: number; // Uniform scale
  scaleX: number; // Scale on X axis
  scaleY: number; // Scale on Y axis
  scaleZ: number; // Scale on Z axis
  perspective: number; // Perspective (px)
}

/**
 * 3D Transform options
 */
export interface Use3DTransformOptions {
  initialTransform?: Partial<Transform3DState>;
  perspective?: number;
  transformOrigin?: string;
  backfaceVisibility?: 'visible' | 'hidden';
  transformStyle?: 'flat' | 'preserve-3d';
}

/**
 * Hook for 3D transforms
 */
export const use3DTransform = (options: Use3DTransformOptions = {}) => {
  const {
    initialTransform = {},
    perspective = 1000,
    transformOrigin = 'center center',
    backfaceVisibility = 'visible',
    transformStyle = 'preserve-3d',
  } = options;

  const defaultTransform: Transform3DState = {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    perspective: perspective,
    ...initialTransform,
  };

  const [transform, setTransform] = useState<Transform3DState>(defaultTransform);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Generate CSS transform string
   */
  const getTransformString = useCallback((state: Transform3DState = transform): string => {
    return [
      `perspective(${state.perspective}px)`,
      `rotateX(${state.rotateX}deg)`,
      `rotateY(${state.rotateY}deg)`,
      `rotateZ(${state.rotateZ}deg)`,
      `translateX(${state.translateX}px)`,
      `translateY(${state.translateY}px)`,
      `translateZ(${state.translateZ}px)`,
      `scale3d(${state.scaleX}, ${state.scaleY}, ${state.scaleZ})`,
    ].join(' ');
  }, [transform]);

  /**
   * Get CSS style object
   */
  const getStyle = useCallback((): CSSProperties => {
    return {
      transform: getTransformString(),
      transformOrigin,
      backfaceVisibility,
      transformStyle,
    };
  }, [getTransformString, transformOrigin, backfaceVisibility, transformStyle]);

  /**
   * Update transform
   */
  const updateTransform = useCallback((updates: Partial<Transform3DState>) => {
    setTransform((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set rotation
   */
  const setRotation = useCallback((x: number, y: number, z: number = 0) => {
    updateTransform({ rotateX: x, rotateY: y, rotateZ: z });
  }, [updateTransform]);

  /**
   * Set translation
   */
  const setTranslation = useCallback((x: number, y: number, z: number = 0) => {
    updateTransform({ translateX: x, translateY: y, translateZ: z });
  }, [updateTransform]);

  /**
   * Set scale
   */
  const setScale = useCallback((scale: number | { x: number; y: number; z?: number }) => {
    if (typeof scale === 'number') {
      updateTransform({ scale, scaleX: scale, scaleY: scale, scaleZ: scale });
    } else {
      updateTransform({
        scaleX: scale.x,
        scaleY: scale.y,
        scaleZ: scale.z ?? 1,
      });
    }
  }, [updateTransform]);

  /**
   * Rotate from mouse/touch position
   */
  const rotateFromPointer = useCallback(
    (
      x: number,
      y: number,
      containerWidth: number,
      containerHeight: number,
      maxRotation: number = 20
    ) => {
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;

      const rotateY = ((x - centerX) / centerX) * maxRotation;
      const rotateX = -((y - centerY) / centerY) * maxRotation;

      setRotation(rotateX, rotateY, transform.rotateZ);
    },
    [setRotation, transform.rotateZ]
  );

  /**
   * Animated rotation
   */
  const animateRotation = useCallback(
    (
      targetX: number,
      targetY: number,
      targetZ: number = 0,
      duration: number = 300
    ) => {
      const startTime = Date.now();
      const startX = transform.rotateX;
      const startY = transform.rotateY;
      const startZ = transform.rotateZ;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentX = startX + (targetX - startX) * eased;
        const currentY = startY + (targetY - startY) * eased;
        const currentZ = startZ + (targetZ - startZ) * eased;

        setRotation(currentX, currentY, currentZ);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [transform, setRotation]
  );

  /**
   * Reset transform
   */
  const reset = useCallback((animated: boolean = true) => {
    if (animated) {
      animateRotation(0, 0, 0);
      // Animate other properties too
      const startTime = Date.now();
      const duration = 300;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        updateTransform({
          translateX: transform.translateX * (1 - eased),
          translateY: transform.translateY * (1 - eased),
          translateZ: transform.translateZ * (1 - eased),
          scale: transform.scale + (1 - transform.scale) * eased,
          scaleX: transform.scaleX + (1 - transform.scaleX) * eased,
          scaleY: transform.scaleY + (1 - transform.scaleY) * eased,
          scaleZ: transform.scaleZ + (1 - transform.scaleZ) * eased,
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      setTransform(defaultTransform);
    }
  }, [animateRotation, updateTransform, transform, defaultTransform]);

  /**
   * Apply card flip effect
   */
  const flip = useCallback((duration: number = 600) => {
    const targetY = transform.rotateY >= 180 ? 0 : 180;
    animateRotation(transform.rotateX, targetY, transform.rotateZ, duration);
  }, [transform, animateRotation]);

  /**
   * Apply wobble effect
   */
  const wobble = useCallback((intensity: number = 10, duration: number = 500) => {
    const steps = 4;
    const stepDuration = duration / steps;

    const wobbleSequence = [
      { x: intensity, y: -intensity },
      { x: -intensity, y: intensity },
      { x: intensity, y: -intensity },
      { x: 0, y: 0 },
    ];

    let currentStep = 0;

    const performStep = () => {
      if (currentStep < wobbleSequence.length) {
        const { x, y } = wobbleSequence[currentStep];
        animateRotation(x, y, 0, stepDuration);
        currentStep++;
        setTimeout(performStep, stepDuration);
      }
    };

    performStep();
  }, [animateRotation]);

  /**
   * Cleanup animation frame on unmount
   */
  useCallback(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    transform,
    style: getStyle(),
    setRotation,
    setTranslation,
    setScale,
    updateTransform,
    rotateFromPointer,
    animateRotation,
    reset,
    flip,
    wobble,
    getTransformString,
  };
};