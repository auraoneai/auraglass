import React from 'react';
import { OptimizedGlass } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';

export interface GlassDiffViewerProps {
  left: string;
  right: string;
  sideBySide?: boolean;
  className?: string;
}

export function GlassDiffViewer({ left, right, sideBySide = true, className }: GlassDiffViewerProps) {
  return (
    <div data-glass-component className={cn('w-full', className)}>
      {sideBySide ? (
        <div className="grid grid-cols-2 gap-3">
          <OptimizedGlass elevation={'level1'} className="glass-radius-lg p-3 border border-white/15 overflow-auto">
            <pre className="text-xs text-primary/80 whitespace-pre-wrap break-all">{left}</pre>
          </OptimizedGlass>
          <OptimizedGlass elevation={'level1'} className="glass-radius-lg p-3 border border-white/15 overflow-auto">
            <pre className="text-xs text-primary/80 whitespace-pre-wrap break-all">{right}</pre>
          </OptimizedGlass>
        </div>
      ) : (
        <OptimizedGlass elevation={'level1'} className="glass-radius-lg p-3 border border-white/15 overflow-auto">
          <pre className="text-xs text-primary/80 whitespace-pre-wrap break-all">{right}</pre>
        </OptimizedGlass>
      )}
    </div>
  );
}

export default GlassDiffViewer;

