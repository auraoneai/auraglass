// Accessible animation utilities
import { safeMatchMedia } from '../utils/env';

export const prefersReducedMotion = () => {
  return safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? true;
};

export const createAccessibleAnimation = (animation: any) => {
  if (prefersReducedMotion()) {
    return { ...animation, duration: 0 };
  }
  return animation;
};
