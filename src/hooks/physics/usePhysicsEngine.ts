'use client';
/**
 * Physics Engine Hook
 * React hook for managing physics engine instance and body interactions
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AuraPhysicsEngineAPI,
  PhysicsBodyState,
  PhysicsBodyOptions,
  CollisionEvent,
} from '../../physics/AuraPhysicsEngine';
import { Vector2D } from '../../types/common';

/**
 * Physics engine hook options
 */
export interface UsePhysicsEngineOptions {
  autoStart?: boolean;
  gravity?: Vector2D;
  timeScale?: number;
}

/**
 * Hook for managing a physics engine instance
 */
export const usePhysicsEngine = (options: UsePhysicsEngineOptions = {}) => {
  const { autoStart = false, gravity, timeScale = 1.0 } = options;

  const engineRef = useRef<AuraPhysicsEngineAPI | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [bodyStates, setBodyStates] = useState<Map<string, PhysicsBodyState>>(new Map());

  /**
   * Initialize engine
   */
  useEffect(() => {
    engineRef.current = new AuraPhysicsEngineAPI();

    if (gravity) {
      engineRef.current.setGravity(gravity);
    }

    engineRef.current.setTimeScale(timeScale);

    if (autoStart) {
      engineRef.current.start();
      setIsRunning(true);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current.clear();
      }
    };
  }, []);

  /**
   * Update gravity
   */
  useEffect(() => {
    if (engineRef.current && gravity) {
      engineRef.current.setGravity(gravity);
    }
  }, [gravity]);

  /**
   * Update time scale
   */
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTimeScale(timeScale);
    }
  }, [timeScale]);

  /**
   * Create a physics body
   */
  const createBody = useCallback(
    (id: string, options?: PhysicsBodyOptions): string => {
      if (!engineRef.current) {
        throw new Error('Physics engine not initialized');
      }
      return engineRef.current.createBody(id, options);
    },
    []
  );

  /**
   * Remove a physics body
   */
  const removeBody = useCallback((id: string): void => {
    engineRef.current?.removeBody(id);
    setBodyStates((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Apply force to a body
   */
  const applyForce = useCallback((id: string, force: Vector2D): void => {
    engineRef.current?.applyForce(id, force);
  }, []);

  /**
   * Apply impulse to a body
   */
  const applyImpulse = useCallback((id: string, impulse: Vector2D): void => {
    engineRef.current?.applyImpulse(id, impulse);
  }, []);

  /**
   * Set velocity of a body
   */
  const setVelocity = useCallback((id: string, velocity: Vector2D): void => {
    engineRef.current?.setVelocity(id, velocity);
  }, []);

  /**
   * Set position of a body
   */
  const setPosition = useCallback((id: string, position: Vector2D): void => {
    engineRef.current?.setPosition(id, position);
  }, []);

  /**
   * Get body state
   */
  const getBodyState = useCallback((id: string): PhysicsBodyState | null => {
    return engineRef.current?.getBodyState(id) || null;
  }, []);

  /**
   * Subscribe to collision events
   */
  const onCollision = useCallback(
    (id: string, callback: (event: CollisionEvent) => void): (() => void) => {
      if (!engineRef.current) {
        return () => {};
      }
      return engineRef.current.onCollision(id, callback);
    },
    []
  );

  /**
   * Start the physics engine
   */
  const start = useCallback(() => {
    engineRef.current?.start();
    setIsRunning(true);
  }, []);

  /**
   * Stop the physics engine
   */
  const stop = useCallback(() => {
    engineRef.current?.stop();
    setIsRunning(false);
  }, []);

  /**
   * Force update
   */
  const forceUpdate = useCallback(() => {
    engineRef.current?.forceUpdate();
  }, []);

  /**
   * Set gravity
   */
  const setGravity = useCallback((newGravity: Vector2D): void => {
    engineRef.current?.setGravity(newGravity);
  }, []);

  /**
   * Set time scale
   */
  const setTimeScale = useCallback((scale: number): void => {
    engineRef.current?.setTimeScale(scale);
  }, []);

  /**
   * Get all body IDs
   */
  const getBodies = useCallback((): string[] => {
    return engineRef.current?.getBodies() || [];
  }, []);

  /**
   * Clear all bodies
   */
  const clear = useCallback(() => {
    engineRef.current?.clear();
    setBodyStates(new Map());
  }, []);

  /**
   * Update body states periodically
   */
  useEffect(() => {
    if (!isRunning || !engineRef.current) return;

    const interval = setInterval(() => {
      if (engineRef.current) {
        const bodies = engineRef.current.getBodies();
        const states = new Map<string, PhysicsBodyState>();

        bodies.forEach((bodyId) => {
          const state = engineRef.current?.getBodyState(bodyId);
          if (state) {
            states.set(bodyId, state);
          }
        });

        setBodyStates(states);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    // Engine control
    start,
    stop,
    forceUpdate,
    isRunning,

    // Body management
    createBody,
    removeBody,
    getBodies,
    clear,

    // Body manipulation
    applyForce,
    applyImpulse,
    setVelocity,
    setPosition,
    getBodyState,

    // Configuration
    setGravity,
    setTimeScale,

    // Events
    onCollision,

    // State
    bodyStates,
    engine: engineRef.current,
  };
};