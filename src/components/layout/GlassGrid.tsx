import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '@/utils/a11y';
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns (1-12)
   */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Responsive column configuration
   */
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  /**
   * Gap between grid items
   */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Horizontal gap
   */
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Vertical gap
   */
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Auto-fit columns with minimum width
   */
  autoFit?: boolean;
  /**
   * Minimum column width (for auto-fit)
   */
  minColWidth?: string;
  /**
   * Grid flow direction
   */
  flow?: 'row' | 'col' | 'row-dense' | 'col-dense';
  /**
   * Alignment
   */
  align?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Justify content
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
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

export interface GlassGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column span (1-12)
   */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
  /**
   * Row span
   */
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  /**
   * Responsive column span
   */
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
  };
  /**
   * Column start position
   */
  colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  /**
   * Column end position
   */
  colEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  /**
   * Row start position
   */
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'auto';
  /**
   * Row end position
   */
  rowEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'auto';
  /**
   * Item alignment
   */
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /**
   * Item justification
   */
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
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
 * GlassGrid component
 * Responsive CSS Grid layout with glassmorphism styling
 */
export const GlassGrid = forwardRef<HTMLDivElement, GlassGridProps>(
  (
    {
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      cols = 12,
      responsive,
      gap = 'md',
      gapX,
      gapY,
      autoFit = false,
      minColWidth = '250px',
      flow = 'row',
      align = 'stretch',
      justify = 'start',
      respectMotionPreference = true,
      'aria-label': ariaLabel,
      role,
      className,
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      none: 'glass-gap-0',
      xs: 'glass-gap-1',
      sm: 'glass-gap-2',
      md: 'glass-gap-4',
      lg: 'glass-gap-6',
      xl: 'gap-8',
      '2xl': 'glass-gap-12',
    };

    const gapXClasses = {
      none: 'gap-x-0',
      xs: 'gap-x-1',
      sm: 'gap-x-2',
      md: 'gap-x-4',
      lg: 'gap-x-6',
      xl: 'gap-x-8',
      '2xl': 'gap-x-12',
    };

    const gapYClasses = {
      none: 'gap-y-0',
      xs: 'gap-y-1',
      sm: 'gap-y-2',
      md: 'gap-y-4',
      lg: 'gap-y-6',
      xl: 'gap-y-8',
      '2xl': 'gap-y-12',
    };

    const colsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    };

    const flowClasses = {
      row: 'grid-flow-row',
      col: 'grid-flow-col',
      'row-dense': 'grid-flow-row-dense',
      'col-dense': 'grid-flow-col-dense',
    };

    const alignClasses = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      stretch: 'items-stretch',
    };

    const justifyClasses = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const responsiveClasses = responsive ? [
      responsive.sm && `sm:grid-cols-${responsive.sm}`,
      responsive.md && `md:grid-cols-${responsive.md}`,
      responsive.lg && `lg:grid-cols-${responsive.lg}`,
      responsive.xl && `xl:grid-cols-${responsive.xl}`,
      responsive['2xl'] && `2xl:grid-cols-${responsive['2xl']}`,
    ].filter(Boolean) : [];

    const gridStyle = autoFit ? {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}, 1fr))`,
    } : undefined;

    const gridId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion = respectMotionPreference && !prefersReducedMotion;

    const a11yProps = {
      ...(ariaLabel && { 'aria-label': ariaLabel, id: gridId }),
      ...(role && { role })
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          !autoFit && colsClasses[cols],
          gapX ? gapXClasses[gapX] : gapY ? gapYClasses[gapY] : gapClasses[gap],
          gapX && gapY && [gapXClasses[gapX], gapYClasses[gapY]],
          flowClasses[flow],
          alignClasses[align],
          justifyClasses[justify],
          // Motion preferences
          shouldRespectMotion && 'motion-safe:transition-all motion-reduce:transition-none',
          ...responsiveClasses,
          className
        )}
        style={gridStyle}
        {...a11yProps}
        {...props}
      />
    );
  }
);

GlassGrid.displayName = 'GlassGrid';

/**
 * GlassGridItem component
 * Grid item with responsive column/row spanning
 */
export const GlassGridItem = forwardRef<HTMLDivElement, GlassGridItemProps>(
  (
    {
      colSpan = 'auto',
      rowSpan = 'auto',
      responsive,
      colStart = 'auto',
      colEnd = 'auto',
      rowStart = 'auto',
      rowEnd = 'auto',
      alignSelf = 'auto',
      justifySelf = 'auto',
      respectMotionPreference = true,
      'aria-label': ariaLabel,
      role,
      className,
      ...props
    },
    ref
  ) => {
    const colSpanClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
      full: 'col-span-full',
      auto: 'col-auto',
    };

    const rowSpanClasses = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4',
      5: 'row-span-5',
      6: 'row-span-6',
      auto: 'row-auto',
    };

    const colStartClasses = {
      1: 'col-start-1',
      2: 'col-start-2',
      3: 'col-start-3',
      4: 'col-start-4',
      5: 'col-start-5',
      6: 'col-start-6',
      7: 'col-start-7',
      8: 'col-start-8',
      9: 'col-start-9',
      10: 'col-start-10',
      11: 'col-start-11',
      12: 'col-start-12',
      13: 'col-start-13',
      auto: 'col-start-auto',
    };

    const colEndClasses = {
      1: 'col-end-1',
      2: 'col-end-2',
      3: 'col-end-3',
      4: 'col-end-4',
      5: 'col-end-5',
      6: 'col-end-6',
      7: 'col-end-7',
      8: 'col-end-8',
      9: 'col-end-9',
      10: 'col-end-10',
      11: 'col-end-11',
      12: 'col-end-12',
      13: 'col-end-13',
      auto: 'col-end-auto',
    };

    const rowStartClasses = {
      1: 'row-start-1',
      2: 'row-start-2',
      3: 'row-start-3',
      4: 'row-start-4',
      5: 'row-start-5',
      6: 'row-start-6',
      7: 'row-start-7',
      auto: 'row-start-auto',
    };

    const rowEndClasses = {
      1: 'row-end-1',
      2: 'row-end-2',
      3: 'row-end-3',
      4: 'row-end-4',
      5: 'row-end-5',
      6: 'row-end-6',
      7: 'row-end-7',
      auto: 'row-end-auto',
    };

    const alignSelfClasses = {
      auto: 'self-auto',
      start: 'self-start',
      end: 'self-end',
      center: 'self-center',
      stretch: 'self-stretch',
    };

    const justifySelfClasses = {
      auto: 'justify-self-auto',
      start: 'justify-self-start',
      end: 'justify-self-end',
      center: 'justify-self-center',
      stretch: 'justify-self-stretch',
    };

    const responsiveClasses = responsive ? [
      responsive.sm && `sm:${colSpanClasses[responsive.sm]}`,
      responsive.md && `md:${colSpanClasses[responsive.md]}`,
      responsive.lg && `lg:${colSpanClasses[responsive.lg]}`,
      responsive.xl && `xl:${colSpanClasses[responsive.xl]}`,
      responsive['2xl'] && `2xl:${colSpanClasses[responsive['2xl']]}`,
    ].filter(Boolean) : [];

    const itemId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion = respectMotionPreference && !prefersReducedMotion;

    const a11yProps = {
      ...(ariaLabel && { 'aria-label': ariaLabel, id: itemId }),
      ...(role && { role })
    };

    return (
      <div
        ref={ref}
        className={cn(
          colSpanClasses[colSpan],
          rowSpanClasses[rowSpan],
          colStartClasses[colStart],
          colEndClasses[colEnd],
          rowStartClasses[rowStart],
          rowEndClasses[rowEnd],
          alignSelfClasses[alignSelf],
          justifySelfClasses[justifySelf],
          // Motion preferences
          shouldRespectMotion && 'motion-safe:transition-all motion-reduce:transition-none',
          ...responsiveClasses,
          className
        )}
        {...a11yProps}
        {...props}
      />
    );
  }
);

GlassGridItem.displayName = 'GlassGridItem';
