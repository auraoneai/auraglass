"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

interface GlassStepLabelProps {
  label?: string;
  active: boolean;
  completed: boolean;
  orientation: "horizontal" | "vertical";
  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";
  /** Performance tier */
  tier?: "low" | "medium" | "high";
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test id attr */
  "data-testid"?: string;
}

// Get label state classes
const getLabelStateClasses = (active: boolean, completed: boolean) => {
  if (active) {
    return "text-slate-950 font-semibold";
  }
  if (completed) {
    return "text-slate-700 font-normal";
  }
  return "text-slate-700 font-normal";
};

// Get orientation classes
const getOrientationClasses = (orientation: "horizontal" | "vertical") => {
  return orientation === "horizontal" ? "glass-ml-2" : "glass-mt-1";
};

export const GlassStepLabel: React.FC<GlassStepLabelProps> = ({
  label,
  active,
  completed,
  orientation,
  intent = "neutral",
  elevation = "level1",
  tier = "low",
  className,
  style,
  "data-testid": dataTestId,
}) => {
  if (!label) {
    return null;
  }

  const labelStateClasses = getLabelStateClasses(active, completed);
  const orientationClasses = getOrientationClasses(orientation);

  return (
    <Motion
      data-glass-component
      className={cn(
        orientationClasses,
        "transition-all duration-300 ease-in-out"
      )}
    >
      <span
        className={cn(
          // Base styles
          "glass-text-sm leading-tight",
          "transition-all duration-300 ease-in-out",
          // State-based styles
          labelStateClasses,
          className
        )}
        style={{ ...(style || {}) }}
        data-testid={dataTestId}
      >
        {label}
      </span>
    </Motion>
  );
};

GlassStepLabel.displayName = "GlassStepLabel";
