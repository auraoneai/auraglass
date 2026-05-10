"use client";
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  forwardRef,
  ReactNode,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import {
  useA11yId,
  prefersReducedMotion,
  announceToScreenReader,
} from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type AnimationType =
  | "fadeIn"
  | "fadeOut"
  | "slideIn"
  | "slideOut"
  | "scaleIn"
  | "scaleOut"
  | "bounce"
  | "shake"
  | "pulse"
  | "rotate"
  | "flip";

export type AnimationDirection = "up" | "down" | "left" | "right" | "center";

export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "bounce"
  | "elastic";

export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  easing?: EasingType;
  repeat?: number;
  yoyo?: boolean; // Reverse animation on repeat
  amplitude?: number; // For bounce/elastic effects
  frequency?: number; // For oscillation effects
}

export interface MotionControllerProps {
  /** Whether animations are globally enabled */
  enabled?: boolean;
  /** Global animation duration multiplier */
  speed?: number;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Whether to respect motion preferences */
  respectMotionPreference?: boolean;
  /** Children to animate */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** ARIA label for the motion controller */
  "aria-label"?: string;
}

interface MotionContextType {
  enabled: boolean;
  speed: number;
  reduceMotion: boolean;
  animate: (element: HTMLElement, config: AnimationConfig) => Promise<void>;
  batchAnimate: (
    animations: Array<{ element: HTMLElement; config: AnimationConfig }>
  ) => Promise<void>;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

const defaultMotionContext: MotionContextType = {
  enabled: false,
  speed: 1,
  reduceMotion: true,
  animate: async () => {},
  batchAnimate: async () => {},
};

export const useMotionController = () => {
  const context = useContext(MotionContext);
  return context ?? defaultMotionContext;
};

// Easing functions
const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  elastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
};

export const GlassMotionController = forwardRef<
  HTMLDivElement,
  MotionControllerProps
