import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { useA11yId, createModalA11y, keyboardHandlers, announceToScreenReader } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';

export interface GlassBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  height?: number | string; // e.g. 70% or 560
  className?: string;
  /**
   * Accessible title for the bottom sheet
   */
  title?: string;
  /**
   * Accessible description for the bottom sheet
   */
  description?: string;
  /**
   * Whether to respect motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Custom aria-label
   */
  'aria-label'?: string;
  /**
   * Custom aria-labelledby
   */
  'aria-labelledby'?: string;
  /**
   * Custom aria-describedby
   */
  'aria-describedby'?: string;
}

export const GlassBottomSheet = forwardRef<HTMLDivElement, GlassBottomSheetProps>(
  ({ 
    open, 
    onOpenChange, 
    children, 
    height = '70%', 
    className,
    title,
    description,
    respectMotionPreference = true,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...props 
  }, ref) => {
    // Generate unique IDs for accessibility
    const bottomSheetId = useA11yId('glass-bottom-sheet');
    const titleId = title ? useA11yId('glass-bottom-sheet-title') : undefined;
    const descriptionId = description ? useA11yId('glass-bottom-sheet-desc') : undefined;
    const { prefersReducedMotion } = useMotionPreferenceContext();
    
    // Create accessibility attributes
    const a11yProps = createModalA11y({
      id: bottomSheetId,
      titleId: ariaLabelledBy || titleId,
      descriptionId: ariaDescribedBy || descriptionId,
      modal: true,
    });
    
    // Add aria-label if provided and no title
    if (ariaLabel && !ariaLabelledBy && !titleId) {
      a11yProps['aria-label'] = ariaLabel;
    }
    
    // Handle escape key
    const handleEscape = keyboardHandlers.onEscape(() => onOpenChange(false));
    
    // Announce to screen readers when opened
    React.useEffect(() => {
      if (open) {
        announceToScreenReader(
          `Bottom sheet opened: ${title || ariaLabel || 'Bottom sheet'}`,
          'polite'
        );
      }
    }, [open, title, ariaLabel]);
    
    const shouldAnimate = respectMotionPreference ? !prefersReducedMotion : true;

    return (
      <>
        {open && (
          <Motion
            preset="fadeIn"
            duration={shouldAnimate ? 200 : 0}
            className="fixed inset-0 z-[1100]"
            onClick={(e) => onOpenChange(false)}
          >
            <div className="absolute inset-0 glass-surface-dark/50" />
          </Motion>
        )}
        <Motion
          preset="slideUp"
          duration={shouldAnimate ? 300 : 0}
          className={cn(
            'fixed left-0 right-0 bottom-0 z-[1101]',
            open ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            transform: !shouldAnimate && !open ? 'translateY(100%)' : undefined,
          }}
          onKeyDown={handleEscape}
          {...a11yProps}
          {...props}
        >
          <OptimizedGlass 
            ref={ref}
            elevation="level3" 
            className={cn('h-full rounded-t-2xl glass-p-4', className)}
            tabIndex={-1}
          >
            {/* Handle indicator */}
            <div 
              className="mx-auto w-10 h-1.5 glass-radius-full glass-surface-subtle/30 mb-3"
              aria-hidden="true"
            />
            
            {/* Header with title and description */}
            {(title || description) && (
              <div className="mb-4">
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold text-primary">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="text-sm glass-text-secondary glass-mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            
            {children}
          </OptimizedGlass>
        </Motion>
      </>
    );
  }
);

GlassBottomSheet.displayName = 'GlassBottomSheet';

export default GlassBottomSheet;

