'use client';
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassMetricChipProps {
  label: string;
  value: string | number;
  delta?: string;
  intent?: "default" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  className?: string;
}

export function GlassMetricChip({
  label = "Metric",
  value = "--",
  delta,
  intent = "default",
  icon,
  className,
}: GlassMetricChipProps) {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  const intentColor =
    intent === "success"
      ? "text-emerald-300"
      : intent === "warning"
        ? "text-amber-300"
        : intent === "danger"
          ? "text-red-300"
          : "glass-text-primary";
  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "inline-flex items-center glass-gap-2 glass-px-3 glass-py-1.5 glass-radius-xl border border-white/15",
        className
      )}
    >
      {icon && <span className='glass-opacity-80'>{icon}</span>}
      <span className='glass-text-xs glass-text-primary-opacity-70'>{label}</span>
      <span className={cn("font-semibold", intentColor)}>{value}</span>
      {delta && <span className='glass-text-xs glass-text-primary-glass-opacity-60'>{delta}</span>}
    </OptimizedGlass>
  );
}

export default GlassMetricChip;
