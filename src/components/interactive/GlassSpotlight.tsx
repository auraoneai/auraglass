'use client';
import { cn } from '../../lib/utilsComprehensive';

import React, { forwardRef, HTMLAttributes, useMemo } from 'react';

export interface GlassSpotlightProps extends HTMLAttributes<HTMLDivElement> {
  targetRect?: DOMRect | null;
  onClose?: () => void;
  padding?: number;
}

export const GlassSpotlight = forwardRef<HTMLDivElement, GlassSpotlightProps>(
  ({
    targetRect,
    onClose,
    className,
    children,
    padding = 8,
    ...rest
  }, ref) => {
    const holeStyle = useMemo((): React.CSSProperties | undefined => {
      if (!targetRect) return undefined;

      return {
        position: 'absolute',
        left: targetRect.left - padding,
        top: targetRect.top - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
        borderRadius: 12,
        boxShadow: '0 0 0 9999px var(--glass-text-tertiary-dark)',
        pointerEvents: 'none',
      };
    }, [targetRect, padding]);

    return (
      <div
        ref={ref}
        data-glass-component
        className={cn('fixed inset-0', className)}
        style={{
          background: targetRect
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.85))',
        }}
        onClick={onClose}
        {...rest}
      >
        {holeStyle ? <div style={holeStyle} /> : <span className="sr-only">Glass spotlight inactive</span>}
        {children}
      </div>
    );
  }
);

GlassSpotlight.displayName = 'GlassSpotlight';

export default GlassSpotlight;