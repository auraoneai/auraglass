"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION, BORDER_RADIUS } from "../../../tokens/designConstants";

export interface ChartContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
  blurStrength?: "none" | "light" | "standard" | "heavy";
  color?: string;
  borderRadius?: number | string;
  borderColor?: string;
  elevation?: "level1" | "level2" | "level3" | "level4" | "level4";
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  // ContrastGuard chart text coverage is tracked in the manual accessibility QA report.

  children,
  style,
  className,
  glassVariant = "frosted",
  blurStrength = "standard",
  color = "primary",
  borderRadius = BORDER_RADIUS.xl,
  borderColor,
  elevation = "level3",
}) => {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: "16px",
    borderRadius:
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    background:
      glassVariant === "clear"
        ? "transparent"
        : '${glassStyles.surface?.base || "var(--glass-bg-default)"}',
    // Use createGlassStyle() instead,
    border: `1px solid ${borderColor || "color-mix(in srgb, var(--glass-white) var(--glass-opacity-20), transparent)"}`,
    boxShadow: (() => {
      const elevationMap: Record<string, number> = {
        level1: 1,
        level2: 2,
        level3: 3,
        level4: 4,
      };
      const elevationValue = elevationMap[elevation || "level1"] || 1;
      return elevationValue > 0
        ? `var(--aura-shadow-elevation-${elevation === "level1" ? "sm" : elevation === "level2" ? "md" : elevation === "level3" ? "lg" : "xl"})`
        : "none";
    })(),
    overflow: "hidden",
    transition: `all var(--glass-motion-duration-normal) var(--glass-motion-easing-standard)`,
    ...style,
  };

  return (
    <div
      data-glass-component
      className={cn("glass-chart-container", className)}
      style={{ ...containerStyle }}
      role="region"
      aria-label="Chart container"
    >
      <ContrastGuard>{children}</ContrastGuard>
    </div>
  );
};

export default ChartContainer;
