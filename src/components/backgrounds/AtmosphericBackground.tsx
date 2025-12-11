"use client";
/**
 * AtmosphericBackground Component
 *
 * A dynamic background component with atmospheric effects.
 */
import React, { forwardRef, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import { OptimizedGlass } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useA11yId } from "../../utils/a11y";
import { AtmosphericBackgroundProps } from "./types";
import { ANIMATION } from "../../tokens/designConstants";
import styles from "./AtmosphericBackground.module.css";

// Default gradient colors
const defaultGradientColors = [
  "color-mix(in srgb, var(--glass-color-primary) 50%, transparent)", // Blue
  "color-mix(in srgb, var(--glass-color-secondary) 50%, transparent)", // Indigo
  "color-mix(in srgb, var(--glass-color-accent) 50%, transparent)", // Purple
  "color-mix(in srgb, var(--glass-color-info) 50%, transparent)", // Pink
];

/**
 * AtmosphericBackground Component Implementation
 */
const AtmosphericBackgroundComponent = (
  props: AtmosphericBackgroundProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    children,
    className,
    style,
    baseColor = "color-mix(in srgb, var(--glass-black) 80%, transparent)",
    gradientColors = defaultGradientColors,
    intensity = 0.7,
    animate = true,
    animationDuration = ANIMATION.DURATION.slower / 1000,
    interactive = false,
    blur = false,
    blurAmount = 5,
    intent = "neutral",
    elevation = "level2",
    tier = "medium",
    respectMotionPreference = true,
    ...rest
  } = props;

  // Accessibility and motion preferences
  const componentId = useA11yId("atmospheric-bg");
  const prefersReducedMotion = useReducedMotion();
  const { prefersReducedMotion: motionPrefersReduced } =
    useMotionPreferenceContext();

  // Determine if motion should be reduced based on all preferences
  const shouldReduceMotion =
    respectMotionPreference && (prefersReducedMotion || motionPrefersReduced);

  // State for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Ref for background container
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for interactive mode
  useEffect(() => {
    if (!interactive || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position as percentage
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interactive, shouldReduceMotion]);

  // Handle forwarded ref
  const setRefs = (element: HTMLDivElement) => {
    if (containerRef.current !== element) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        element;
    }

    // Handle the forwarded ref
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };

  const gradientStyle: React.CSSProperties & Record<string, string | number> = {
    backgroundColor: baseColor,
    backgroundImage: `linear-gradient(125deg, ${gradientColors.join(", ")})`,
    opacity: intensity,
  };

  if (interactive && !shouldReduceMotion) {
    gradientStyle.backgroundPosition = `${50 + (mousePosition.x - 50) * 0.2}% ${50 + (mousePosition.y - 50) * 0.2}%`;
  }

  if (animate && !shouldReduceMotion && !interactive) {
    gradientStyle["--atmosphere-gradient-duration"] = `${animationDuration}s`;
  }

  const gradientClasses = cn(
    styles.gradientLayer,
    interactive && !shouldReduceMotion && styles.gradientInteractive,
    animate && !shouldReduceMotion && !interactive && styles.animateGradient,
    shouldReduceMotion && styles.reduceMotion
  );

  const effectClasses = cn(
    styles.atmosphericEffect,
    animate && !shouldReduceMotion && styles.animateClouds,
    shouldReduceMotion && styles.reduceMotion
  );

  const blurStyle: React.CSSProperties = {
    // Use createGlassStyle() instead,
    // Use createGlassStyle() instead,
  };

  return (
    <OptimizedGlass
      ref={setRefs}
      intent={intent as any}
      elevation={elevation as any}
      tier={tier as any}
      className={cn(
        "glass-atmospheric-background",
        styles.container,
        className
      )}
      style={{ ...(style || {}) }}
      id={componentId}
      role="img"
      aria-label={`Atmospheric background with ${animate && !shouldReduceMotion ? "animated" : "static"} ${gradientColors.length} color gradient`}
      aria-hidden="true"
      tabIndex={interactive ? 0 : -1}
      {...rest}
    >
      <div className={gradientClasses} style={{ ...gradientStyle }} />

      <div className={effectClasses} />

      <div className={styles.blurLayer} style={{ ...blurStyle }} />

      <div className={styles.contentLayer}>{children}</div>
    </OptimizedGlass>
  );
};

/**
 * AtmosphericBackground Component
 *
 * A dynamic background component with atmospheric effects.
 */
const AtmosphericBackground = forwardRef(AtmosphericBackgroundComponent);
AtmosphericBackground.displayName = "AtmosphericBackground";

export default AtmosphericBackground;
export { AtmosphericBackground };
