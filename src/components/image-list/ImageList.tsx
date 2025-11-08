'use client';
/**
 * Glass ImageList Component
 *
 * A grid of images with glass morphism styling.
 */
import React, { forwardRef, createContext, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { cn } from '@/lib/utils';

// Animation sequence hook removed for simplicity

// Hook for reduced motion
import { useReducedMotion } from '../../hooks/useReducedMotion';

import { createThemeContext } from '../../core/themeContext';
import { createGlassStyle } from '../../core/mixins/glassMixins';

// Import types (assuming types.ts is updated)
import { ImageListProps } from './types'; 

// Create ImageList context
export interface ImageListContextProps {
  variant: 'standard' | 'quilted' | 'masonry' | 'woven';
  rowHeight: number | 'auto';
  gap: number;
  cols: number;
  glass: boolean;
  variableSize: boolean;
  glassRadiusMd: boolean;
}

export const ImageListContext = createContext<ImageListContextProps>({
  variant: 'standard',
  rowHeight: 'auto',
  gap: 8,
  cols: 2,
  glass: false,
  variableSize: false,
  glassRadiusMd: false,
});

// Styled components
const ImageListRoot = styled.ul<{
  $variant: 'standard' | 'quilted' | 'masonry' | 'woven';
  $rowHeight: number | 'auto';
  $gap: number;
  $cols: number;
  $glass: boolean;
  $glassRadiusMd: boolean;
}>`
  display: grid;
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;

  /* Standard, quilted, and woven variants use CSS grid */
  ${props =>
    props.$variant !== 'masonry' &&
    `
    grid-template-columns: repeat(${props.$cols}, 1fr);
    gap: ${props.$gap}px;
    
    ${
      props.$variant === 'standard' &&
      `
      grid-auto-rows: ${typeof props.$rowHeight === 'number' ? `${props.$rowHeight}px` : 'auto'};
    `
    }
    
    ${
      props.$variant === 'quilted' &&
      `
      /* Quilted layout has more complex sizing handled by the items */
    `
    }
    
    ${
      props.$variant === 'woven' &&
      `
      /* Woven layout alternates items */
    `
    }
  `}

  /* Masonry variant uses column-count */
  ${props =>
    props.$variant === 'masonry' &&
    `
    column-count: ${props.$cols};
    column-gap: ${props.$gap}px;
    
    & > li {
      margin-bottom: ${props.$gap}px;
      break-inside: avoid;
    }
  `}
  
  /* Glass styling */
  ${props => {
    if (!props.$glass) return '';

    const glassStyles = createGlassStyle({
      intent: 'neutral',
      elevation: 'level1',
      tier: 'high'
    });

    return `
      background: ${glassStyles.background};
      backdrop-filter: ${glassStyles.backdropFilter};
      -webkit-backdrop-filter: ${glassStyles.WebkitBackdropFilter};
      border: ${glassStyles.border};
      border-radius: ${glassStyles.borderRadius};
      box-shadow: var(--glass-elev-2);
      color: ${glassStyles.color};
      transition: ${glassStyles.transition};
      position: ${glassStyles.position};
      transform: ${glassStyles.transform};
    `;
  }}
  
  /* Glass styling */
  ${props =>
    props.$glass &&
    `
    background: var(--glass-bg-default);
    padding: ${props.$gap}px;
  `}

  /* Rounded corners */
  ${props =>
    props.$glassRadiusMd &&
    `
    border-radius: 12px;
    overflow: hidden;
  `}
`;

/**
 * ImageList Component Implementation
 */
function ImageListComponent(props: ImageListProps, ref: React.ForwardedRef<HTMLUListElement>) {
  const {
    children,
    className,
    style,
    cols = 2,
    gap = 8,
    rowHeight = 'auto',
    variant = 'standard',
    glass = false,
    glassRadiusMd = false,
    variableSize = false,
    enableEntranceAnimation = true,
    animationConfig,
    disableAnimation,
    motionSensitivity,
    ...rest
  } = props;

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Ref for the root ul element
  const rootRef = useRef<HTMLUListElement>(null);

  // Assign forwarded ref to internal ref if provided
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(rootRef.current);
    } else {
      ref.current = rootRef.current;
    }
  }, [ref]);

  // Create context value
  const contextValue = useMemo<ImageListContextProps>(
    () => ({
      variant,
      rowHeight,
      gap,
      cols,
      glass,
      variableSize,
      glassRadiusMd,
    }),
    [
      variant, rowHeight, gap, cols, glass, variableSize, glassRadiusMd
    ]
  );

  return (
    <ImageListContext.Provider value={contextValue}>
      <ImageListRoot
        ref={rootRef}
        className={className}
        style={style}
        $variant={variant}
        $rowHeight={rowHeight}
        $gap={gap}
        $cols={cols}
        $glass={glass}
        $glassRadiusMd={glassRadiusMd}
        {...rest}
      >
        {/* Ensure children (ImageListItem) have the class name */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
            // Clone element, merging className
            return React.cloneElement(child, {
              className: `${child.props?.className || ''} galileo-image-list-item`,
            });
          }
          return child;
        })}
      </ImageListRoot>
    </ImageListContext.Provider>
  );
}

/**
 * ImageList Component
 *
 * A grid of images.
 */
const ImageList = forwardRef<HTMLUListElement, ImageListProps>(ImageListComponent);

/**
 * GlassImageList Component
 *
 * Glass variant of the ImageList component.
 */
const GlassImageList = forwardRef<HTMLUListElement, ImageListProps>((props, ref) => (
  <ImageList {...props} glass={true} ref={ref} />
));

GlassImageList.displayName = 'GlassImageList';

export default ImageList;
export { ImageList, GlassImageList };
