'use client';
import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '@/utils/a11y';
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the masonry layout
   */
  columns?: number;
  /**
   * Gap between items in pixels
   */
  gap?: number;
  /**
   * Content to render in the masonry layout
   */
  children: React.ReactNode;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  'aria-label'?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
}

/**
 * GlassMasonry component
 * CSS Masonry layout for displaying content in a column-based grid
 */
export const GlassMasonry = forwardRef<HTMLDivElement, GlassMasonryProps>(
  ({ 
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

    columns = 3, 
    gap = 12, 
    children, 
    className,
    respectMotionPreference = true,
    'aria-label': ariaLabel = 'Masonry layout',
    role = 'grid',
    ...props 
  }, ref) => {
    const masonryId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion = respectMotionPreference && !prefersReducedMotion;

    return (
      <div 
        ref={ref}
        id={masonryId}
        className={cn(
          'w-full',
          // Motion preferences
          shouldRespectMotion && 'motion-safe:transition-all motion-reduce:transition-none',
          className
        )} 
        style={{ 
          columnCount: columns as any, 
          columnGap: gap 
        }}
        aria-label={ariaLabel}
        role={role}
        {...props}
      >
        {React.Children.map(children, (child, i) => (
          <div 
            key={i} 
            role="gridcell"
            style={{ 
              breakInside: 'avoid', 
              marginBottom: gap 
            }}
            className={shouldRespectMotion ? 'motion-safe:transition-all motion-reduce:transition-none' : ''}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

GlassMasonry.displayName = 'GlassMasonry';

export default GlassMasonry;