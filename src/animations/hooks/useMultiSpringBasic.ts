import React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  precision?: number;
  velocity?: number;
}

export interface SpringTarget {
  [key: string]: number;
}

export interface SpringState {
  [key: string]: {
    position: number;
    velocity: number;
    isAnimating: boolean;
  };
}

export interface MultiSpringOptions {
  config?: SpringConfig;
  onUpdate?: (values: Record<string, number>) => void;
  onComplete?: (values: Record<string, number>) => void;
}

const DEFAULT_CONFIG: Required<SpringConfig> = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  precision: 0.01,
  velocity: 0,
};

export function useMultiSpring(
  initialValues: SpringTarget = {},
  options: MultiSpringOptions = {}
) {
  const { config: userConfig = {}, onUpdate, onComplete } = options;
  const config: Required<SpringConfig> = { ...DEFAULT_CONFIG, ...userConfig };

  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationRef = useRef<number | undefined>(undefined);
  const stateRef = useRef<SpringState>({});
  const targetsRef = useRef<SpringTarget>({});
  const lastTimeRef = useRef<number>(0);

  // Initialize state for each key
  useEffect(() => {
    const newState: SpringState = {};
    Object.keys(initialValues).forEach((key: any) => {
      newState[key] = {
        position: initialValues[key],
        velocity: config.velocity,
        isAnimating: false,
      };
    });
    stateRef.current = newState;
    targetsRef.current = { ...initialValues };
  }, [initialValues, config.velocity]);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    let hasActiveAnimations = false;
    const newValues: Record<string, number> = {};

    // Update each spring
    Object.keys(stateRef.current).forEach((key: any) => {
      const spring = stateRef.current[key];
      const target = targetsRef.current[key];

      if (target === undefined) return;

      // Calculate spring forces
      const displacement = target - spring.position;
      const springForce = displacement * config.stiffness;
      const dampingForce = -spring.velocity * config.damping;

      // Update acceleration (F = ma)
      const acceleration = (springForce + dampingForce) / config.mass;

      // Update velocity (v = v + a * dt)
      spring.velocity += acceleration * deltaTime;

      // Update position (p = p + v * dt)
      spring.position += spring.velocity * deltaTime;

      // Check if animation is complete
      const isAtRest = Math.abs(spring.velocity) < config.precision &&
                      Math.abs(displacement) < config.precision;

      if (isAtRest) {
        spring.position = target;
        spring.velocity = 0;
        spring.isAnimating = false;
      } else {
        spring.isAnimating = true;
        hasActiveAnimations = true;
      }

      newValues[key] = spring.position;
    });

    // Update values
    setValues(newValues);
    onUpdate?.(newValues);

    // Check if all animations are complete
    if (!hasActiveAnimations) {
      setIsAnimating(false);
      onComplete?.(newValues);
      animationRef.current = undefined;
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [config, onUpdate, onComplete]);

  const start = useCallback((targets: SpringTarget) => {
    // Update targets
    targetsRef.current = { ...targetsRef.current, ...targets };

    // Start animations for changed targets
    Object.keys(targets).forEach((key: any) => {
      if (stateRef.current[key]) {
        stateRef.current[key].isAnimating = true;
      }
    });

    setIsAnimating(true);

    if (!animationRef.current) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const set = useCallback((values: SpringTarget) => {
    // Immediately set values without animation
    const newValues = { ...values };
    const newState: SpringState = {};

    Object.keys(values).forEach((key: any) => {
      newState[key] = {
        position: values[key],
        velocity: 0,
        isAnimating: false,
      };
    });

    stateRef.current = { ...stateRef.current, ...newState };
    targetsRef.current = { ...targetsRef.current, ...values };
    setValues((prev: any) => ({ ...prev, ...newValues }));
  }, []);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    // Stop all animations
    Object.keys(stateRef.current).forEach((key: any) => {
      stateRef.current[key].isAnimating = false;
    });

    setIsAnimating(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setValues(initialValues);
    targetsRef.current = { ...initialValues };

    const resetState: SpringState = {};
    Object.keys(initialValues).forEach((key: any) => {
      resetState[key] = {
        position: initialValues[key],
        velocity: 0,
        isAnimating: false,
      };
    });
    stateRef.current = resetState;
  }, [stop, initialValues]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    values,
    isAnimating,
    start,
    set,
    stop,
    reset,
    config,
  };
}

// Hook for spring-based transforms
export function useSpringTransform(
  initialTransform: {
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    opacity?: number;
  } = {},
  options: MultiSpringOptions = {}
) {
  const springValues = {
    x: initialTransform.x || 0,
    y: initialTransform.y || 0,
    scale: initialTransform.scale || 1,
    rotation: initialTransform.rotation || 0,
    opacity: initialTransform.opacity || 1,
  };

  const spring = useMultiSpring(springValues, {
    ...options,
    onUpdate: (values) => {
      options.onUpdate?.(values);
    },
  });

  const transform = `translate(${spring.values.x}px, ${spring.values.y}px) scale(${spring.values.scale}) rotate(${spring.values.rotation}deg)`;
  const style = {
    transform,
    opacity: spring.values.opacity,
  };

  return {
    ...spring,
    transform,
    style,
  };
}

// Hook for spring-based color transitions
export function useSpringColor(
  initialColor: string = 'var(--glass-black)',
  options: MultiSpringOptions = {}
) {
  // Parse initial color
  const parseColor = (color: string) => {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computed = getComputedStyle(div).color;
    document.body.removeChild(div);

    const match = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
    return { r: 0, g: 0, b: 0 };
  };

  const initialColorValues = parseColor(initialColor);
  const spring = useMultiSpring(initialColorValues, options);

  const color = `rgb(${Math.round(spring.values.r)}, ${Math.round(spring.values.g)}, ${Math.round(spring.values.b)})`;

  return {
    ...spring,
    color,
  };
}

// Hook for spring-based array animations
export function useSpringArray(
  initialArray: number[] = [],
  options: MultiSpringOptions = {}
) {
  const springValues: SpringTarget = {};
  initialArray.forEach((value, index) => {
    springValues[`item-${index}`] = value;
  });

  const spring = useMultiSpring(springValues, options);

  const array = Object.keys(spring.values)
    .sort()
    .map((key: any) => spring.values[key]);

  return {
    ...spring,
    array,
  };
}

// Utility functions for common spring patterns
export const createSpringPreset = (preset: 'gentle' | 'wobbly' | 'stiff' | 'slow' | 'bouncy'): SpringConfig => {
  const presets = {
    gentle: { stiffness: 120, damping: 14, mass: 1 },
    wobbly: { stiffness: 180, damping: 12, mass: 1 },
    stiff: { stiffness: 210, damping: 20, mass: 1 },
    slow: { stiffness: 280, damping: 60, mass: 1 },
    bouncy: { stiffness: 170, damping: 8, mass: 1 },
  };

  return presets[preset];
};

export const createSpringSequence = (
  targets: SpringTarget[],
  config: SpringConfig = {}
): SpringTarget[] => {
  // Create a sequence of spring targets
  return targets;
};

export const interpolateSprings = (
  springs: MultiSpringOptions[],
  progress: number
): SpringConfig => {
  if (springs.length === 0) return DEFAULT_CONFIG;
  if (springs.length === 1) return springs[0].config || DEFAULT_CONFIG;

  const index = Math.floor(progress * (springs.length - 1));
  const localProgress = (progress * (springs.length - 1)) % 1;

  const current: Required<SpringConfig> = { ...DEFAULT_CONFIG, ...(springs[index]?.config || {}) };
  const next: Required<SpringConfig> = { ...DEFAULT_CONFIG, ...(springs[index + 1]?.config || {}) };

  return {
    stiffness: current.stiffness + (next.stiffness - current.stiffness) * localProgress,
    damping: current.damping + (next.damping - current.damping) * localProgress,
    mass: current.mass + (next.mass - current.mass) * localProgress,
    precision: current.precision + (next.precision - current.precision) * localProgress,
    velocity: current.velocity + (next.velocity - current.velocity) * localProgress,
  };
};
