/**
 * Accessible Animation Utilities
 *
 * This module provides utilities for creating animations that respect
 * user accessibility preferences, particularly the prefers-reduced-motion
 * media query.
 */

// Re-export core accessible animation utilities
export { prefersReducedMotion, createAccessibleAnimation } from '../accessibleAnimation';

// Future-proof exports (commented out for now, ready to add when needed)
// export { createAccessibleTransition } from './transitions';
// export { AccessibleMotionConfig } from './config';
// export { useAccessibleMotion } from './hooks';
