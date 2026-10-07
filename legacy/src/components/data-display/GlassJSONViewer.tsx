"use client";
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
const codeSurfaceStyle: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",
  backdropFilter: "blur(16px) saturate(1.4) brightness(1.08) contrast(1.04)",
  WebkitBackdropFilter:
    "blur(16px) saturate(1.4) brightness(1.08) contrast(1.04)",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  boxShadow:
    "0 14px 34px rgba(3, 7, 18, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
  color: "var(--glass-theme-text, var(--glass-text-primary, rgba(248,250,252,0.96)))",
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
      <pre
        className={cn(
          compact ? "glass-text-[11px]" : "glass-text-xs",
          "glass-whitespace-pre-wrap"
        )}
        style={{
          margin: 0,
          color: "var(--glass-theme-text, var(--glass-text-primary, rgba(248,250,252,0.96)))",
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
    </OptimizedGlass>
  );
}

export default GlassJSONViewer;
