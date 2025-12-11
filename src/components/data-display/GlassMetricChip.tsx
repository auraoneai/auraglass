"use client";
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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
      {icon && <span className="glass-opacity-80">{icon}</span>}
      <ContrastGuard>
        <span className="glass-text-xs glass-text-primary-opacity-70">
          {label}
        </span>
      </ContrastGuard>
      <ContrastGuard>
        <span className={cn("font-semibold", intentColor)}>{value}</span>
      </ContrastGuard>
      {delta && (
        <ContrastGuard>
          <span className="glass-text-xs glass-text-primary-glass-opacity-60">
            {delta}
          </span>
        </ContrastGuard>
      )}
    </OptimizedGlass>
  );
}

export default GlassMetricChip;
