import React from 'react';
import { useRef, useCallback, useState, useEffect } from 'react';

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
  velocity?: number;
}

export interface SpringValue {
  current: number;
  target: number;
  velocity: number;
  isAnimating: boolean;
}

export interface MultiSpringState {
  [key: string]: SpringValue;
}

export interface MultiSpringOptions {
  config?: SpringConfig;
  immediate?: boolean;
  onRest?: (key: string) => void;
  onFrame?: (values: Record<string, number>) => void;
}

const DEFAULT_CONFIG: SpringConfig = {
  stiffness: 170,
  damping: 26,
  mass: 1,
  precision: 0.01,
  velocity: 0,
};

export function useMultiSpring(
  initialValues: Record<string, number>,
  options: MultiSpringOptions = {}
) {
  const {
    config = DEFAULT_CONFIG,
    immediate = false,
    onRest,
    onFrame,
  } = options;

  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const springStateRef = useRef<MultiSpringState>({});
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Initialize spring state
  useEffect(() => {
    Object.keys(initialValues).forEach((key: any) => {
      if (!springStateRef.current[key]) {
        springStateRef.current[key] = {
          current: initialValues[key],
          target: initialValues[key],
          velocity: config.velocity || 0,
          isAnimating: false,
        };
      }
    });
  }, [initialValues, config.velocity]);

  // Physics simulation
  const simulate = useCallback((deltaTime: number) => {
    let hasAnimatingValues = false;
    const newValues: Record<string, number> = {};

    Object.keys(springStateRef.current).forEach((key: any) => {
      const spring = springStateRef.current[key];
      
      if (!spring.isAnimating) {
        newValues[key] = spring.current;
        return;
      }

      // Spring physics calculation
      const displacement = spring.target - spring.current;
      const springForce = displacement * config.stiffness;
      const dampingForce = spring.velocity * config.damping;
      const acceleration = (springForce - dampingForce) / config.mass;

      // Update velocity and position
      spring.velocity += acceleration * deltaTime;
      spring.current += spring.velocity * deltaTime;

      // Check if animation should stop
      const isAtRest = 
        Math.abs(displacement) < (config.precision || 0.01) &&
        Math.abs(spring.velocity) < (config.precision || 0.01);

      if (isAtRest) {
        spring.current = spring.target;
        spring.velocity = 0;
        spring.isAnimating = false;
        onRest?.(key);
      } else {
        hasAnimatingValues = true;
      }

      newValues[key] = spring.current;
    });

    setValues(newValues);
    onFrame?.(newValues);

    return hasAnimatingValues;
  }, [config, onRest, onFrame]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.016); // Cap at 60fps
    lastTimeRef.current = timestamp;

    const hasAnimatingValues = simulate(deltaTime);

    if (hasAnimatingValues) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = undefined;
      lastTimeRef.current = 0;
    }
  }, [simulate]);

  // Start animation to new targets
  const start = useCallback((targets: Record<string, number>) => {
    Object.keys(targets).forEach((key: any) => {
      const targetValue = targets[key];
      
      if (!springStateRef.current[key]) {
        springStateRef.current[key] = {
          current: targetValue,
          target: targetValue,
          velocity: 0,
          isAnimating: false,
        };
      }

      const spring = springStateRef.current[key];
      
      if (immediate) {
        spring.current = targetValue;
        spring.target = targetValue;
        spring.velocity = 0;
        spring.isAnimating = false;
      } else {
        spring.target = targetValue;
        spring.isAnimating = true;
      }
    });

    // Update current values immediately if immediate mode
    if (immediate) {
      setValues(targets);
      onFrame?.(targets);
    } else {
      // Start animation if not already running
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
  }, [immediate, animate, onFrame]);

  // Stop all animations
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    Object.keys(springStateRef.current).forEach((key: any) => {
      const spring = springStateRef.current[key];
      spring.target = spring.current;
      spring.velocity = 0;
      spring.isAnimating = false;
    });

    lastTimeRef.current = 0;
  }, []);

  // Set immediate value without animation
  const set = useCallback((newValues: Record<string, number>) => {
    Object.keys(newValues).forEach((key: any) => {
      if (!springStateRef.current[key]) {
        springStateRef.current[key] = {
          current: newValues[key],
          target: newValues[key],
          velocity: 0,
          isAnimating: false,
        };
      } else {
        const spring = springStateRef.current[key];
        spring.current = newValues[key];
        spring.target = newValues[key];
        spring.velocity = 0;
        spring.isAnimating = false;
      }
    });

    setValues((prev: any) => ({ ...prev, ...newValues }));
    onFrame?.({ ...values, ...newValues });
  }, [values, onFrame]);

  // Get current velocity for a key
  const getVelocity = useCallback((key: string): number => {
    return springStateRef.current[key]?.velocity || 0;
  }, []);

  // Check if any values are animating
  const isAnimating = useCallback((): boolean => {
    return Object.values(springStateRef.current).some(spring => spring.isAnimating);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    values,
    start,
    stop,
    set,
    getVelocity,
    isAnimating,
    config,
  };
}

// Preset spring configurations
export const springPresets = {
  default: { stiffness: 170, damping: 26, mass: 1 },
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 210, damping: 20, mass: 1 },
  slow: { stiffness: 280, damping: 60, mass: 1 },
  bouncy: { stiffness: 170, damping: 8, mass: 1 },
};

// Utility hook for single value spring
export function useSpring(
  initialValue: number,
  config: SpringConfig = DEFAULT_CONFIG
) {
  const multiSpring = useMultiSpring({ value: initialValue }, { config });

  const setValue = useCallback((target: number) => {
    multiSpring.start({ value: target });
  }, [multiSpring]);

  return {
    value: multiSpring.values.value,
    setValue,
    isAnimating: multiSpring.isAnimating,
    config: multiSpring.config,
  };
}
