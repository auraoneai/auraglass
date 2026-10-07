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
  width?: number | string;
  height?: number;
  /**
   * Fill the available inline space and use a preview-safe height.
   * Default rendering remains the existing fixed 120x32 sparkline.
   */
  compact?: boolean;
  /**
   * Alias for compact sizing when the sparkline is rendered inside a bounded
   * card, widget, or preview surface.
   */
  contained?: boolean;
  /**
   * Optional rendered max-height. The SVG viewBox remains numeric so the path
   * math stays deterministic while the rendered box can be constrained.
   */
  maxHeight?: number | string;
  stroke?: string;
  fill?: string;
  className?: string;
}

export function GlassSparkline({
  data,
  width = 120,
  height = 32,
  compact = false,
  contained = false,
  maxHeight,
  stroke = "#70d6ff",
  fill = "none",
  className,
  style,
  preserveAspectRatio,
  ...rest
}: GlassSparklineProps) {
  const isCompact = compact || contained;
  const numericMaxHeight =
    typeof maxHeight === "number"
      ? maxHeight
      : typeof maxHeight === "string"
        ? Number.parseFloat(maxHeight)
        : undefined;
  const viewBoxWidth = typeof width === "number" ? width : 120;
  const renderedWidth = isCompact ? "100%" : width;
  const renderedHeight = isCompact
    ? Math.min(
        height,
        Number.isFinite(numericMaxHeight) ? numericMaxHeight! : 28
      )
    : height;
  const renderedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const sparklineData =
    Array.isArray(data) && data.length ? data : DEFAULT_DATA;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const norm = (v: number) =>
    height - 2 - ((v - min) / (max - min || 1)) * (height - 4);
  const step =
    sparklineData.length > 1
      ? (viewBoxWidth - 4) / (sparklineData.length - 1)
      : 0;
  const d = sparklineData
    .map((v, i) => `${i === 0 ? "M" : "L"} ${2 + i * step} ${norm(v)}`)
    .join(" ");

  return (
    <svg
      data-glass-component
      data-compact={isCompact || undefined}
      viewBox={`0 0 ${viewBoxWidth} ${height}`}
      width={renderedWidth}
      height={renderedHeight}
      preserveAspectRatio={isCompact ? "none" : preserveAspectRatio}
      className={cn("glass-text-primary", className)}
      style={{
        display: isCompact ? "block" : undefined,
        minWidth: isCompact ? 0 : undefined,
        maxWidth: "100%",
        height: isCompact ? renderedHeight : "auto",
        maxHeight: renderedMaxHeight,
        flex: isCompact ? "1 1 auto" : undefined,
        ...style,
      }}
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
