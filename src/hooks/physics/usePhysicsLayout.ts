/**
 * Physics Layout Hook
 * Provides physics-based layout positioning and arrangement
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePhysicsEngine } from './usePhysicsEngine';
import { Vector2D, createVector2D } from '../../types/common';
import { PhysicsBodyOptions } from '../../physics/AuraPhysicsEngine';

/**
 * Layout element configuration
 */
export interface LayoutElement {
  id: string;
  width: number;
  height: number;
  initialPosition?: Vector2D;
  mass?: number;
  fixed?: boolean; // Fixed elements don't move
}

/**
 * Layout configuration
 */
export interface PhysicsLayoutConfig {
  elements: LayoutElement[];
  containerWidth: number;
  containerHeight: number;
  padding?: number;
  spacing?: number;
  attraction?: number; // Force attracting elements to their target positions
  repulsion?: number; // Force repelling overlapping elements
  damping?: number;
  mode?: 'grid' | 'flow' | 'force' | 'magnetic' | 'cluster';
}

/**
 * Layout result
 */
export interface LayoutResult {
  positions: Map<string, Vector2D>;
  isStable: boolean;
  iterations: number;
}

/**
 * Hook for physics-based layout
 */
export const usePhysicsLayout = (config: PhysicsLayoutConfig) => {
  const {
    elements = [],
    containerWidth,
    containerHeight,
    padding = 20,
    spacing = 10,
    attraction = 0.1,
    repulsion = 100,
    damping = 0.3,
    mode = 'force',
  } = config;

  const {
    createBody,
    removeBody,
    applyForce,
    getBodyState,
    start,
    stop,
    isRunning,
    bodyStates,
  } = usePhysicsEngine({
    autoStart: false,
    gravity: createVector2D(0, 0), // No gravity for layouts
    timeScale: 1.0,
  });

  const [positions, setPositions] = useState<Map<string, Vector2D>>(new Map());
  const [isStable, setIsStable] = useState(false);
  const iterationsRef = useRef(0);
  const targetPositionsRef = useRef<Map<string, Vector2D>>(new Map());

  /**
   * Calculate target positions based on layout mode
   */
  const calculateTargetPositions = useCallback(() => {
    const targets = new Map<string, Vector2D>();

    switch (mode) {
      case 'grid': {
        // Calculate grid layout
        const cols = Math.floor(containerWidth / (100 + spacing));
        elements.forEach((element, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          targets.set(
            element.id,
            createVector2D(
              padding + col * (100 + spacing),
              padding + row * (100 + spacing)
            )
          );
        });
        break;
      }

      case 'flow': {
        // Flow layout (like flexbox)
        let x = padding;
        let y = padding;
        let rowHeight = 0;

        elements.forEach((element) => {
          if (x + element.width > containerWidth - padding) {
            x = padding;
            y += rowHeight + spacing;
            rowHeight = 0;
          }

          targets.set(element.id, createVector2D(x, y));
          x += element.width + spacing;
          rowHeight = Math.max(rowHeight, element.height);
        });
        break;
      }

      case 'force':
      case 'magnetic':
      case 'cluster': {
        // For force-based layouts, use center as initial target
        elements.forEach((element) => {
          if (element.initialPosition) {
            targets.set(element.id, element.initialPosition);
          } else {
            targets.set(
              element.id,
              createVector2D(
                containerWidth / 2 + (Math.random() - 0.5) * 100,
                containerHeight / 2 + (Math.random() - 0.5) * 100
              )
            );
          }
        });
        break;
      }
    }

    targetPositionsRef.current = targets;
    return targets;
  }, [mode, elements, containerWidth, containerHeight, padding, spacing]);

  /**
   * Initialize physics bodies
   */
  useEffect(() => {
    // Calculate target positions
    const targets = calculateTargetPositions();

    // Create physics bodies
    elements.forEach((element) => {
      const target = targets.get(element.id) || createVector2D(0, 0);

      const bodyOptions: PhysicsBodyOptions = {
        mass: element.mass || 1,
        damping: damping,
        initialPosition: target,
        initialVelocity: createVector2D(0, 0),
        bounds: {
          min: createVector2D(padding, padding),
          max: createVector2D(
            containerWidth - padding - element.width,
            containerHeight - padding - element.height
          ),
        },
      };

      createBody(element.id, bodyOptions);
    });

    // Start simulation
    start();
    iterationsRef.current = 0;

    return () => {
      elements.forEach((element) => removeBody(element.id));
      stop();
    };
  }, [elements, calculateTargetPositions, createBody, removeBody, start, stop, damping, padding, containerWidth, containerHeight]);

  /**
   * Apply layout forces
   */
  useEffect(() => {
    if (!isRunning) return;

    const applyLayoutForces = () => {
      elements.forEach((element, index) => {
        if (element.fixed) return;

        const state = getBodyState(element.id);
        if (!state) return;

        const target = targetPositionsRef.current.get(element.id);
        if (!target) return;

        // Attraction force to target position
        const attractionForce: Vector2D = {
          x: (target.x - state.position.x) * attraction,
          y: (target.y - state.position.y) * attraction,
        };

        applyForce(element.id, attractionForce);

        // Repulsion force from other elements
        elements.forEach((otherElement, otherIndex) => {
          if (index === otherIndex) return;

          const otherState = getBodyState(otherElement.id);
          if (!otherState) return;

          const dx = state.position.x - otherState.position.x;
          const dy = state.position.y - otherState.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150 && distance > 0) {
            const force = (repulsion / (distance * distance));
            const repulsionForce: Vector2D = {
              x: (dx / distance) * force,
              y: (dy / distance) * force,
            };

            applyForce(element.id, repulsionForce);
          }
        });

        // Magnetic mode: attraction between nearby elements
        if (mode === 'magnetic') {
          elements.forEach((otherElement, otherIndex) => {
            if (index === otherIndex) return;

            const otherState = getBodyState(otherElement.id);
            if (!otherState) return;

            const dx = otherState.position.x - state.position.x;
            const dy = otherState.position.y - state.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 150 && distance < 300 && distance > 0) {
              const force = 0.05;
              const magneticForce: Vector2D = {
                x: (dx / distance) * force,
                y: (dy / distance) * force,
              };

              applyForce(element.id, magneticForce);
            }
          });
        }
      });

      iterationsRef.current += 1;

      // Check stability
      const isLayoutStable = elements.every((element) => {
        const state = getBodyState(element.id);
        if (!state) return false;

        const velocityMag = Math.sqrt(
          state.velocity.x * state.velocity.x + state.velocity.y * state.velocity.y
        );

        return velocityMag < 0.1;
      });

      setIsStable(isLayoutStable);

      if (isLayoutStable) {
        stop();
      }
    };

    const interval = setInterval(applyLayoutForces, 16); // ~60fps

    return () => clearInterval(interval);
  }, [
    isRunning,
    elements,
    getBodyState,
    applyForce,
    attraction,
    repulsion,
    mode,
    stop,
  ]);

  /**
   * Update positions from physics states
   */
  useEffect(() => {
    const newPositions = new Map<string, Vector2D>();

    elements.forEach((element) => {
      const state = bodyStates.get(element.id);
      if (state) {
        newPositions.set(element.id, state.position);
      }
    });

    setPositions(newPositions);
  }, [bodyStates, elements]);

  /**
   * Reset layout
   */
  const reset = useCallback(() => {
    elements.forEach((element) => removeBody(element.id));
    calculateTargetPositions();
    elements.forEach((element) => {
      const target = targetPositionsRef.current.get(element.id) || createVector2D(0, 0);
      createBody(element.id, {
        initialPosition: target,
        mass: element.mass || 1,
        damping: damping,
      });
    });
    iterationsRef.current = 0;
    setIsStable(false);
    start();
  }, [elements, removeBody, createBody, calculateTargetPositions, damping, start]);

  /**
   * Get layout result
   */
  const getLayout = useCallback((): LayoutResult => {
    return {
      positions,
      isStable,
      iterations: iterationsRef.current,
    };
  }, [positions, isStable]);

  return {
    positions,
    isStable,
    iterations: iterationsRef.current,
    reset,
    getLayout,
    start,
    stop,
    isRunning,
  };
};
