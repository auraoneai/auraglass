// Accessible animation utilities
import { safeMatchMedia } from "../utils/env";

/** @deprecated prefersReducedMotion DEP-M0899 since 4.2.0, removed in 5.0.0. {@link usePreference(\} */
export const prefersReducedMotion = () => {
  return safeMatchMedia("(prefers-reduced-motion: reduce)")?.matches ?? true;
};

export interface AccessibleAnimationConfig {
  duration?: number;
  [key: string]: unknown;
}

/** @deprecated createAccessibleAnimation DEP-M0886 since 4.2.0, removed in 5.0.0. {@link the preference-aware 5.x motion tokens} */
export const createAccessibleAnimation = <T extends AccessibleAnimationConfig>(
  animation: T
): T => {
  if (prefersReducedMotion()) {
    return { ...animation, duration: 0 };
  }
  return animation;
};
