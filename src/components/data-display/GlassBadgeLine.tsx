'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassBadgeLineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: string; intent?: 'default' | 'success' | 'warning' | 'danger' }[];
  className?: string;
  /** ARIA label for the badge line */
  'aria-label'?: string;
}

export const GlassBadgeLine = forwardRef<HTMLDivElement, GlassBadgeLineProps>(({ 
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  items, 
  'aria-label': ariaLabel,
  className,
  ...props 
}, ref) => {
  const badgeLineId = useA11yId('badge-line');
  
  return (
    <div 
      ref={ref}
      id={badgeLineId}
      className={cn('flex flex-wrap glass-gap-1', className)}
      role="list"
      aria-label={ariaLabel || 'Badge list'}
      {...props}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className={cn(
            'glass-px-2 glass-py-0.5 glass-text-xs glass-radius-full border',
            it.intent === 'success' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' :
            it.intent === 'warning' ? 'bg-amber-500/15 text-amber-300 border-amber-400/30' :
            it.intent === 'danger' ? 'bg-red-500/15 text-red-300 border-red-400/30' :
            'bg-white/10 glass-text-primary/80 border-white/20'
          )}
          role="listitem"
          aria-label={`${it.intent || 'default'} badge: ${it.label}`}
        >
          {it.label}
        </span>
      ))}
    </div>
  );
});

GlassBadgeLine.displayName = 'GlassBadgeLine';

export default GlassBadgeLine;

