"use client";
// Typography tokens available via typography.css (imported in index.css)
import { cn } from "../../../lib/utilsComprehensive";
import React from "react";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface TooltipData {
  datasetIndex: number;
  dataIndex: number;
  x: number;
  y: number;
  value: {
    dataset?: string;
    label?: string;
    value?: number | string;
    color?: string;
    extra?: Record<string, any>;
  };
}

export interface ChartTooltipProps {
  tooltipData: TooltipData | null;
  datasets?: any[];
  color?: string;
  qualityTier?: "low" | "medium" | "high" | "ultra";
  tooltipStyle?: "frosted" | "minimal" | "detailed";
  followCursor?: boolean;
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  tooltipData,
  datasets = [],
  color = "var(--glass-color-primary)",
  qualityTier = "medium",
  tooltipStyle = "frosted",
  followCursor = false,
  className,
}) => {
  if (!tooltipData) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    left: tooltipData.x + 10,
    top: tooltipData.y - 10,
    background:
      tooltipStyle === "frosted"
        ? "var(--glass-text-secondary-dark)"
        : tooltipStyle === "minimal"
          ? "var(--glass-text-primary)"
          : '${glassStyles.text?.primary || "rgba(var(--glass-color-white) / var(--glass-opacity-90))"}',
    // Use createGlassStyle() instead,
    border:
      tooltipStyle === "frosted"
        ? '1px solid ${glassStyles.borderColor || "rgba(var(--glass-color-white) / var(--glass-opacity-20))"}'
        : "1px solid rgba(var(--glass-color-black) / var(--glass-opacity-10))",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.75rem", // caption
    color: tooltipStyle === "frosted" ? "white" : "black",
    pointerEvents: "none",
    zIndex: 1000,
    boxShadow:
      "0 4px 12px rgba(var(--glass-color-black) / var(--glass-opacity-15))",
    maxWidth: "200px",
    whiteSpace: "nowrap",
  };

  return (
    <div data-glass-component style={style} className={className} data-testid={dataTestId || "charttooltip"}>
      <div
        style={{
          fontWeight: "var(--typography-heading-weight)",
          marginBottom: "4px",
        }}
      >
        {" "}
        {/* semi-bold */}
        {tooltipData.value.dataset || "Dataset"}
      </div>
      <div>
        <span style={{ color: tooltipData.value.color || color }}>●</span>{" "}
        {tooltipData.value.label || "Value"}: {tooltipData.value.value || "N/A"}
      </div>
    </div>
  );
};

export default ChartTooltip;
