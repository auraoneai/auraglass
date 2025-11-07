/**
 * Gesture Physics System
 * Provides physics-based gesture interactions with preset configurations
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { Vector2D, createVector2D, addVectors, multiplyVector, UnsubscribeFunction } from '../../types/common';
import { SpringConfig } from './springPhysics';

/**
 * Gesture types supported by the physics system
 */
export enum GestureType {
  TAP = 'tap',
  DOUBLE_TAP = 'double_tap',
  LONG_PRESS = 'long_press',
  PAN = 'pan',
  SWIPE = 'swipe',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  HOVER = 'hover',
}

/**
 * Gesture physics preset configurations
 */
export interface GesturePhysicsPreset {
  name: string;
  damping: number;
  stiffness: number;
  mass: number;
  velocity: number;
  restDelta: number;
  restSpeed: number;
  gestures: GestureType[];
}

/**
 * Predefined gesture physics presets
 */
export const GESTURE_PRESETS: Record<string, GesturePhysicsPreset> = {
  smooth: {
    name: 'smooth',
    damping: 26,
    stiffness: 170,
    mass: 1,
    velocity: 0,
    restDelta: 0.01,
    restSpeed: 0.01,
    gestures: [GestureType.PAN, GestureType.HOVER],
  },
  snappy: {
    name: 'snappy',
    damping: 20,
    stiffness: 300,
    mass: 0.5,
    velocity: 0,
    restDelta: 0.001,
    restSpeed: 0.001,
    gestures: [GestureType.TAP, GestureType.DOUBLE_TAP],
  },
  bouncy: {
    name: 'bouncy',
    damping: 15,
    stiffness: 400,
    mass: 1.5,
    velocity: 0,
    restDelta: 0.05,
    restSpeed: 0.05,
    gestures: [GestureType.SWIPE, GestureType.PAN],
  },
  gentle: {
    name: 'gentle',
    damping: 30,
    stiffness: 120,
    mass: 1.2,
    velocity: 0,
    restDelta: 0.01,
    restSpeed: 0.01,
    gestures: [GestureType.HOVER, GestureType.LONG_PRESS],
  },
  precise: {
    name: 'precise',
    damping: 40,
    stiffness: 500,
    mass: 0.8,
    velocity: 0,
    restDelta: 0.0001,
    restSpeed: 0.0001,
    gestures: [GestureType.PINCH, GestureType.ROTATE],
  },
};

/**
 * Gesture event data
 */
export interface GestureEvent {
  type: GestureType;
  position: Vector2D;
  delta: Vector2D;
  velocity: Vector2D;
  distance: number;
  angle: number;
  scale: number;
  timestamp: number;
}

/**
 * Gesture state
 */
interface GestureState {
  active: boolean;
  gestureType: GestureType | null;
  startPosition: Vector2D;
  currentPosition: Vector2D;
  velocity: Vector2D;
  startTime: number;
  lastTime: number;
}

/**
 * Options for gesture physics hook
 */
export interface UseGesturePhysicsOptions {
  preset?: keyof typeof GESTURE_PRESETS | GesturePhysicsPreset;
  enabledGestures?: GestureType[];
  onGesture?: (event: GestureEvent) => void;
  onGestureStart?: (event: GestureEvent) => void;
  onGestureEnd?: (event: GestureEvent) => void;
  threshold?: number;
  velocityThreshold?: number;
  longPressDelay?: number;
}

/**
 * Hook for gesture-based physics interactions
 */
