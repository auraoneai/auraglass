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

const metricChipSurfaceStyle: React.CSSProperties = {
  background:
    "var(--glass-primary-level3-surface)",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow:
    "0 8px 20px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
};

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
        "glass-inline-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-radius-xl glass-border glass-border-white/10 glass-surface-dark/40",
        className
      )}
      style={metricChipSurfaceStyle}
    >
      {icon && <span className="glass-opacity-80">{icon}</span>}
      <ContrastGuard>
        <span className="glass-text-xs glass-text-primary-opacity-70">
          {label}
        </span>
      </ContrastGuard>
      <ContrastGuard>
        <span className={cn("glass-font-semibold", intentColor)}>{value}</span>
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