>(
  (
    {
      enabled = true,
      speed = 1,
      reduceMotion = false,
      respectMotionPreference = true,
      children,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const motionPreference = useMotionPreferenceContext();
    const controllerId = useA11yId("motion-controller");

    // Determine if motion should be reduced
    const shouldReduceMotion = respectMotionPreference
      ? reduceMotion || motionPreference.prefersReducedMotion
      : reduceMotion;

    const animate = async (
      element: HTMLElement,
      config: AnimationConfig
    ): Promise<void> => {
      if (!enabled || shouldReduceMotion) {
        // Still apply end state for reduced motion
        if (shouldReduceMotion) {
          applyEndState(element, config.type, config.direction || "center");
          announceToScreenReader(
            `Animation ${config.type} applied instantly due to reduced motion preference`,
            "polite"
          );
        }
        return;
      }

      setIsAnimating(true);
      announceToScreenReader(`Starting ${config.type} animation`, "polite");

      return new Promise((resolve) => {
        const {
          type,
          direction = "center",
          duration = 1000,
          delay = 0,
          easing = "easeOut",
          repeat = 0,
          yoyo = false,
          amplitude = 1,
          frequency = 1,
        } = config;

        const actualDuration = duration * speed;
        let startTime: number;
        let animationFrame: number;
        let repeatCount = 0;

        const animateFrame = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          if (timestamp - startTime < delay) {
            animationFrame = requestAnimationFrame(animateFrame);
            return;
          }

          const elapsed = timestamp - startTime - delay;
          const progress = Math.min(elapsed / actualDuration, 1);

          const easedProgress = easings[easing](progress);

          applyAnimation(
            element,
            type,
            direction,
            easedProgress,
            amplitude,
            frequency
          );

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animateFrame);
          } else {
            repeatCount++;
            if (repeatCount <= repeat) {
              startTime = timestamp;
              if (yoyo) {
                // For yoyo effect, we need to reverse the animation
                const reverseAnimateFrame = createReverseAnimationFrame(
                  element,
                  type,
                  direction,
                  actualDuration,
                  easing,
                  amplitude,
                  frequency
                );
                animationFrame = requestAnimationFrame(reverseAnimateFrame);
                return;
              }
            } else {
              setIsAnimating(false);
              announceToScreenReader(
                `Animation ${config.type} completed`,
                "polite"
              );
              resolve();
            }
          }
        };

        animationFrame = requestAnimationFrame(animateFrame);
      });
    };

    const batchAnimate = async (
      animations: Array<{ element: HTMLElement; config: AnimationConfig }>
    ) => {
      if (!enabled || shouldReduceMotion) {
        // Apply end states for reduced motion
        if (shouldReduceMotion) {
          animations.forEach(({ element, config }) => {
            applyEndState(element, config.type, config.direction || "center");
          });
          announceToScreenReader(
            `${animations.length} animations applied instantly due to reduced motion preference`,
            "polite"
          );
        }
        return;
      }

      setIsAnimating(true);
      announceToScreenReader(
        `Starting batch animation of ${animations.length} elements`,
        "polite"
      );
      const promises = animations.map(({ element, config }) =>
        animate(element, config)
      );
      await Promise.all(promises);
      setIsAnimating(false);
      announceToScreenReader("Batch animation completed", "polite");
    };

    const createReverseAnimationFrame = (
      element: HTMLElement,
      type: AnimationType,
      direction: AnimationDirection,
      duration: number,
      easing: EasingType,
      amplitude: number,
      frequency: number
    ) => {
      return (timestamp: number) => {
        // Reverse animation logic would go here
        // For simplicity, we'll just run the normal animation again
      };
    };

    const applyAnimation = (
      element: HTMLElement,
      type: AnimationType,
      direction: AnimationDirection,
      progress: number,
      amplitude: number,
      frequency: number
    ) => {
      const styles: Partial<CSSStyleDeclaration> = {};

      switch (type) {
        case "fadeIn":
        case "fadeOut":
          styles.opacity =
            type === "fadeIn" ? progress.toString() : (1 - progress).toString();
          break;

        case "slideIn":
        case "slideOut":
          const slideDistance = 100;
          const slideProgress = type === "slideIn" ? 1 - progress : progress;
          switch (direction) {
            case "up":
              styles.transform = `translateY(${slideDistance * slideProgress}px)`;
              break;
            case "down":
              styles.transform = `translateY(-${slideDistance * slideProgress}px)`;
              break;
            case "left":
              styles.transform = `translateX(${slideDistance * slideProgress}px)`;
              break;
            case "right":
              styles.transform = `translateX(-${slideDistance * slideProgress}px)`;
              break;
          }
          break;

        case "scaleIn":
        case "scaleOut":
          const scaleStart = type === "scaleIn" ? 0 : 1;
          const scaleEnd = type === "scaleIn" ? 1 : 0;
          const scaleProgress = scaleStart + (scaleEnd - scaleStart) * progress;
          styles.transform = `scale(${scaleProgress})`;
          break;

        case "bounce":
          const bounceHeight = amplitude * 50;
          const bounceProgress = easings.bounce(progress);
          styles.transform = `translateY(${bounceHeight * (1 - bounceProgress)}px)`;
          break;

        case "shake":
          const shakeIntensity = amplitude * 10;
          const shakeOffset =
            Math.sin(progress * frequency * Math.PI * 2) * shakeIntensity;
          styles.transform = `translateX(${shakeOffset}px)`;
          break;

        case "pulse":
          const pulseScale =
            1 + Math.sin(progress * frequency * Math.PI * 2) * amplitude * 0.1;
          styles.transform = `scale(${pulseScale})`;
          break;

        case "rotate":
          const rotation = progress * 360 * frequency;
          styles.transform = `rotate(${rotation}deg)`;
          break;

        case "flip":
          const flipRotation = progress * 180;
          styles.transform = `rotateY(${flipRotation}deg)`;
          break;
      }

      // Apply styles
      Object.assign(element.style, styles);
    };

    // Apply end state without animation for reduced motion
    const applyEndState = (
      element: HTMLElement,
      type: AnimationType,
      direction: AnimationDirection
    ) => {
      const styles: Partial<CSSStyleDeclaration> = {};

      switch (type) {
        case "fadeIn":
          styles.opacity = "1";
          break;
        case "fadeOut":
          styles.opacity = "0";
          break;
        case "slideIn":
        case "scaleIn":
          styles.transform = "none";
          styles.opacity = "1";
          break;
        case "slideOut":
        case "scaleOut":
          styles.opacity = "0";
          break;
        default:
          // For other animations, ensure element is visible
          styles.opacity = "1";
          styles.transform = "none";
          break;
      }

      Object.assign(element.style, styles);
    };

    return (
      <div
        ref={ref}
        className={className}
        id={controllerId}
        aria-label={
          ariaLabel ||
          (isAnimating ? "Animation in progress" : "Animation controller")
        }
        aria-busy={isAnimating}
        role="region"
        {...props}
      >
        <MotionContext.Provider
          value={{
            enabled: enabled && !shouldReduceMotion,
            speed,
            reduceMotion: shouldReduceMotion,
            animate,
            batchAnimate,
          }}
        >
          {children}
        </MotionContext.Provider>
      </div>
    );
  }
);

