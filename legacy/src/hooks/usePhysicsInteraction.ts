'use client';
import React from 'react';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useAccessibleAnimation } from './useAccessibilitySettings';

export interface PhysicsInteractionOptions {
  scale?: number;
  duration?: number;
  easing?: string;
  damping?: number;
  stiffness?: number;
  mass?: number;
  enableHover?: boolean;
  enableClick?: boolean;
  enableDrag?: boolean;
  threshold?: number;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export interface PhysicsState {
  isInteracting: boolean;
  velocity: { x: number; y: number };
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

const DEFAULT_OPTIONS: Required<PhysicsInteractionOptions> = {
  scale: 1.02,
  duration: 200,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  damping: 0.8,
  stiffness: 100,
  mass: 1,
  enableHover: true,
  enableClick: true,
  enableDrag: false,
  threshold: 5,
  onInteractionStart: () => {},
  onInteractionEnd: () => {},
};

/**
 * Enhanced physics interaction hook with spring animations and accessibility
 */
export function usePhysicsInteraction(options: PhysicsInteractionOptions = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    scale,
    duration,
    easing,
    damping,
    stiffness,
    mass,
    enableHover,
    enableClick,
    enableDrag,
    threshold,
    onInteractionStart,
    onInteractionEnd,
  } = mergedOptions;

  const ref = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    isInteracting: false,
    velocity: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
  });

  const { shouldAnimate, transitionDuration } = useAccessibleAnimation();

  // Spring physics calculation
  const calculateSpringForce = useCallback((
    current: number,
    target: number,
    velocity: number
  ): { position: number; velocity: number } => {
    const force = -stiffness * (current - target) - damping * velocity;
    const acceleration = force / mass;
    const newVelocity = velocity + acceleration * 0.016; // 60fps
    const newPosition = current + newVelocity * 0.016;

    return { position: newPosition, velocity: newVelocity };
  }, [stiffness, damping, mass]);

  // Apply transform with physics
  const applyTransform = useCallback((element: HTMLElement, state: Partial<PhysicsState>) => {
    if (!shouldAnimate) return;

    const transforms = [];
    
    if (state.position) {
      transforms.push(`translate3d(${state.position.x}px, ${state.position.y}px, 0)`);
    }
    
    if (state.scale && state.scale !== 1) {
      transforms.push(`scale(${state.scale})`);
    }
    
    if (state.rotation && state.rotation !== 0) {
      transforms.push(`rotate(${state.rotation}deg)`);
    }

    element.style.transform = transforms.length > 0 ? transforms.join(' ') : 'none';
    element.style.transition = shouldAnimate 
      ? `transform ${transitionDuration}ms ${easing}`
      : 'none';
  }, [shouldAnimate, transitionDuration, easing]);

  // Animation loop for spring physics
  const animateSpring = useCallback(() => {
    const element = ref.current;
    if (!element || !physicsState.isInteracting) return;

    setPhysicsState(prevState => {
      const targetX = isDraggingRef.current ? prevState.position.x : 0;
      const targetY = isDraggingRef.current ? prevState.position.y : 0;
      const targetScale = prevState.isInteracting ? scale : 1;

      const newX = calculateSpringForce(prevState.position.x, targetX, prevState.velocity.x);
      const newY = calculateSpringForce(prevState.position.y, targetY, prevState.velocity.y);
      const newScale = calculateSpringForce(prevState.scale, targetScale, 0);

      const newState = {
        ...prevState,
        position: { x: newX.position, y: newY.position },
        velocity: { x: newX.velocity, y: newY.velocity },
        scale: newScale.position,
      };

      applyTransform(element, newState);

      // Check if animation should continue
      const isStable = (
        Math.abs(newX.velocity) < 0.01 &&
        Math.abs(newY.velocity) < 0.01 &&
        Math.abs(newState.scale - targetScale) < 0.001
      );

      if (isStable && !isDraggingRef.current) {
        return { ...newState, isInteracting: false };
      }

      return newState;
    });

    if (physicsState.isInteracting) {
      animationFrameRef.current = requestAnimationFrame(animateSpring);
    }
  }, [physicsState.isInteracting, scale, calculateSpringForce, applyTransform]);

  // Start interaction
  const startInteraction = useCallback(() => {
    setPhysicsState((prev: any) => ({ ...prev, isInteracting: true }));
    onInteractionStart();
    
    if (shouldAnimate && !animationFrameRef.current) {
      animateSpring();
    }
  }, [shouldAnimate, animateSpring, onInteractionStart]);

  // End interaction
  const endInteraction = useCallback(() => {
    isDraggingRef.current = false;
    onInteractionEnd();
    
    // Let spring animation finish naturally
    setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }, duration);
  }, [duration, onInteractionEnd]);

  // Mouse/Touch event handlers
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!enableClick && !enableDrag) return;

    startPositionRef.current = { x: e.clientX, y: e.clientY };
    
    if (enableDrag) {
      isDraggingRef.current = true;
      startInteraction();
    }
  }, [enableClick, enableDrag, startInteraction]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current || !enableDrag) return;

    const deltaX = e.clientX - startPositionRef.current.x;
    const deltaY = e.clientY - startPositionRef.current.y;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      setPhysicsState((prev: any) => ({
        ...prev,
        position: { x: deltaX * 0.5, y: deltaY * 0.5 }, // Damped movement
      }));
    }
  }, [enableDrag, threshold]);

  const handlePointerUp = useCallback(() => {
    if (isDraggingRef.current) {
      endInteraction();
    }
  }, [endInteraction]);

  const handleMouseEnter = useCallback(() => {
    if (!enableHover || !shouldAnimate) return;
    
    const element = ref.current;
    if (!element) return;

    startInteraction();
    applyTransform(element, { scale });
  }, [enableHover, shouldAnimate, startInteraction, applyTransform, scale]);

  const handleMouseLeave = useCallback(() => {
    if (!enableHover || !shouldAnimate) return;
    
    const element = ref.current;
    if (!element) return;

    endInteraction();
    applyTransform(element, { scale: 1, position: { x: 0, y: 0 } });
  }, [enableHover, shouldAnimate, endInteraction, applyTransform]);

  const handleClick = useCallback(() => {
    if (!enableClick || !shouldAnimate) return;

    const element = ref.current;
    if (!element) return;

    // Quick scale animation for click feedback
    applyTransform(element, { scale: scale * 0.95 });
    setTimeout(() => {
      applyTransform(element, { scale: 1 });
    }, 100);
  }, [enableClick, shouldAnimate, applyTransform, scale]);

  // Set up event listeners
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Mouse events
    if (enableHover) {
      element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    if (enableClick) {
      element.addEventListener('click', handleClick, { passive: true });
    }

    // Pointer events for drag
    if (enableDrag) {
      element.addEventListener('pointerdown', handlePointerDown, { passive: true });
      document.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('pointerup', handlePointerUp, { passive: true });
    }

    // Keyboard support for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick();
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      // Cleanup event listeners
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('keydown', handleKeyDown);
      
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);

      // Cleanup animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    enableHover,
    enableClick,
    enableDrag,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  ]);

  return {
    ref,
    physicsState,
    isInteracting: physicsState.isInteracting,
    startInteraction,
    endInteraction,
  };
}

/**
 * Simplified physics interaction hook for basic hover effects
 */
export function useSimplePhysicsHover(scale: number = 1.02, duration: number = 200) {
  return usePhysicsInteraction({
    scale,
    duration,
    enableHover: true,
    enableClick: false,
    enableDrag: false,
  });
}

/**
 * Physics interaction hook optimized for buttons
 */
export function usePhysicsButton(options: Partial<PhysicsInteractionOptions> = {}) {
  return usePhysicsInteraction({
    scale: 0.95,
    duration: 150,
    enableHover: true,
    enableClick: true,
    enableDrag: false,
    ...options,
  });
}

/**
 * Physics interaction hook for draggable elements
 */
export function usePhysicsDrag(options: Partial<PhysicsInteractionOptions> = {}) {
  return usePhysicsInteraction({
    scale: 1.05,
    duration: 300,
    enableHover: false,
    enableClick: false,
    enableDrag: true,
    damping: 0.9,
    stiffness: 150,
    ...options,
  });
}