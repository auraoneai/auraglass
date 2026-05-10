"use client";
import React, { SVGAttributes } from "react";
import { cn } from "../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const DEFAULT_DATA = [0, 0];

export interface GlassSparklineProps extends SVGAttributes<SVGSVGElement> {
  data?: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

export function GlassSparkline({
  data,
  width = 120,
  height = 32,
  stroke = "#70d6ff",
  fill = "none",
  className,
  style,
  ...rest
}: GlassSparklineProps) {
  const sparklineData =
    Array.isArray(data) && data.length ? data : DEFAULT_DATA;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const norm = (v: number) =>
    height - 2 - ((v - min) / (max - min || 1)) * (height - 4);
  const step =
    sparklineData.length > 1 ? (width - 4) / (sparklineData.length - 1) : 0;
  const d = sparklineData
    .map((v, i) => `${i === 0 ? "M" : "L"} ${2 + i * step} ${norm(v)}`)
    .join(" ");

  return (
    <svg
      data-glass-component
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("glass-text-primary", className)}
      style={{ maxWidth: "100%", height: "auto", ...style }}
      {...rest}
    >
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default GlassSparkline;
