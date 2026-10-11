// Accessible animation utilities
import { safeMatchMedia } from "../utils/env";

export const prefersReducedMotion = () => {
  return safeMatchMedia("(prefers-reduced-motion: reduce)")?.matches ?? true;
};

export interface AccessibleAnimationConfig {
  duration?: number;
  [key: string]: unknown;
}

export const createAccessibleAnimation = <T extends AccessibleAnimationConfig>(
  animation: T
): T => {
  if (prefersReducedMotion()) {
    return { ...animation, duration: 0 };
  }
  return animation;
};
