'use client';
import { cn } from '../../lib/utilsComprehensive';

import React from 'react';

export interface GlassSpotlightProps { targetRect: DOMRect | null; onClose: ()=>void }

export function GlassSpotlight({ targetRect, onClose }: GlassSpotlightProps) {
  if (!targetRect) return null;
  const pad = 8;
  const style: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'
  };
  const hole: React.CSSProperties = {
    position: 'absolute',
    left: targetRect.left - pad,
    top: targetRect.top - pad,
    width: targetRect.width + pad*2,
    height: targetRect.height + pad*2,
    borderRadius: 12,
    boxShadow: '0 0 0 9999px var(--glass-text-tertiary-dark)',
    pointerEvents: 'none'
  };
  return (
    <div data-glass-component style={style} onClick={onClose}>
      <div style={hole} />
    </div>
  );
}

export default GlassSpotlight;

