"use client";
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { ContrastGuard } from "@/components/accessibility/ContrastGuard";

const metricChipSurfaceStyle: React.CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.14))",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow:
    "0 8px 20px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 10px rgba(255, 255, 255, 0.14)",
  color: "var(--glass-theme-text, var(--glass-text-primary))",
  ["--glass-text-primary" as string]: "rgba(15, 23, 42, 0.94)",
  ["--glass-text-secondary" as string]: "rgba(30, 41, 59, 0.78)",
  ["--typography-text-primary" as string]: "rgba(15, 23, 42, 0.94)",
  ["--typography-text-secondary" as string]: "rgba(30, 41, 59, 0.78)",
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
  const intentLabel = intent === "default" ? undefined : intent;
  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "glass-inline-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-radius-xl glass-border glass-border-white/10",
        className
      )}
      style={metricChipSurfaceStyle}
    >
      {icon && <span className="glass-opacity-80" aria-hidden="true">{icon}</span>}
      <ContrastGuard>
        <span className="glass-text-xs glass-text-primary-opacity-70">
          {label}
        </span>
      </ContrastGuard>
      <ContrastGuard>
        <span
          className="glass-font-semibold"
          style={{ color: "var(--glass-theme-text, var(--glass-text-primary))" }}
          aria-label={intentLabel ? `${value}, ${intentLabel}` : undefined}
        >
          {value}
        </span>
      </ContrastGuard>
      {delta && (
        <ContrastGuard>
          <span
            className="glass-text-xs"
            style={{ color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))" }}
          >
            {delta}
          </span>
        </ContrastGuard>
      )}
    </OptimizedGlass>
  );
}

export default GlassMetricChip;
