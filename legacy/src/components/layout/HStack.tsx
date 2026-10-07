'use client';
import React from 'react';

import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';
import { forwardRef } from 'react';
import { GlassStack, type GlassStackProps } from './GlassStack';
import { ContrastGuard } from '@/components/accessibility/ContrastGuard';

export interface HStackProps extends Omit<GlassStackProps, 'direction'> {
  /**
   * Spacing between items (for backward compatibility)
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';

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
 * Horizontal Stack component  
 * Wrapper around GlassStack with direction set to horizontal
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(
  ({ spacing, space, respectMotionPreference = true, 'aria-label': ariaLabel, role, ...props }, ref) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion = respectMotionPreference && !prefersReducedMotion;
    const ariaLabelledBy = (props as React.HTMLAttributes<HTMLDivElement>)[
      'aria-labelledby'
    ] as string | undefined;
    const resolvedRole = role ?? (ariaLabel || ariaLabelledBy ? 'group' : undefined);

    return (
      <ContrastGuard as="div" level="AA">
        <GlassStack
          ref={ref}
          direction="horizontal"
          space={spacing || space}
          respectMotionPreference={shouldRespectMotion}
          aria-label={ariaLabel}
          role={resolvedRole}
          {...props}
        />
      </ContrastGuard>
    );
  }
);

HStack.displayName = 'HStack';