GlassMotionController.displayName = "GlassMotionController";

// Animated component wrapper
export interface GlassAnimatedProps {
  animation?: AnimationConfig;
  children: React.ReactNode;
  className?: string;
  trigger?: "mount" | "hover" | "click" | "manual";
  /** Whether to respect motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA label for the animated element */
  "aria-label"?: string;
}

export const GlassAnimated = forwardRef<HTMLDivElement, GlassAnimatedProps>(
  (
    {
      animation,
      children,
      className = "",
      trigger = "mount",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { animate, enabled, reduceMotion } = useMotionController();
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const motionPreference = useMotionPreferenceContext();
    const animatedId = useA11yId("animated");

    // Combine refs
    const combinedRef = (node: HTMLDivElement) => {
      elementRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const shouldReduceMotion = respectMotionPreference
      ? reduceMotion || motionPreference.prefersReducedMotion
      : reduceMotion;

    useEffect(() => {
      if (!enabled || !animation || !elementRef.current || hasAnimated) return;

      if (trigger === "mount") {
        setIsAnimating(true);
        animate(elementRef.current, animation)
          .then(() => {
            setHasAnimated(true);
            setIsAnimating(false);
          })
          .catch(() => {
            setIsAnimating(false);
          });
      }
    }, [animate, animation, enabled, trigger, hasAnimated]);

    const handleTrigger = async () => {
      if (!enabled || !animation || !elementRef.current) return;

      if (trigger === "click") {
        setIsAnimating(true);
        try {
          await animate(elementRef.current, animation);
        } finally {
          setIsAnimating(false);
        }
      }
    };

    const handleHover = async () => {
      if (!enabled || !animation || !elementRef.current || trigger !== "hover")
        return;

      setIsAnimating(true);
      try {
        await animate(elementRef.current, animation);
      } finally {
        setIsAnimating(false);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (trigger === "click" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        handleTrigger();
      }
    };

    return (
      <div
        ref={combinedRef}
        id={animatedId}
        className={className}
        onClick={trigger === "click" ? handleTrigger : undefined}
        onMouseEnter={trigger === "hover" ? handleHover : undefined}
        onKeyDown={trigger === "click" ? handleKeyDown : undefined}
        tabIndex={trigger === "click" ? 0 : undefined}
        role={trigger === "click" ? "button" : undefined}
        aria-label={
          ariaLabel ||
          (trigger === "click" ? "Animated interactive element" : undefined)
        }
        aria-busy={isAnimating}
        aria-describedby={
          shouldReduceMotion ? `${animatedId}-motion-notice` : undefined
        }
        {...props}
      >
        {children}
        {shouldReduceMotion && (
          <div
            id={`${animatedId}-motion-notice`}
            className={cn("glass-sr-only")}
          >
            Motion animations are disabled due to accessibility preferences
          </div>
        )}
      </div>
    );
  }
);

GlassAnimated.displayName = "GlassAnimated";

// Sequence animation component
export interface GlassAnimationSequenceProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  /** Whether to respect motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA label for the sequence */
  "aria-label"?: string;
}

export const GlassAnimationSequence = forwardRef<
  HTMLDivElement,
  GlassAnimationSequenceProps
>(
  (
    {
      children,
      staggerDelay = 100,
      className = "",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { batchAnimate, enabled, reduceMotion } = useMotionController();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const motionPreference = useMotionPreferenceContext();
    const sequenceId = useA11yId("animation-sequence");

    // Combine refs
    const combinedRef = (node: HTMLDivElement) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const shouldReduceMotion = respectMotionPreference
      ? reduceMotion || motionPreference.prefersReducedMotion
      : reduceMotion;

    useEffect(() => {
      if (!enabled || !containerRef.current) return;

      const elements = containerRef.current.children;
      const animations = Array.from(elements).map((element, index) => ({
        element: element as HTMLElement,
        config: {
          type: "fadeIn" as AnimationType,
          direction: "up" as AnimationDirection,
          duration: 600,
          delay: shouldReduceMotion ? 0 : index * staggerDelay,
          easing: "easeOut" as EasingType,
        },
      }));

      setIsAnimating(true);
      batchAnimate(animations)
        .then(() => setIsAnimating(false))
        .catch(() => setIsAnimating(false));
    }, [batchAnimate, enabled, staggerDelay, shouldReduceMotion]);

    return (
      <div
        ref={combinedRef}
        id={sequenceId}
        className={className}
        role="region"
        aria-label={ariaLabel || "Animation sequence"}
        aria-busy={isAnimating}
        aria-describedby={
          shouldReduceMotion ? `${sequenceId}-motion-notice` : undefined
        }
        {...props}
      >
        {children}
        {shouldReduceMotion && (
          <div
            id={`${sequenceId}-motion-notice`}
            className={cn("glass-sr-only")}
          >
            Sequential animations are disabled due to accessibility preferences
          </div>
        )}
      </div>
    );
  }
);

GlassAnimationSequence.displayName = "GlassAnimationSequence";

// Preset animations
export const animationPresets = {
  fadeInUp: {
    type: "fadeIn" as AnimationType,
    direction: "up" as AnimationDirection,
    duration: 600,
    easing: "easeOut" as EasingType,
  },
  fadeInDown: {
    type: "fadeIn" as AnimationType,
    direction: "down" as AnimationDirection,
    duration: 600,
    easing: "easeOut" as EasingType,
  },
  slideInLeft: {
    type: "slideIn" as AnimationType,
    direction: "left" as AnimationDirection,
    duration: 500,
    easing: "easeOut" as EasingType,
  },
  slideInRight: {
    type: "slideIn" as AnimationType,
    direction: "right" as AnimationDirection,
    duration: 500,
    easing: "easeOut" as EasingType,
  },
  scaleIn: {
    type: "scaleIn" as AnimationType,
    duration: 400,
    easing: "easeOut" as EasingType,
  },
  bounceIn: {
    type: "bounce" as AnimationType,
    duration: 800,
    easing: "bounce" as EasingType,
  },
  shake: {
    type: "shake" as AnimationType,
    duration: 500,
    amplitude: 1,
    frequency: 5,
  },
  pulse: {
    type: "pulse" as AnimationType,
    duration: 1000,
    amplitude: 1,
    frequency: 2,
    repeat: Infinity,
  },
};

// Animation timeline component for complex sequences
export interface GlassAnimationTimelineProps {
  timeline: Array<{
    selector: string;
    animation: AnimationConfig;
    startTime?: number;
  }>;
  children: React.ReactNode;
  className?: string;
  /** Whether to respect motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA label for the timeline */
  "aria-label"?: string;
}

export const GlassAnimationTimeline = forwardRef<
  HTMLDivElement,
  GlassAnimationTimelineProps
>(
  (
    {
      timeline,
      children,
      className = "",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { animate, enabled, reduceMotion } = useMotionController();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const motionPreference = useMotionPreferenceContext();
    const timelineId = useA11yId("animation-timeline");

    // Combine refs
    const combinedRef = (node: HTMLDivElement) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const shouldReduceMotion = respectMotionPreference
      ? reduceMotion || motionPreference.prefersReducedMotion
      : reduceMotion;

    useEffect(() => {
      if (!enabled || !containerRef.current) return;

      setIsAnimating(true);
      let animationPromises: Promise<void>[] = [];

      timeline.forEach(({ selector, animation, startTime = 0 }) => {
        const element = containerRef.current?.querySelector(
          selector
        ) as HTMLElement;
        if (element) {
          const promise = new Promise<void>((resolve) => {
            setTimeout(
              () => {
                animate(element, animation).then(resolve).catch(resolve);
              },
              shouldReduceMotion ? 0 : startTime
            );
          });
          animationPromises.push(promise);
        }
      });

      Promise.all(animationPromises)
        .then(() => setIsAnimating(false))
        .catch(() => setIsAnimating(false));
    }, [animate, enabled, timeline, shouldReduceMotion]);

    return (
      <div
        ref={combinedRef}
        id={timelineId}
        className={className}
        role="region"
        aria-label={ariaLabel || "Animation timeline"}
        aria-busy={isAnimating}
        aria-describedby={
          shouldReduceMotion ? `${timelineId}-motion-notice` : undefined
        }
        {...props}
      >
        {children}
        {shouldReduceMotion && (
          <div
            id={`${timelineId}-motion-notice`}
            className={cn("glass-sr-only")}
          >
            Timeline animations are disabled due to accessibility preferences
          </div>
        )}
      </div>
    );
  }
);

GlassAnimationTimeline.displayName = "GlassAnimationTimeline";
