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
import { createGlassStyle } from "../../core/mixins/glassMixins";

const codeSurfaceStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
  border: "1px solid rgba(124, 211, 255, 0.18)",
  boxShadow:
    "0 12px 28px rgba(2, 6, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  color: "rgba(248, 250, 252, 0.92)",
  maxWidth: "100%",
  minWidth: 0,
};

export interface GlassJSONViewerProps {
  value: unknown;
  className?: string;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
}

export function GlassJSONViewer({
  value,
  className,
  compact = false,
  contained = false,
  maxHeight,
}: GlassJSONViewerProps) {
  const boundedHeight = maxHeight ?? (compact || contained ? 220 : undefined);

  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "glass-json-viewer glass-radius-lg glass-overflow-auto glass-border",
        compact ? "glass-p-2" : "glass-p-3",
        className
      )}
      style={{
        ...codeSurfaceStyle,
        ...(boundedHeight !== undefined
          ? {
              maxHeight:
                typeof boundedHeight === "number"
                  ? `${boundedHeight}px`
                  : boundedHeight,
            }
          : null),
      }}
    >
      <ContrastGuard>
        <pre
          className={cn(
            compact ? "glass-text-[11px]" : "glass-text-xs",
            "glass-whitespace-pre-wrap"
          )}
          style={{
            margin: 0,
            color: "rgba(248, 250, 252, 0.9)",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "normal",
            lineHeight: 1.55,
            fontFamily:
              "var(--glass-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
          }}
        >
          {JSON.stringify(value, null, 2)}
        </pre>
      </ContrastGuard>
    </OptimizedGlass>
  );
}

export default GlassJSONViewer;
