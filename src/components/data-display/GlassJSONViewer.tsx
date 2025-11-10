'use client';
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";

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
      <pre className='glass-text-xs text-primary/80 whitespace-pre-wrap break-all'>
        {JSON.stringify(value, null, 2)}
      </pre>
    </OptimizedGlass>
  );
}

export default GlassJSONViewer;