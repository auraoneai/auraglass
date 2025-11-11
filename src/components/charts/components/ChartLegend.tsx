"use client";
// Typography tokens available via typography.css (imported in index.css)
import { cn } from "../../../lib/utilsComprehensive";
import React from "react";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface ChartLegendProps {
  datasets?: any[];
  position?: "top" | "bottom" | "left" | "right";
  style?: "default" | "compact" | "minimal";
  glassEffect?: boolean;
  interactive?: boolean;
  onItemClick?: (datasetIndex: number) => void;
  children?: React.ReactNode;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  // TODO: Integrate ContrastGuard in chart labels, tooltips, and legends for WCAG AA compliance

  datasets = [],
  position = "top",
  style = "default",
  glassEffect = false,
  interactive = false,
  onItemClick,
  children,
  className,
}) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: style === "compact" ? "8px" : "12px",
    padding: "8px",
    background: glassEffect
      ? '${glassStyles.surface?.base || "rgba(255, 255, 255, 0.05)"}'
      : "transparent",
    // Use createGlassStyle() instead,
    borderRadius: glassEffect ? "8px" : "0",
    border: glassEffect
      ? '1px solid ${glassStyles.surface?.base || "var(--glass-bg-default)"}'
      : "none",
    marginBottom: position === "top" ? "16px" : "0",
    marginTop: position === "bottom" ? "16px" : "0",
    marginRight: position === "left" ? "16px" : "0",
    marginLeft: position === "right" ? "16px" : "0",
    flexDirection:
      position === "left" || position === "right" ? "column" : "row",
    alignItems: "center",
    justifyContent:
      position === "left" || position === "right" ? "flex-start" : "center",
  };

  if (children) {
    return (
      <div style={containerStyle} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div data-glass-component style={containerStyle} className={className}>
      {datasets.map((dataset, index) => (
        <div
          key={dataset.id || index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: dataset.hidden ? 0.5 : 1,
            cursor: interactive ? "pointer" : "default",
          }}
          onClick={(e) => interactive && onItemClick && onItemClick(index)}
        >
          <div
            style={{
              width: style === "compact" ? "8px" : "12px",
              height: style === "compact" ? "8px" : "12px",
              borderRadius: "2px",
              background:
                dataset.backgroundColor ||
                dataset.borderColor ||
                "var(--glass-color-primary)",
              border:
                '1px solid ${glassStyles.borderColor || "rgba(var(--glass-color-white) / var(--glass-opacity-20))"}',
            }}
          />
          <span
            style={{
              fontSize: style === "compact" ? "11px" : "12px",
              color: glassEffect
                ? "rgba(var(--glass-color-white) / var(--glass-opacity-80))"
                : "inherit",
              fontWeight: "var(--typography-subheading-weight)",
              whiteSpace: "nowrap",
            }}
          >
            {dataset.label || `Dataset ${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
