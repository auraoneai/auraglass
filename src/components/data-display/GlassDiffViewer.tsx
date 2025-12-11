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

export interface GlassDiffViewerProps {
  left: string;
  right: string;
  sideBySide?: boolean;
  className?: string;
}

export function GlassDiffViewer({
  left,
  right,
  sideBySide = true,
  className,
}: GlassDiffViewerProps) {
  return (
    <div data-glass-component className={cn("w-full", className)}>
      {sideBySide ? (
        <div className="glass-grid glass-grid-cols-2 glass-gap-3">
          <OptimizedGlass
            elevation={"level1"}
            className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto"
          >
            <ContrastGuard>
              <pre className="glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all">
                {left}
              </pre>
            </ContrastGuard>
          </OptimizedGlass>
          <OptimizedGlass
            elevation={"level1"}
            className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto"
          >
            <ContrastGuard>
              <pre className="glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all">
                {right}
              </pre>
            </ContrastGuard>
          </OptimizedGlass>
        </div>
      ) : (
        <OptimizedGlass
          elevation={"level1"}
          className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto"
        >
          <pre className="glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all">
            {right}
          </pre>
        </OptimizedGlass>
      )}
    </div>
  );
}

export default GlassDiffViewer;
