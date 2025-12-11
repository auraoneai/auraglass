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

export interface GlassJSONViewerProps {
  value: any;
  className?: string;
}

export function GlassJSONViewer({ value, className }: GlassJSONViewerProps) {
  return (
    <OptimizedGlass
      data-glass-component
      elevation={"level1"}
      className={cn(
        "glass-radius-lg glass-p-3 overflow-auto border border-white/15",
        className
      )}
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
