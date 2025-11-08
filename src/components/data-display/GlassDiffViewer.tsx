'use client';
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";

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
            className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 overflow-auto"
          >
            <pre className="glass-text-xs text-primary/80 whitespace-pre-wrap break-all">
              {left}
            </pre>
          </OptimizedGlass>
          <OptimizedGlass
            elevation={"level1"}
            className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 overflow-auto"
          >
            <pre className="glass-text-xs text-primary/80 whitespace-pre-wrap break-all">
              {right}
            </pre>
          </OptimizedGlass>
        </div>
      ) : (
        <OptimizedGlass
          elevation={"level1"}
          className="glass-radius-lg glass-p-3 glass-border glass-border-white/15 overflow-auto"
        >
          <pre className="glass-text-xs text-primary/80 whitespace-pre-wrap break-all">
            {right}
          </pre>
        </OptimizedGlass>
      )}
    </div>
  );
}

export default GlassDiffViewer;