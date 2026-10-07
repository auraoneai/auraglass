import React from "react";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { ChartDataPoint, ChartSeries, ChartPhysicsConfig } from "../types";

interface PhysicsState {
  position: number;
  velocity: number;
  acceleration: number;
  target: number;
  isAnimating: boolean;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision: number;
}

interface AnimationFrame {
  id: number;
  timestamp: number;
  deltaTime: number;
}

export function usePhysicsAnimation(
  config: ChartPhysicsConfig = {},
  enabled: boolean = true
) {
  const {
    stiffness = 100,
    damping = 10,
    mass = 1,
    velocity = 0,
    friction = 0.98,
  } = config;

  const animationRef = useRef<number>();
  const physicsStateRef = useRef<Map<string, PhysicsState>>(new Map());
  const lastFrameRef = useRef<AnimationFrame | null>(null);
  const callbacksRef = useRef<Map<string, (value: number) => void>>(new Map());

  // Spring configuration
  const springConfig = useMemo(
    (): SpringConfig => ({
      stiffness,
      damping,
      mass,
      precision: 0.01,
    }),
    [stiffness, damping, mass]
  );

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = { id: 0, timestamp, deltaTime: 0 };
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastFrameRef.current.timestamp) / 1000; // Convert to seconds
      lastFrameRef.current = {
        id: lastFrameRef.current.id + 1,
        timestamp,
        deltaTime,
      };

      let hasActiveAnimations = false;

      // Update all physics states
      physicsStateRef.current.forEach((state, key) => {
        if (!state.isAnimating) return;

        // Calculate spring force
        const displacement = state.target - state.position;
        const springForce = displacement * springConfig.stiffness;
        const dampingForce = -state.velocity * springConfig.damping;

        // Update acceleration (F = ma)
        state.acceleration = (springForce + dampingForce) / springConfig.mass;

        // Update velocity (v = v + a * dt)
        state.velocity += state.acceleration * deltaTime;

        // Apply friction
        state.velocity *= friction;

        // Update position (p = p + v * dt)
        state.position += state.velocity * deltaTime;

        // Check if animation is complete
        const isAtRest =
          Math.abs(state.velocity) < springConfig.precision &&
          Math.abs(displacement) < springConfig.precision;

        if (isAtRest) {
          state.position = state.target;
          state.velocity = 0;
          state.acceleration = 0;
          state.isAnimating = false;
        } else {
          hasActiveAnimations = true;
        }

        // Call update callback
        const callback = callbacksRef.current.get(key);
        if (callback) {
          callback(state.position);
        }
      });

      if (hasActiveAnimations && enabled) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = undefined;
      }
    },
    [springConfig, friction, enabled]
  );

  // Start animation for a specific key
  const startAnimation = useCallback(
    (
      key: string,
      from: number,
      to: number,
      callback?: (value: number) => void
    ) => {
      if (!enabled) {
        callback?.(to);
        return;
      }

      const existingState = physicsStateRef.current.get(key);

      physicsStateRef.current.set(key, {
        position: existingState?.position ?? from,
        velocity: existingState?.velocity ?? velocity,
        acceleration: 0,
        target: to,
        isAnimating: true,
      });

      if (callback) {
        callbacksRef.current.set(key, callback);
      }

      // Start animation loop if not already running
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [enabled, velocity, animate]
  );

  // Stop animation for a specific key
  const stopAnimation = useCallback((key: string) => {
    const state = physicsStateRef.current.get(key);
    if (state) {
      state.isAnimating = false;
      state.velocity = 0;
      state.acceleration = 0;
    }
  }, []);

  // Update target value for a specific key
  const updateTarget = useCallback(
    (key: string, target: number) => {
      const state = physicsStateRef.current.get(key);
      if (state) {
        state.target = target;
        state.isAnimating = true;

        // Restart animation if not running
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    },
    [animate]
  );

  // Get current value for a specific key
  const getCurrentValue = useCallback((key: string): number => {
    const state = physicsStateRef.current.get(key);
    return state?.position ?? 0;
  }, []);

  // Check if animation is active for a specific key
  const isAnimating = useCallback((key: string): boolean => {
    const state = physicsStateRef.current.get(key);
    return state?.isAnimating ?? false;
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    startAnimation,
    stopAnimation,
    updateTarget,
    getCurrentValue,
    isAnimating,
    springConfig,
    // Additional properties for compatibility with expected interface
    value: 0, // This would need to be implemented based on the specific use case
    applyPopIn: () => {
      // Pop-in animation implementation
      startAnimation("popIn", 0, 1);
    },
  };
}

// Hook for animating chart data points
export function useDataPointAnimation(
  dataPoints: ChartDataPoint[],
  physicsConfig?: ChartPhysicsConfig
) {
  const physics = usePhysicsAnimation(physicsConfig);

  const animateDataPoints = useCallback(
    (
      targetPoints: ChartDataPoint[],
      duration: number = 1000,
      onUpdate?: (points: ChartDataPoint[]) => void
    ) => {
      if (!(targetPoints?.length || 0)) return;

      const animatedPoints = [...targetPoints];

      targetPoints.forEach((point, index) => {
        const key = `point-${index}`;
        const targetY = typeof point.y === "number" ? point.y : 0;

        physics.startAnimation(
          key,
          0, // Start from 0
          targetY,
          (value) => {
            if (animatedPoints) {
              animatedPoints[index] = { ...point, y: value };
            }
            onUpdate?.(animatedPoints);
          }
        );
      });
    },
    [physics]
  );

  return {
    animateDataPoints,
    ...physics,
  };
}

// Hook for animating chart series
export function useSeriesAnimation(
  series: ChartSeries[],
  physicsConfig?: ChartPhysicsConfig
) {
  const physics = usePhysicsAnimation(physicsConfig);

  const animateSeries = useCallback(
    (
      targetSeries: ChartSeries[],
      staggerDelay: number = 100,
      onUpdate?: (series: ChartSeries[]) => void
    ) => {
      if (!(targetSeries?.length || 0)) return;

      const animatedSeries = [...targetSeries];

      targetSeries.forEach((seriesItem, seriesIndex) => {
        const delay = seriesIndex * staggerDelay;

        seriesItem.data?.forEach((point, pointIndex) => {
          const key = `series-${seriesIndex}-point-${pointIndex}`;
          const targetY = typeof point.y === "number" ? point.y : 0;

          setTimeout(() => {
            physics.startAnimation(key, 0, targetY, (value) => {
              if (animatedSeries[seriesIndex].data) {
                animatedSeries[seriesIndex].data[pointIndex] = {
                  ...point,
                  y: value,
                };
              }
              onUpdate?.(animatedSeries);
            });
          }, delay);
        });
      });
    },
    [physics]
  );

  return {
    animateSeries,
    ...physics,
  };
}

// Hook for smooth transitions between chart states
export function useChartTransition(physicsConfig?: ChartPhysicsConfig) {
  const physics = usePhysicsAnimation(physicsConfig);

  const transitionTo = useCallback(
    (
      fromState: any,
      toState: any,
      onTransition?: (currentState: any) => void
    ) => {
      const keys = Object.keys(toState);

      keys.forEach((key) => {
        const fromValue = fromState?.[key] || 0;
        const toValue = toState?.[key] || 0;

        physics.startAnimation(
          `transition-${key}`,
          fromValue,
          toValue,
          (value) => {
            const currentState = { ...fromState };
            keys.forEach((k) => {
              if (currentState) {
                currentState[k] = physics.getCurrentValue(`transition-${k}`);
              }
            });
            onTransition?.(currentState);
          }
        );
      });
    },
    [physics]
  );

  return {
    transitionTo,
    ...physics,
  };
}
