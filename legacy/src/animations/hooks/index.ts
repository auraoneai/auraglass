// Animation Hooks Exports
export * from './useMouseMagneticEffect';
export * from './useAnimationSequenceBasic';
export * from './useMultiSpringBasic';

// Re-export commonly used hooks for convenience
export { useMouseMagneticEffect, useMagneticField, useMagneticButton } from './useMouseMagneticEffect';
export { useAnimationSequence } from './useAnimationSequenceBasic';
export {
  useMultiSpring,
  useSpringTransform,
  useSpringColor,
  useSpringArray,
  createSpringPreset,
  createSpringSequence,
  interpolateSprings,
} from './useMultiSpringBasic';

// Re-export utility functions
export {
  createFadeInSequence,
  createSlideInSequence,
  createScaleInSequence,
  createComplexSequence,
} from './useAnimationSequenceBasic';
