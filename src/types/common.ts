/**
 * Common Types and Utilities
 * Shared type definitions used across the AuraGlass design system
 */

/**
 * 2D Vector representation for position, velocity, and force calculations
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Unsubscribe function type for event listeners and subscriptions
 * @returns void or Promise<void> for cleanup operations
 */
export type UnsubscribeFunction = () => void | Promise<void>;

/**
 * Generic callback function type
 */
export type CallbackFunction<T = void> = () => T;

/**
 * Event handler type with generic event parameter
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Async callback function type
 */
export type AsyncCallback<T = void> = () => Promise<T>;

/**
 * Subscription object with unsubscribe method
 */
export interface Subscription {
  unsubscribe: UnsubscribeFunction;
}

/**
 * Creates a subscription object from an unsubscribe function
 */
export const createSubscription = (unsubscribe: UnsubscribeFunction): Subscription => ({
  unsubscribe,
});

/**
 * Utility to create a 2D vector
 */
export const createVector2D = (x: number = 0, y: number = 0): Vector2D => ({ x, y });

/**
 * Add two vectors
 */
export const addVectors = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

/**
 * Subtract two vectors
 */
export const subtractVectors = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

/**
 * Multiply vector by scalar
 */
export const multiplyVector = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

/**
 * Calculate magnitude of a vector
 */
export const vectorMagnitude = (v: Vector2D): number =>
  Math.sqrt(v.x * v.x + v.y * v.y);

/**
 * Normalize a vector
 */
export const normalizeVector = (v: Vector2D): Vector2D => {
  const mag = vectorMagnitude(v);
  return mag > 0 ? multiplyVector(v, 1 / mag) : { x: 0, y: 0 };
};

/**
 * Calculate distance between two vectors
 */
export const vectorDistance = (v1: Vector2D, v2: Vector2D): number =>
  vectorMagnitude(subtractVectors(v1, v2));
