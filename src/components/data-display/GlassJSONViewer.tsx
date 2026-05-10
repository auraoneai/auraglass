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

const codeSurfaceStyle: React.CSSProperties = {
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow:
    "0 12px 28px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
};

export interface GlassJSONViewerProps {
  value: unknown;
  className?: string;
}

export function GlassJSONViewer({ value, className }: GlassJSONViewerProps) {
  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "glass-radius-lg glass-p-3 glass-overflow-auto glass-border glass-border-white/10 glass-surface-dark/40",
        className
      )}
      style={codeSurfaceStyle}
    >
      <ContrastGuard>
        <pre className="glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all">
          {JSON.stringify(value, null, 2)}
        </pre>
      </ContrastGuard>
    </OptimizedGlass>
  );
}

export default GlassJSONViewer;
