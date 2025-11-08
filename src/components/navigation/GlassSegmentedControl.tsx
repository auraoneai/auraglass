import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { GlassButton } from '../button/GlassButton';
import { OptimizedGlass } from '../../primitives';
import { useA11yId } from '@/utils/a11y';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface SegmentedItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassSegmentedControlProps {
  items: SegmentedItem[];
  value: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  condensed?: boolean;
  className?: string;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export const GlassSegmentedControl = forwardRef<HTMLDivElement, GlassSegmentedControlProps>(({ 
  items, 
  value, 
  onChange, 
  size = 'md', 
  condensed = false, 
  respectMotionPreference = true,
  className 
}, ref) => {
  // Accessibility and motion preferences
  const segmentedId = useA11yId('segmented-control');
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
  const sizes = {
    sm: 'h-8 glass-text-xs',
    md: 'h-9 glass-text-sm',
    lg: 'h-10 glass-text-base'
  };

  return (
    <OptimizedGlass
      ref={ref}
      elevation={'level1'}
      animation={shouldReduceMotion ? 'none' : 'gentle'}
      role="group"
      aria-label="Segmented control"
      id={segmentedId}
      className={cn(
        // Avoid clipping child button content (icons/text) against glass-radius-md corners
        'inline-flex items-center glass-radius-xl glass-p-1 glass-gap-1 overflow-visible',
        className
      )}
    >
      {items.map((it: any) => (
        <GlassButton
          key={it.id}
          variant={it.id === value ? 'primary' : 'secondary'}
          size={size}
          disabled={it.disabled}
          className={cn(
            // Prevent glyphs from being visually cropped on some GPUs/Safari when glass effects are active
            'glass-radius-md overflow-visible whitespace-nowrap leading-normal',
            sizes[size],
            condensed && 'glass-px-2'
          )}
          onClick={(e) => !it.disabled && onChange(it.id)}
          aria-pressed={it.id === value}
        >
          {it.icon && <span className="glass-mr-2 glass-inline-flex">{it.icon}</span>}
          {!condensed && it.label}
        </GlassButton>
      ))}
    </OptimizedGlass>
  );
});

GlassSegmentedControl.displayName = 'GlassSegmentedControl';

export default GlassSegmentedControl;
