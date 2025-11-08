'use client';
import React, { forwardRef } from 'react';
import { cn } from '../lib/utilsComprehensive';
import { createGlassStyle, GlassIntent, GlassElevation, QualityTier } from '../core/mixins/glassMixins';

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glass semantic intent */
  intent?: GlassIntent;

  /** Glass elevation level */
  elevation?: GlassElevation;

  /** Performance quality tier */
  tier?: QualityTier;

  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** Enable interactive states */
  interactive?: boolean;

  /** Enable hover lift effect */
  hoverLift?: boolean;

  /** Enable focus ring */
  focusRing?: boolean;

  /** Enable press effect */
  press?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** Children elements */
  children?: React.ReactNode;
}

const GlassCore = forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      intent = 'neutral',
      elevation = 'level2',
      tier = 'high',
      radius = 'md',
      interactive = false,
      hoverLift = false,
      focusRing = false,
      press = false,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Generate glass styles using the modern token-based mixin
    const glassStyles = createGlassStyle({
      intent,
      elevation,
      tier,
      interactive,
      hoverLift,
      focusRing,
      press,
    });

    // Apply border radius based on token system
    const radiusStyles = {
      borderRadius: 
        radius === 'none' ? '0px' : 
        radius === 'sm' ? '4px' :
        radius === 'md' ? '8px' :
        radius === 'lg' ? '12px' :
        radius === 'xl' ? '16px' :
        radius === 'full' ? '9999px' : '8px',
    };

    // Combine all styles
    const combinedStyles = {
      ...glassStyles,
      ...radiusStyles,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-foundation-basic',
          {
            'glass-state-interactive': interactive,
            'glass-state-hoverable': hoverLift,
            'glass-focus': focusRing,
            'glass-state-pressable': press,
          },
          className
        )}
        style={combinedStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCore.displayName = 'GlassCore';

export { GlassCore };
export default GlassCore;

// Export modern types
export type { GlassIntent, GlassElevation, QualityTier };

// Legacy types for backward compatibility
/** @deprecated Use GlassIntent instead */
export type GlassVariant = 'clear' | 'frosted' | 'tinted' | 'luminous' | 'dynamic';
/** @deprecated Use elevation levels instead */
export type BlurIntensity = 'none' | 'subtle' | 'medium' | 'strong' | 'intense';