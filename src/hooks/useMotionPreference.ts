"use client";
import type { AnimationProps, Transition } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

export type MotionAwareEase =
  | string
  | number[]
  | ((progress: number) => number);

export type MotionAwareNormalizedEase =
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "linear"
  | number[]
  | ((progress: number) => number);

export type MotionAwareTransition = Transition;

export type MotionAwareAnimationProps = AnimationProps &
  Record<string, unknown>;

export interface MotionAwareAnimationConfig {
  getAnimationProps: (
    props?: MotionAwareAnimationProps
  ) => MotionAwareAnimationProps;
  getTransition: (
    duration?: number,
    easing?: MotionAwareEase
  ) => MotionAwareTransition;
}

export interface AnimationDurationConfig {
  duration: number;
}

export function useMotionAwareAnimation(): MotionAwareAnimationConfig {
  const prefersReducedMotion = useReducedMotion();

  const getAnimationProps = (
    props: MotionAwareAnimationProps = {}
  ): MotionAwareAnimationProps => {
    if (prefersReducedMotion) {
      return {
        ...props,
        // Use a zero-duration transition compatible with Framer Motion
        transition: { duration: 0 },
        animate: (props?.initial || {}) as AnimationProps["animate"],
      };
    }
    return props;
  };

  // Normalize easing to Framer Motion-friendly values
  const normalizeEase = (
    easing: MotionAwareEase
  ): MotionAwareNormalizedEase | "spring" => {
    if (typeof easing === "string") {
      const e = easing.trim().toLowerCase();
      // Convert common CSS names to Framer Motion names
      if (e === "ease-in") return "easeIn";
      if (e === "ease-out") return "easeOut";
      if (e === "ease-in-out" || e === "ease") return "easeInOut";
      if (e === "linear") return "linear";
      if (e === "spring") return "spring";
      // Support CSS cubic-bezier() by converting to an array that Framer understands
      if (e.startsWith("cubic-bezier(") && e.endsWith(")")) {
        const nums = e
          .slice("cubic-bezier(".length, -1)
          .split(",")
          .map((n) => parseFloat(n.trim()))
          .filter((n) => Number.isFinite(n));
        if (nums.length === 4) return nums as unknown as number[];
      }
      // Fallback
      return "easeInOut";
    }
    return easing;
  };

  const getTransition = (
    duration: number = 0.3,
    easing: MotionAwareEase = "easeOut"
  ): MotionAwareTransition => {
    if (prefersReducedMotion) {
      return { duration: 0 };
    }
    const normalized = normalizeEase(easing);
    if (normalized === "spring") {
      // Let callers provide additional spring settings if needed elsewhere
      return { type: "spring" };
    }
    return { duration, ease: normalized };
  };

  return {
    getAnimationProps,
    getTransition,
  };
}

export function useAnimationDuration(
  baseDuration: number = 200
): AnimationDurationConfig {
  const prefersReducedMotion = useReducedMotion();

  return {
    duration: prefersReducedMotion ? 0 : baseDuration,
  };
}

export function useMotionPreference() {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return { shouldAnimate, prefersReducedMotion };
}
