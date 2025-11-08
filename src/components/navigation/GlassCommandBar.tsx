import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';
import { useA11yId } from '@/utils/a11y';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export interface GlassCommandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CommandItem[];
  position?: 'top' | 'bottom';
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export const GlassCommandBar = forwardRef<HTMLDivElement, GlassCommandBarProps>(({ 
  items, 
  position = 'bottom', 
  respectMotionPreference = true,
  className, 
  ...rest 
}, ref) => {
  // Accessibility and motion preferences
  const commandBarId = useA11yId('command-bar');
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
  
  // Handle undefined or null items gracefully
  if (!items || !Array.isArray(items)) {
    return null;
  }

  return (
    <div className={cn('w-full', position === 'top' ? 'glass-mt-2' : 'glass-mb-2')}>
      <OptimizedGlass
        ref={ref}
        elevation={'level2'}
        animation={shouldReduceMotion ? 'none' : 'gentle'}
        role="toolbar"
        aria-label="Command bar"
        id={commandBarId}
        className={cn(
          // Let child buttons render without being clipped by the glass container rounding
          'glass-radius-xl glass-px-2 glass-py-1 flex flex-wrap glass-gap-1 overflow-visible',
          className
        )}
        {...rest}
      >
        {items.map((it) => (
          <button
            key={it.id}
            disabled={it.disabled}
            onClick={it.onSelect}
            className={cn(
              // Avoid text cropping and keep shape consistent
              'glass-px-3 glass-py-1 glass-radius-md glass-text-sm glass-text-primary/90 hover:bg-white/10 border border-white/10 whitespace-nowrap leading-normal',
              'focus:outline-none focus:ring-2 focus:ring-white/30',
              !shouldReduceMotion && 'transition-all duration-200 hover:scale-105',
              it.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="glass-inline-flex items-center gap-2">
              {it.icon}
              {it.label}
              {it.shortcut && (
                <kbd className="glass-ml-1 text-xs px-1 py-0.5 glass-radius-md glass-surface-subtle/10 border border-white/15">{it.shortcut}</kbd>
              )}
            </span>
          </button>
        ))}
      </OptimizedGlass>
    </div>
  );
});

GlassCommandBar.displayName = 'GlassCommandBar';

export default GlassCommandBar;
