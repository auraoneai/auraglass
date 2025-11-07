'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '@/utils/a11y';
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassSplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Split direction
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Initial split percentage for first pane
   */
  initial?: number;
  /**
   * Minimum percentage for first pane
   */
  min?: number;
  /**
   * Maximum percentage for first pane
   */
  max?: number;
  /**
   * Content for the left/top pane
   */
  left?: React.ReactNode;
  /**
   * Content for the right/bottom pane
   */
  right?: React.ReactNode;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  'aria-label'?: string;
  /**
   * Callback when split percentage changes
   */
  onSplitChange?: (percentage: number) => void;
}

/**
 * GlassSplitPane component
 * Resizable split pane with glassmorphism styling
 */
export const GlassSplitPane = forwardRef<HTMLDivElement, GlassSplitPaneProps>(
  ({
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

    direction = 'horizontal',
    initial = 50,
    min = 20,
    max = 80,
    left,
    right,
    respectMotionPreference = true,
    'aria-label': ariaLabel = 'Split pane',
    onSplitChange,
    className,
    ...props
  }, ref) => {
    const [pct, setPct] = React.useState(initial);
    const dragging = React.useRef(false);
    const splitPaneId = useA11yId();
    const separatorId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion = respectMotionPreference && !prefersReducedMotion;

    const onDown = () => (dragging.current = true);
    const onUp = () => (dragging.current = false);
    
    const onMove = React.useCallback((e: MouseEvent) => {
      if (!dragging.current) return;
      
      let newPct: number;
      if (direction === 'horizontal') {
        newPct = (e.clientX / window.innerWidth) * 100;
      } else {
        newPct = (e.clientY / window.innerHeight) * 100;
      }
      
      const clampedPct = Math.max(min, Math.min(max, newPct));
      setPct(clampedPct);
      onSplitChange?.(clampedPct);
    }, [direction, min, max, onSplitChange]);

    React.useEffect(() => {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
    }, [onMove]);

    // Keyboard support for separator
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const step = 5; // 5% steps
      let newPct = pct;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          newPct = Math.max(min, pct - step);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          newPct = Math.min(max, pct + step);
          break;
        case 'Home':
          newPct = min;
          break;
        case 'End':
          newPct = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      setPct(newPct);
      onSplitChange?.(newPct);
    };

    return (
      <div
        ref={ref}
        id={splitPaneId}
        className={cn(
          'relative w-full h-full',
          direction === 'horizontal' 
            ? 'grid grid-cols-[var(--a)_12px_1fr]' 
            : 'grid grid-rows-[var(--a)_12px_1fr]',
          // Motion preferences
          shouldRespectMotion && 'motion-safe:transition-all motion-reduce:transition-none',
          className
        )}
        style={{
          // @ts-ignore custom var
          ['--a' as any]: `${pct}%`
        }}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Left/Top Pane */}
        <div 
          className="min-w-0 min-h-0 overflow-auto"
          aria-label={direction === 'horizontal' ? 'Left pane' : 'Top pane'}
        >
          {left}
        </div>
        
        {/* Separator */}
        <div
          id={separatorId}
          role="separator"
          tabIndex={0}
          aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
          aria-valuenow={pct}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={`Resize ${direction === 'horizontal' ? 'vertical' : 'horizontal'} split. Currently at ${Math.round(pct)}%`}
          onMouseDown={onDown}
          onKeyDown={handleKeyDown}
          className={cn(
            'select-none glass-radius-full focus:outline-none focus:ring-2 focus:ring-primary/50',
            direction === 'horizontal' 
              ? 'w-3 h-full cursor-col-resize' 
              : 'h-3 w-full cursor-row-resize',
            'bg-white/10',
            shouldRespectMotion ? 'hover:bg-white/20 transition-colors duration-200' : 'hover:bg-white/20',
            dragging.current && 'bg-white/30'
          )}
        />
        
        {/* Right/Bottom Pane */}
        <div 
          className="min-w-0 min-h-0 overflow-auto"
          aria-label={direction === 'horizontal' ? 'Right pane' : 'Bottom pane'}
        >
          {right}
        </div>
      </div>
    );
  }
);

GlassSplitPane.displayName = 'GlassSplitPane';

export default GlassSplitPane;

