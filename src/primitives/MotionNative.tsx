"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utilsComprehensive";
import { useMultiSpring } from "../animations/hooks/useMultiSpringBasic";

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation type */
  type?: "fade" | "slide" | "scale" | "bounce" | "elastic" | "flip" | "rotate";

  /** Animation direction */
  direction?: "up" | "down" | "left" | "right" | "none";

  /** Animation duration in milliseconds */
  duration?: number;

  /** Animation delay in milliseconds */
  delay?: number;

  /** Animation easing */
  easing?: string;

  /** Enable physics-based animation */
  physics?: boolean;

  /** Physics spring configuration */
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };

  /** Trigger animation on mount */
  animateOnMount?: boolean;

  /** Trigger animation on hover */
  animateOnHover?: boolean;

  /** Trigger animation on click */
  animateOnClick?: boolean;

  /** Loop animation */
  loop?: boolean;

  /** Animation repeat count */
  repeat?: number;

  /** Custom animation keyframes */
  keyframes?: Record<string, any>;

  /** Animation fill mode */
  fillMode?: "none" | "forwards" | "backwards" | "both";

  /** Enable reduced motion support */
  respectReducedMotion?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** Children elements */
  children?: React.ReactNode;
}

const MotionNative = forwardRef<HTMLDivElement, MotionProps>(
  (
    {
      type = "fade",
      direction = "none",
      duration = 300,
      delay = 0,
      easing = "ease-out",
      physics = false,
      springConfig,
      animateOnMount = true,
      animateOnHover = false,
      animateOnClick = false,
      loop = false,
      repeat = 1,
      keyframes,
      fillMode = "forwards",
      respectReducedMotion = true,
      className,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<Animation | null>(null);

    // Physics animation hook
    const physicsSpring = useMultiSpring(
      { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 },
      { config: springConfig || { stiffness: 200, damping: 25, mass: 1 } }
    );

    // Check for reduced motion preference safely
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined" && window.matchMedia) {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updatePreference = () => setPrefersReducedMotion(mq.matches);
        updatePreference();

        if (mq.addEventListener) {
          mq.addEventListener("change", updatePreference);
          return () => mq.removeEventListener("change", updatePreference);
        } else {
          // @ts-ignore - Legacy API
          mq.addListener(updatePreference);
          return () => mq.removeListener(updatePreference);
        }
      }
    }, []);

    const shouldAnimate = !respectReducedMotion || !prefersReducedMotion;

    // Generate animation keyframes based on type and direction
    const generateKeyframes = () => {
      if (keyframes) return keyframes;

      const frames: Record<string, any> = {};

      switch (type) {
        case "fade":
          frames.from = { opacity: 0 };
          frames.to = { opacity: 1 };
          break;

        case "slide":
          frames.from = {
            opacity: 0,
            transform: getDirectionalTransform(direction, 20),
          };
          frames.to = {
            opacity: 1,
            transform: "translate(0, 0) scale(1) rotate(0deg)",
          };
          break;

        case "scale":
          frames.from = {
            opacity: 0,
            transform: "scale(0.8)",
          };
          frames.to = {
            opacity: 1,
            transform: "scale(1)",
          };
          break;

        case "bounce":
          frames.from = {
            opacity: 0,
            transform: getDirectionalTransform(direction, 30),
          };
          frames["60%"] = {
            opacity: 1,
            transform: getDirectionalTransform(direction, -10),
          };
          frames["80%"] = {
            opacity: 1,
            transform: getDirectionalTransform(direction, 5),
          };
          frames.to = {
            opacity: 1,
            transform: "translate(0, 0) scale(1) rotate(0deg)",
          };
          break;

        case "elastic":
          frames.from = {
            opacity: 0,
            transform: getDirectionalTransform(direction, 20) + " scale(0.3)",
          };
          frames["55%"] = {
            opacity: 1,
            transform: getDirectionalTransform(direction, -5) + " scale(1.05)",
          };
          frames["65%"] = {
            opacity: 1,
            transform: getDirectionalTransform(direction, 3) + " scale(0.95)",
          };
          frames["75%"] = {
            opacity: 1,
            transform: getDirectionalTransform(direction, -1) + " scale(1.02)",
          };
          frames.to = {
            opacity: 1,
            transform: "translate(0, 0) scale(1) rotate(0deg)",
          };
          break;

        case "flip":
          frames.from = {
            opacity: 0,
            transform: `rotateY(${direction === "left" ? -90 : 90}deg)`,
          };
          frames.to = {
            opacity: 1,
            transform: "rotateY(0deg)",
          };
          break;

        case "rotate":
          frames.from = {
            opacity: 0,
            transform: "rotate(-180deg)",
          };
          frames.to = {
            opacity: 1,
            transform: "rotate(0deg)",
          };
          break;

        default:
          frames.from = { opacity: 0 };
          frames.to = { opacity: 1 };
      }

      return frames;
    };

    // Helper function for directional transforms
    const getDirectionalTransform = (dir: string, distance: number) => {
      switch (dir) {
        case "up":
          return `translateY(${distance}px)`;
        case "down":
          return `translateY(-${distance}px)`;
        case "left":
          return `translateX(${distance}px)`;
        case "right":
          return `translateX(-${distance}px)`;
        default:
          return "translate(0, 0)";
      }
    };

    // Start animation
    const startAnimation = () => {
      if (!elementRef.current || !shouldAnimate) return;

      const element = elementRef.current;

      // Cancel existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      if (physics) {
        // Use physics-based animation
        const targetValues = generateKeyframes().to;
        const springTargets: Record<string, number> = {};

        if (targetValues.opacity !== undefined)
          springTargets.opacity = targetValues.opacity;
        if (targetValues.transform) {
          // Parse transform values (simplified)
          const translateMatch = targetValues.transform.match(
            /translate\(([^,]+),\s*([^)]+)\)/
          );
          if (translateMatch) {
            springTargets.x = parseFloat(translateMatch[1]);
            springTargets.y = parseFloat(translateMatch[2]);
          }
        }

        physicsSpring.start(springTargets);
      } else {
        // Use CSS animation
        const animationKeyframes = generateKeyframes();
        const timing = {
          duration,
          delay,
          easing,
          fill: fillMode,
          iterations: loop ? Infinity : repeat,
        };

        animationRef.current = element.animate
          ? element.animate(animationKeyframes, timing)
          : null;
      }
    };

    // Stop animation
    const stopAnimation = () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };

    // Handle hover animation
    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
      if (animateOnHover && shouldAnimate) {
        startAnimation();
      }
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      if (animateOnHover && shouldAnimate) {
        stopAnimation();
      }
      onMouseLeave?.(event);
    };

    // Handle click animation
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (animateOnClick && shouldAnimate) {
        startAnimation();
      }
      onClick?.(event);
    };

    // Start animation on mount if requested
    useEffect(() => {
      if (animateOnMount && shouldAnimate) {
        const timer = setTimeout(() => {
          startAnimation();
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [animateOnMount, shouldAnimate, delay]);

    // Combine physics styles with custom styles
    const combinedStyles = {
      ...style,
      ...(physics && {
        opacity: physicsSpring.values.opacity,
        transform: `translate(${physicsSpring.values.x}px, ${physicsSpring.values.y}px) scale(${physicsSpring.values.scale}) rotate(${physicsSpring.values.rotation}deg)`,
      }),
    };

    return (
      <div
        ref={(el) => {
          elementRef.current = el;
          // Handle forwarded ref
          if (ref) {
            if (typeof ref === "function") {
              ref(el);
            } else if (ref && "current" in ref) {
              ref.current = el;
            }
          }
        }}
        className={cn(
          "motion-element",
          {
            "motion-fade": type === "fade",
            "motion-slide": type === "slide",
            "motion-scale": type === "scale",
            "motion-bounce": type === "bounce",
            "motion-elastic": type === "elastic",
            "motion-flip": type === "flip",
            "motion-rotate": type === "rotate",
            "motion-physics": physics,
            "motion-hover": animateOnHover,
            "motion-click": animateOnClick,
          },
          className
        )}
        style={{ ...combinedStyles }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MotionNative.displayName = "MotionNative";

export { MotionNative };
export default MotionNative;
