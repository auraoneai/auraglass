"use client";
import React from "react";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { cn } from "@/lib/utils";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Localized semantic colors to avoid cross-package imports
const semanticColors = {
  chart: {
    primary: "var(--glass-color-primary-light)", // brand blue
    secondary: "var(--glass-color-secondary)", // brand purple
    senary: "var(--glass-color-info)", // cyan-ish for area fill
  },
} as const;

// Small collection of SVG defs + helpers to make Recharts look like the admin portal charts
// without pulling in a chart layer from there. These are composable within any Recharts Chart.

export function GlassDefs({ id }: { id: string }) {
  const grad = `${id}-grad`;
  const area = `${id}-area`;
  const glow = `${id}-glow`;
  const sweep = `${id}-sweep`;
  const primary = semanticColors.chart.primary;
  const secondary = semanticColors.chart.secondary;
  const areaTop = semanticColors.chart.senary; // cyan-ish top
  return (
    <defs data-glass-component>
      {/* Brand stroke gradient */}
      <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={primary} />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
      {/* Brand area fill */}
      <linearGradient id={area} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={areaTop} stopOpacity={0.38} />
        <stop offset="100%" stopColor={areaTop} stopOpacity={0.06} />
      </linearGradient>
      {/* Moving sweep highlight for bars/lines (used with <animate> on x) */}
      <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--glass-white)" stopOpacity={0} />
        <stop offset="50%" stopColor="var(--glass-white)" stopOpacity={0.35} />
        <stop offset="100%" stopColor="var(--glass-white)" stopOpacity={0} />
      </linearGradient>
      {/* Soft glow around strokes/points */}
      <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export const chartGlass = {
  grid: "color-mix(in srgb, var(--glass-white) 8%, transparent)",
  axis: "var(--glass-bg-default)",
  tick: {
    fill: "color-mix(in srgb, var(--glass-white) 88%, transparent)",
    fontSize: 13,
  },
  yTick: {
    fill: "color-mix(in srgb, var(--glass-white) 88%, transparent)",
    fontSize: 13,
  },
  label: (text: string) => ({
    value: text,
    fill: "color-mix(in srgb, var(--glass-white) var(--glass-opacity-80), transparent)",
    fontSize: 14,
  }),
  tooltip: {
    cursor: {
      stroke: "color-mix(in srgb, var(--glass-white) 12%, transparent)",
    },
    contentStyle: createGlassStyle({
      intent: "neutral",
      elevation: "level2",
    }) as React.CSSProperties,
    itemStyle: { color: "var(--glass-white)" } as React.CSSProperties,
    labelStyle: {
      color: "color-mix(in srgb, var(--glass-white) 85%, transparent)",
    } as React.CSSProperties,
  },
  brandGrad: (base: string) => `url(#${base}-grad)`,
  brandArea: (base: string) => `url(#${base}-area)`,
  glow: (base: string) => `url(#${base}-glow)`,
  sweep: (base: string) => `url(#${base}-sweep)`,
  // Subtle, neutral competitor palette (less saturated)
  comp: [
    "var(--glass-gray-600)",
    "var(--glass-gray-700)",
    "var(--glass-gray-800)",
  ],
};

// Standardized axis and layout tokens for Recharts demos
export const axisTokens = {
  margin: { top: 12, right: 16, bottom: 24, left: 44 },
  tickMargin: 8,
  xLabelDy: 10,
  yLabelDx: -10,
  tickFontSize: 13,
};

// GlassChartsDemo Component
export interface GlassChartsDemoProps {
  className?: string;
  children?: React.ReactNode;
}

export function GlassChartsDemo({ className, children }: GlassChartsDemoProps) {
  return (
    <ContrastGuard as="div" level="AA" className={className}>
      <TextWithContrast as="h3" className="glass-text-lg glass-font-semibold">
        Glass Charts Demo
      </TextWithContrast>
      {children}
    </ContrastGuard>
  );
}
