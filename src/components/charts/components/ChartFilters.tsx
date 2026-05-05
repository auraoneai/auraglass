"use client";
import React from "react";
import { cn } from "../../../lib/utilsComprehensive";

import { glassTokenUtils } from "../../../tokens/glass";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
export interface ChartFiltersProps {
  palette?: string[];
  qualityTier?: "low" | "medium" | "high" | "ultra";
  children?: React.ReactNode;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";

  className?: string;
  "data-testid"?: string;
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  palette = [
    "var(--glass-color-primary)",
    "var(--glass-color-danger)",
    "var(--glass-color-success)",
    "var(--glass-color-warning)",
    "var(--glass-color-secondary)",
  ],
  qualityTier = "medium",
  className,
  "data-testid": dataTestId,
}) => {
  // Generate filter effects based on quality tier
  const blurAmount =
    qualityTier === "low"
      ? 1
      : qualityTier === "medium"
        ? 2
        : qualityTier === "high"
          ? 3
          : 4;
  const glowAmount =
    qualityTier === "low"
      ? 2
      : qualityTier === "medium"
        ? 4
        : qualityTier === "high"
          ? 6
          : 8;

  return (
    <svg
      data-glass-component
      className={className}
      data-testid={dataTestId}
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="chart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowAmount} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Blur filter */}
        <filter id="chart-blur">
          <feGaussianBlur stdDeviation={blurAmount} />
        </filter>

        {/* Drop shadow filter */}
        <filter id="chart-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
        </filter>

        {/* Glass morphism filter */}
        <filter id="chart-glass" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="saturate"
            values="1.2"
            result="saturatedBlur"
          />
          <feComponentTransfer in="saturatedBlur" result="opacityBlur">
            <feFuncA type="discrete" tableValues="0.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="opacityBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient definitions for each palette color */}
        {palette.map((color, index) => (
          <React.Fragment key={index}>
            <linearGradient
              id={`chart-gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.2" />
            </linearGradient>
            <radialGradient
              id={`chart-radial-${index}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </React.Fragment>
        ))}

        {/* Pattern definitions */}
        <pattern
          id="chart-dots"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <circle
            cx="2"
            cy="2"
            r="1"
            fill={glassTokenUtils.getSurface("neutral", "level1").surface.base}
          />
        </pattern>

        <pattern
          id="chart-lines"
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <path
            d="M0,8 L8,0"
            stroke={
              glassTokenUtils.getSurface("neutral", "level1").surface.base
            }
            strokeWidth="1"
          />
        </pattern>

        {/* Noise filter for texture */}
        <filter id="chart-noise">
          <feTurbulence
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0.05" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>

        {/* Frosted glass effect */}
        <filter id="chart-frosted" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feOffset in="blur" dx="0" dy="0" result="offset" />
          <feFlood
            floodColor={
              glassTokenUtils.getSurface("neutral", "level1").surface.base
            }
            result="color"
          />
          <feComposite in="color" in2="offset" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default ChartFilters;
