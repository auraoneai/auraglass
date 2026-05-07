"use client";
// Typography tokens available via typography.css (imported in index.css)
import { cn } from "../../../lib/utilsComprehensive";
import React from "react";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../../tokens/designConstants";

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
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: style === "compact" ? "10px" : "12px",
    background: glassEffect
      ? "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.46))"
      : "transparent",
    borderRadius: glassEffect ? "var(--glass-radius-md)" : "0",
    border: glassEffect ? "1px solid rgba(15, 23, 42, 0.14)" : "none",
    boxShadow: glassEffect
      ? "inset 0 1px 0 rgba(255,255,255,0.72), 0 12px 34px rgba(15,23,42,0.12)"
      : "none",
    // Use createGlassStyle() instead,
    color: "var(--glass-text-primary, #0f172a)",
    marginBottom: position === "top" ? "16px" : "0",
    marginTop: position === "bottom" ? "16px" : "0",
    marginRight: position === "left" ? "16px" : "0",
    marginLeft: position === "right" ? "16px" : "0",
    flexDirection:
      position === "left" || position === "right" ? "column" : "row",
    alignItems: "center",
    justifyContent:
      position === "left" || position === "right" ? "flex-start" : "center",
    overflowX: "auto",
  };

  if (children) {
    return (
      <ContrastGuard
        as="div"
        level="AA"
        style={{ ...containerStyle }}
        className={className}
      >
        {children}
      </ContrastGuard>
    );
  }

  return (
    <ContrastGuard
      as="div"
      level="AA"
      data-glass-component
      style={{ ...containerStyle }}
      className={className}
    >
      {datasets.map((dataset, index) => (
        <div
          key={dataset.id || index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: 0,
            maxWidth: "100%",
            opacity: dataset.hidden ? 0.5 : 1,
            cursor: interactive ? "pointer" : "default",
            padding: style === "minimal" ? "2px 0" : "4px 6px",
          }}
          onClick={(e) => interactive && onItemClick && onItemClick(index)}
          role={interactive ? "button" : undefined}
          aria-label={
            interactive
              ? `Toggle ${dataset.label || `Dataset ${index + 1}`} visibility`
              : undefined
          }
          tabIndex={interactive ? 0 : undefined}
        >
          <div
            style={{
              width: style === "compact" ? "8px" : "12px",
              height: style === "compact" ? "8px" : "12px",
              borderRadius: "var(--glass-radius-sm)",
              background:
                dataset.backgroundColor ||
                dataset.borderColor ||
                "var(--glass-color-primary)",
              border: "1px solid var(--glass-border-subtle)",
            }}
          />
          <TextWithContrast
            as="span"
            style={{
              fontSize: style === "compact" ? "11px" : "12px",
              color: glassEffect ? "var(--glass-text-primary)" : "inherit",
              fontWeight: "var(--typography-subheading-weight)",
              whiteSpace: "nowrap",
            }}
          >
            {dataset.label || `Dataset ${index + 1}`}
          </TextWithContrast>
        </div>
      ))}
    </ContrastGuard>
  );
};

export default ChartLegend;