export const useGesturePhysics = (options: UseGesturePhysicsOptions = {}) => {
  const {
    preset = 'smooth',
    enabledGestures = Object.values(GestureType),
    onGesture,
    onGestureStart,
    onGestureEnd,
    threshold = 10,
    velocityThreshold = 100,
    longPressDelay = 500,
  } = options;

  const gestureState = useRef<GestureState>({
    active: false,
    gestureType: null,
    startPosition: createVector2D(0, 0),
    currentPosition: createVector2D(0, 0),
    velocity: createVector2D(0, 0),
    startTime: 0,
    lastTime: 0,
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  const [position, setPosition] = useState<Vector2D>(createVector2D(0, 0));
  const [isGestureActive, setIsGestureActive] = useState(false);

  // Get preset configuration
  const presetConfig: GesturePhysicsPreset =
    typeof preset === 'string' ? GESTURE_PRESETS[preset] : preset;

  /**
   * Create gesture event
   */
  const createGestureEvent = (type: GestureType): GestureEvent => {
    const state = gestureState.current;
    const delta = {
      x: state.currentPosition.x - state.startPosition.x,
      y: state.currentPosition.y - state.startPosition.y,
    };
    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    const angle = Math.atan2(delta.y, delta.x);

    return {
      type,
      position: state.currentPosition,
      delta,
      velocity: state.velocity,
      distance,
      angle,
      scale: 1,
      timestamp: Date.now(),
    };
  };

  /**
   * Handle gesture start
   */
  const handleGestureStart = useCallback(
    (clientX: number, clientY: number) => {
      const state = gestureState.current;
      const currentTime = Date.now();

      state.active = true;
      state.startPosition = createVector2D(clientX, clientY);
      state.currentPosition = createVector2D(clientX, clientY);
      state.velocity = createVector2D(0, 0);
      state.startTime = currentTime;
      state.lastTime = currentTime;

      setIsGestureActive(true);

      // Check for double tap
      if (enabledGestures.includes(GestureType.DOUBLE_TAP)) {
        if (currentTime - lastTapTime.current < 300) {
          state.gestureType = GestureType.DOUBLE_TAP;
          const event = createGestureEvent(GestureType.DOUBLE_TAP);
          onGestureStart?.(event);
          onGesture?.(event);
          lastTapTime.current = 0;
          return;
        }
        lastTapTime.current = currentTime;
      }

      // Start long press timer
      if (enabledGestures.includes(GestureType.LONG_PRESS)) {
        longPressTimer.current = setTimeout(() => {
          if (state.active) {
            state.gestureType = GestureType.LONG_PRESS;
            const event = createGestureEvent(GestureType.LONG_PRESS);
            onGestureStart?.(event);
            onGesture?.(event);
          }
        }, longPressDelay);
      }

      state.gestureType = GestureType.TAP;
      onGestureStart?.(createGestureEvent(GestureType.TAP));
    },
    [enabledGestures, onGestureStart, onGesture, longPressDelay]
  );

  /**
   * Handle gesture move
   */
  const handleGestureMove = useCallback(
    (clientX: number, clientY: number) => {
      const state = gestureState.current;
      if (!state.active) return;

      const currentTime = Date.now();
      const dt = (currentTime - state.lastTime) / 1000;

      const newPosition = createVector2D(clientX, clientY);
      const delta = {
        x: newPosition.x - state.currentPosition.x,
        y: newPosition.y - state.currentPosition.y,
      };

      // Calculate velocity
      state.velocity = {
        x: dt > 0 ? delta.x / dt : 0,
        y: dt > 0 ? delta.y / dt : 0,
      };

      state.currentPosition = newPosition;
      state.lastTime = currentTime;

      // Determine gesture type
      const totalDistance = Math.sqrt(
        Math.pow(newPosition.x - state.startPosition.x, 2) +
        Math.pow(newPosition.y - state.startPosition.y, 2)
      );

      if (totalDistance > threshold) {
        // Clear long press timer
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }

        const velocityMagnitude = Math.sqrt(
          state.velocity.x * state.velocity.x +
          state.velocity.y * state.velocity.y
        );

        if (velocityMagnitude > velocityThreshold && enabledGestures.includes(GestureType.SWIPE)) {
          state.gestureType = GestureType.SWIPE;
        } else if (enabledGestures.includes(GestureType.PAN)) {
          state.gestureType = GestureType.PAN;
        }
      }

      setPosition(newPosition);
      if (state.gestureType) {
        onGesture?.(createGestureEvent(state.gestureType));
      }
    },
    [enabledGestures, onGesture, threshold, velocityThreshold]
  );

  /**
   * Handle gesture end
   */
  const handleGestureEnd = useCallback(() => {
    const state = gestureState.current;
    if (!state.active) return;

    // Clear timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (state.gestureType) {
      onGestureEnd?.(createGestureEvent(state.gestureType));
    }

    state.active = false;
    state.gestureType = null;
    setIsGestureActive(false);
  }, [onGestureEnd]);

  /**
   * Handlers for different input methods
   */
  const handlers = {
    // Mouse events
    onMouseDown: (e: React.MouseEvent) => {
      handleGestureStart(e.clientX, e.clientY);
    },
    onMouseMove: (e: React.MouseEvent) => {
      handleGestureMove(e.clientX, e.clientY);
    },
    onMouseUp: () => {
      handleGestureEnd();
    },
    onMouseLeave: () => {
      handleGestureEnd();
    },

    // Touch events
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleGestureStart(touch.clientX, touch.clientY);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handleGestureMove(touch.clientX, touch.clientY);
      }
    },
    onTouchEnd: () => {
      handleGestureEnd();
    },
    onTouchCancel: () => {
      handleGestureEnd();
    },
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }
    };
  }, []);

  return {
    handlers,
    position,
    isActive: isGestureActive,
    gestureType: gestureState.current.gestureType,
    velocity: gestureState.current.velocity,
    preset: presetConfig,
  };
};
