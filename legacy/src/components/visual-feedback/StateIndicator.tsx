"use client";
/**
 * StateIndicator Component
 *
 * A component that visually indicates the current state of a UI element.
 */
import React, { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

import { StateIndicatorProps } from "./types";
import styles from "./StateIndicator.module.css";

// Convert color string to RGB values
const colorToRgb = (color: string): string => {
  // Convert named colors to their RGB values
  switch (color) {
    case "primary":
      return "99, 102, 241"; // Indigo
    case "secondary":
      return "156, 39, 176"; // Purple
    case "error":
      return "240, 82, 82"; // Red
    case "info":
      return "3, 169, 244"; // Light Blue
    case "success":
      return "76, 175, 80"; // Green
    case "warning":
      return "255, 152, 0"; // Orange
    default:
      // If it's already an RGB value in format 'r, g, b'
      if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
        return color;
      }
      // Default color (white)
      return "255, 255, 255";
  }
};

// Get color for each state
const getStateColor = (state: string, color: string): string => {
  const userColor = colorToRgb(color);

  switch (state) {
    case "hover":
      return `color-mix(in srgb, rgb(${userColor}) 15%, transparent)`;
    case "active":
      return `color-mix(in srgb, rgb(${userColor}) 30%, transparent)`;
    case "focus":
      return `color-mix(in srgb, rgb(${userColor}) 20%, transparent)`;
    case "disabled":
      return "color-mix(in srgb, var(--glass-gray-400) 20%, transparent)";
    case "loading":
      return `color-mix(in srgb, rgb(${userColor}) 20%, transparent)`;
    case "success":
      return "color-mix(in srgb, hsl(var(--glass-color-success)) 15%, transparent)";
    case "error":
      return "color-mix(in srgb, hsl(var(--glass-color-danger)) 15%, transparent)";
    case "default":
    default:
      return "transparent";
  }
};

/**
 * StateIndicator Component Implementation
 */
function StateIndicatorComponent(
  props: StateIndicatorProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    children,
    state = "default",
    glass = false,
    blend = true,
    intensity = 0.7,
    color = "primary",
    animationDuration = ANIMATION.DURATION.slower * 2,
    className,
    style,
    ...rest
  } = props;

  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();

  const overlayStyle = useMemo<React.CSSProperties>(() => {
    if (state === "default") {
      return {};
    }

    const glassBase = glass
      ? createGlassStyle({ elev: 2, variant: "default" })
      : undefined;
    const { position, overflow, ...rest } = glassBase ?? {};

    const style: React.CSSProperties = {
      ...rest,
      backgroundColor: getStateColor(state, color),
      opacity: intensity,
      mixBlendMode: blend ? "overlay" : "normal",
    };

    if (state === "loading") {
      style.animationDuration = `${animationDuration}ms`;
    }

    return style;
  }, [state, color, intensity, blend, glass, animationDuration]);

  return (
    <div
      ref={ref}
      className={cn(styles.container, "glass-state-indicator", className)}
      style={{ ...(style ?? {}) }}
      {...rest}
    >
      {children}

      {state !== "default" && (
        <div
          className={cn(
            styles.overlay,
            state === "loading" && !prefersReducedMotion && styles.loading,
            state === "disabled" && styles.disabled
          )}
          style={{ ...overlayStyle }}
        />
      )}
    </div>
  );
}

/**
 * StateIndicator Component
 *
 * A component that visually indicates the current state of a UI element.
 */
const StateIndicator = forwardRef(StateIndicatorComponent);

export default StateIndicator;
