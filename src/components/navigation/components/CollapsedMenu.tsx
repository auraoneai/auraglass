'use client';
// Typography tokens available via typography.css (imported in index.css)
import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../../primitives';
import { useA11yId } from '@/utils/a11y';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export interface CollapsedMenuProps {
  items: any[];
  onItemClick?: (item: any) => void;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
  className?: string;
  'aria-label'?: string;
}

const CollapsedMenu = forwardRef<HTMLDivElement, CollapsedMenuProps>(({ 
  items,
  onItemClick,
  respectMotionPreference = true,
  className,
  'aria-label': ariaLabel,
}, ref) => {
  // Accessibility and motion preferences
  const menuId = useA11yId('collapsed-menu');
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
  return (
    <OptimizedGlass
      ref={ref}
      intent="neutral"
      elevation="level3"
      intensity="strong"
      depth={2}
      tint="neutral"
      border="subtle"
      animation={shouldReduceMotion ? 'none' : 'gentle'}
      performanceMode="medium"
      role="navigation"
      aria-label={ariaLabel}
      id={menuId}
      className={cn(
        'absolute top-full right-0 min-w-[200px] z-[1000] glass-p-2',
        className
      )}
    >
      {(items || []).map((item, index) => (
        <button
          key={item?.id || index}
          role="menuitem"
          tabIndex={0}
          className={cn(
            'w-full flex items-center glass-gap-2 glass-px-3 glass-py-2 text-left glass-text-sm',
            'glass-text-primary/80 hover:glass-text-primary glass-radius-md',
            'hover:bg-white/10 focus:bg-white/10',
            'focus:outline-none focus:ring-2 focus:ring-white/30',
            !shouldReduceMotion && 'transition-all duration-200 hover:-translate-y-0.5'
          )}
          onClick={(e) => onItemClick?.(item)}
        >
          {item?.icon && <span aria-hidden="true">{item?.icon}</span>}
          <span>{item?.label}</span>
        </button>
      ))}
    </OptimizedGlass>
  );
});

CollapsedMenu.displayName = 'CollapsedMenu';

export default CollapsedMenu;