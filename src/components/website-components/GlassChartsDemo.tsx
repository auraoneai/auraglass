"use client";
import React, { useId } from "react";
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
  const gradientId = useId().replace(/:/g, "");
  const lineGradient = `${gradientId}-line`;
  const areaGradient = `${gradientId}-area`;
  const bars = [38, 58, 44, 72, 62, 84];
  const linePoints = [
    [0, 72],
    [48, 48],
    [96, 58],
    [144, 32],
    [192, 42],
    [240, 24],
  ];
  const path = linePoints
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  return (
    <ContrastGuard
      as="div"
      level="AA"
      className={cn("glass-w-full glass-auto-gap glass-auto-gap-md", className)}
    >
      <div className="glass-flex glass-items-center glass-justify-between glass-gap-3">
        <div>
          <TextWithContrast
            as="h3"
            className="glass-text-base glass-font-semibold"
          >
            Glass Charts Demo
          </TextWithContrast>
          <TextWithContrast
            as="p"
            className="glass-text-xs glass-text-primary-opacity-70"
          >
            Live chart primitives
          </TextWithContrast>
        </div>
        <div className="glass-radius-full glass-border glass-px-3 glass-py-1 glass-text-xs glass-text-primary-opacity-80">
          3 views
        </div>
      </div>
      <div
        className="glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        <div className="glass-radius-lg glass-border glass-surface-subtle glass-p-3">
          <svg
            viewBox="0 0 240 96"
            width="100%"
            height="96"
            role="img"
            aria-label="Line trend"
          >
            <defs>
              <linearGradient id={lineGradient} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#70d6ff" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            {[24, 48, 72].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="240"
                y2={y}
                stroke="rgba(226,232,240,0.14)"
              />
            ))}
            <path
              d={path}
              fill="none"
              stroke={`url(#${lineGradient})`}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {linePoints.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#70d6ff" />
            ))}
          </svg>
        </div>
        <div className="glass-radius-lg glass-border glass-surface-subtle glass-p-3">
          <svg
            viewBox="0 0 240 96"
            width="100%"
            height="96"
            role="img"
            aria-label="Bar comparison"
          >
            {bars.map((value, index) => (
              <rect
                key={index}
                x={index * 38 + 8}
                y={96 - value}
                width="24"
                height={value}
                rx="7"
                fill={index % 2 === 0 ? "#70d6ff" : "#34d399"}
                opacity="0.88"
              />
            ))}
          </svg>
        </div>
        <div className="glass-radius-lg glass-border glass-surface-subtle glass-p-3">
          <svg
            viewBox="0 0 120 96"
            width="100%"
            height="96"
            role="img"
            aria-label="Donut split"
          >
            <defs>
              <linearGradient id={areaGradient} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#70d6ff" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="48"
              r="32"
              fill="none"
              stroke="rgba(226,232,240,0.16)"
              strokeWidth="16"
            />
            <circle
              cx="60"
              cy="48"
              r="32"
              fill="none"
              stroke={`url(#${areaGradient})`}
              strokeWidth="16"
              strokeDasharray="145 56"
              strokeLinecap="round"
              transform="rotate(-90 60 48)"
            />
          </svg>
        </div>
      </div>
      {children}
    </ContrastGuard>
  );
}
