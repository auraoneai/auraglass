"use client";
// Typography tokens available via typography.css (imported in index.css)
import { cn } from "../../../lib/utilsComprehensive";
import React from "react";
import { ContrastGuard } from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../../tokens/designConstants";

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
  tooltipData,
  datasets = [],
  color = "var(--glass-color-primary)",
  qualityTier = "medium",
  tooltipStyle = "frosted",
  followCursor = false,
  className,
  "data-testid": dataTestId,
}) => {
  if (!tooltipData) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    left: tooltipData.x + 10,
    top: tooltipData.y - 10,
    background:
      tooltipStyle === "frosted"
        ? "rgba(15, 23, 42, 0.92)"
        : tooltipStyle === "minimal"
          ? "rgba(255, 255, 255, 0.96)"
          : "color-mix(in srgb, var(--glass-white) var(--glass-opacity-90), transparent)",
    // Use createGlassStyle() instead,
    border:
      tooltipStyle === "frosted"
        ? "1px solid color-mix(in srgb, var(--glass-white) var(--glass-opacity-20), transparent)"
        : "1px solid color-mix(in srgb, var(--glass-black) var(--glass-opacity-10), transparent)",
    borderRadius: "var(--glass-radius-md)",
    padding: "8px 12px",
    fontSize: "0.75rem", // caption
    color: tooltipStyle === "frosted" ? "white" : "black",
    pointerEvents: "none",
    zIndex: 1000,
    boxShadow: "var(--aura-shadow-elevation-md)",
    maxWidth: "200px",
    whiteSpace: "nowrap",
  };

  const headerMarginStyle: React.CSSProperties = { marginBottom: "4px" };
  const tooltipTextColor = tooltipStyle === "frosted" ? "#ffffff" : "#000000";

  return (
    <ContrastGuard
      as="div"
      level="AA"
      data-glass-component
      style={{ ...(style ?? {}) }}
      textColor={tooltipTextColor}
      fallbackColor={tooltipTextColor}
      className={className}
      data-testid={dataTestId || "charttooltip"}
    >
      <div className="glass-font-semibold" style={{ ...headerMarginStyle }}>
        {tooltipData.value.dataset || "Dataset"}
      </div>

      <div>
        <span style={{ color: tooltipData.value.color || color }}>●</span>{" "}
        {tooltipData.value.label || "Value"}: {tooltipData.value.value || "N/A"}
      </div>
    </ContrastGuard>
  );
};

export default ChartTooltip;
