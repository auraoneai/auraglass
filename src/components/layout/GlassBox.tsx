import React, { forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

// Box props interface
export interface BoxProps {
  /**
   * The content of the box
   */
  children?: React.ReactNode;

  /**
   * The component to render the box as
   */
  component?: React.ElementType;

  /**
   * Display property
   */
  display?:
    | 'block'
    | 'flex'
    | 'inline'
    | 'inline-block'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid'
    | 'none';

  /**
   * Flex direction
   */
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

  /**
   * Flex wrap
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /**
   * Justify content
   */
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';

  /**
   * Align items
   */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

  /**
   * Align content
   */
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';

  /**
   * Align self
   */
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

  /**
   * Padding
   */
  p?: number | string;
  pt?: number | string;
  pr?: number | string;
  pb?: number | string;
  pl?: number | string;
  px?: number | string;
  py?: number | string;

  /**
   * Margin
   */
  m?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
  mx?: number | string;
  my?: number | string;

  /**
   * Width
   */
  width?: number | string;

  /**
   * Height
   */
  height?: number | string;

  /**
   * Min width
   */
  minWidth?: number | string;

  /**
   * Min height
   */
  minHeight?: number | string;

  /**
   * Max width
   */
  maxWidth?: number | string;

  /**
   * Max height
   */
  maxHeight?: number | string;

  /**
   * Border radius
   */
  borderRadius?: number | string;

  /**
   * Background color
   */
  bgcolor?: string;

  /**
   * If true, the box will have a glass effect
   */
  glass?: boolean;

  /**
   * The elevation of the glass effect
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 'level1' | 'level2' | 'level3' | 'level4';

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Additional CSS styles
   */
  style?: React.CSSProperties;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// Function to format spacing values
const formatSpacing = (value: number | string | undefined): string => {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return `${value * 8}px`;
};

// Helper function to convert spacing to Tailwind class
const spacingToTailwind = (value: number | string | undefined, prefix: string): string => {
  if (value === undefined) return '';
  if (typeof value === 'string') return `${prefix}-[${value}]`;
  // Map 8px units to Tailwind spacing scale
  const spacing = Math.round(value);
  if (spacing === 0) return `${prefix}-0`;
  if (spacing <= 1) return `${prefix}-1`;
  if (spacing <= 2) return `${prefix}-2`;
  if (spacing <= 3) return `${prefix}-3`;
  if (spacing <= 4) return `${prefix}-4`;
  if (spacing <= 6) return `${prefix}-6`;
  if (spacing <= 8) return `${prefix}-8`;
  return `${prefix}-[${spacing * 8}px]`;
};

/**
 * Box Component
 *
 * A flexible container with system props for layout and styling.
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const {
    children,
    component: Component = 'div',
    display,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    alignContent,
    alignSelf,
    p,
    pt,
    pr,
    pb,
    pl,
    px,
    py,
    m,
    mt,
    mr,
    mb,
    ml,
    mx,
    my,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    borderRadius,
    bgcolor,
    glass = false,
    elevation = 'level1',
    className,
    style,
    onClick,
    ...rest
  } = props;

  // Build dynamic classes
  const displayClasses = {
    block: 'block',
    flex: 'flex',
    inline: 'inline',
    'inline-block': 'inline-block',
    'inline-flex': 'inline-flex',
    grid: 'grid',
    'inline-grid': 'inline-grid',
    none: 'hidden'
  };

  const flexDirectionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse'
  };

  const flexWrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  const justifyContentClasses = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    center: 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  };

  const alignItemsClasses = {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const alignContentClasses = {
    'flex-start': 'content-start',
    'flex-end': 'content-end',
    center: 'content-center',
    'space-between': 'content-between',
    'space-around': 'content-around',
    stretch: 'content-stretch'
  };

  const alignSelfClasses = {
    auto: 'self-auto',
    'flex-start': 'self-start',
    'flex-end': 'self-end',
    center: 'self-center',
    baseline: 'self-baseline',
    stretch: 'self-stretch'
  };

  const combinedClassName = cn(
    'box-border',
    display && displayClasses[display],
    flexDirection && flexDirectionClasses[flexDirection],
    flexWrap && flexWrapClasses[flexWrap],
    justifyContent && justifyContentClasses[justifyContent],
    alignItems && alignItemsClasses[alignItems],
    alignContent && alignContentClasses[alignContent],
    alignSelf && alignSelfClasses[alignSelf],
    // Padding
    p !== undefined && spacingToTailwind(p, 'p'),
    pt !== undefined && spacingToTailwind(pt, 'pt'),
    pr !== undefined && spacingToTailwind(pr, 'pr'),
    pb !== undefined && spacingToTailwind(pb, 'pb'),
    pl !== undefined && spacingToTailwind(pl, 'pl'),
    px !== undefined && spacingToTailwind(px, 'px'),
    py !== undefined && spacingToTailwind(py, 'py'),
    // Margin
    m !== undefined && spacingToTailwind(m, 'm'),
    mt !== undefined && spacingToTailwind(mt, 'mt'),
    mr !== undefined && spacingToTailwind(mr, 'mr'),
    mb !== undefined && spacingToTailwind(mb, 'mb'),
    ml !== undefined && spacingToTailwind(ml, 'ml'),
    mx !== undefined && spacingToTailwind(mx, 'mx'),
    my !== undefined && spacingToTailwind(my, 'my'),
    className
  );

  const combinedStyle = {
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
    ...(minWidth !== undefined && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
    ...(minHeight !== undefined && { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }),
    ...(maxWidth !== undefined && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
    ...(maxHeight !== undefined && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
    ...(borderRadius !== undefined && { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius }),
    ...(bgcolor && { backgroundColor: bgcolor }),
    ...style
  };

  if (glass) {
    // Map elevation to OptimizedGlass elevation
    const getElevationLevel = (elev: any) => {
      if (typeof elev === 'string' && elev.startsWith('level')) {
        return elev as 'level1' | 'level2' | 'level3' | 'level4';
      }
      const numElev = typeof elev === 'number' ? elev : 1;
      if (numElev <= 1) return 'level1';
      if (numElev <= 2) return 'level2';
      if (numElev <= 3) return 'level3';
      return 'level4';
    };

    return (
      <OptimizedGlass data-glass-component
        ref={ref}
        intent="neutral"
        elevation={getElevationLevel(elevation)}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={combinedClassName}
        style={combinedStyle}
        onClick={onClick}
        {...rest}
      >
        {children}
      </OptimizedGlass>
    );
  }

  return React.createElement(
    Component,
    {
      ref,
      className: cn(
        combinedClassName,
        // Motion preferences - temporarily disabled
        // shouldRespectMotion && 'motion-safe:transition-all motion-reduce:transition-none'
      ),
      style: combinedStyle,
      onClick,
      ...(rest as any)
    } as any,
    children
  );
});

Box.displayName = 'Box';

/**
 * GlassBox Component
 *
 * A box component with glass morphism styling.
 */
export const GlassBox = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

  const {
    glass = true,
    elevation = 'level2',
    borderRadius = 8,
    className,
    ...rest
  } = props;

  return (
    <Box
      ref={ref}
      glass={glass}
      elevation={elevation}
      borderRadius={borderRadius}
      className={cn('glass-box', className)}
      {...rest}
    />
  );
});

GlassBox.displayName = 'GlassBox';