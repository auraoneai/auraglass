'use client';
/**
 * Glass ImageList Component
 *
 * A grid of images with glass morphism styling.
 */
import React, { forwardRef, createContext, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

import { ImageListProps } from './types'; 
import styles from './ImageList.module.css';

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

  const styleVars = useMemo<React.CSSProperties>(() => {
    const normalizedCols = Math.max(1, cols);
    const gapValue = `${gap}px`;
    const rowHeightValue = typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight;

    return {
      '--image-list-gap': gapValue,
      '--image-list-cols': String(normalizedCols),
      '--image-list-row-height': rowHeightValue === undefined ? 'auto' : rowHeightValue,
      '--image-list-padding': glass ? gapValue : '0px',
    } as React.CSSProperties;
  }, [cols, gap, rowHeight, glass]);

  const rootClassName = cn(
    styles.root,
    variant === 'masonry' ? styles.masonry : styles.grid,
    variant === 'standard' && styles.variantStandard,
    variant === 'quilted' && styles.variantQuilted,
    variant === 'woven' && styles.variantWoven,
    glass && styles.glass,
    glassRadiusMd && styles.radiusMd,
    className
  );

  return (
    <ImageListContext.Provider value={contextValue}>
      <ul
        ref={rootRef}
        className={rootClassName}
        style={{ ...style, ...styleVars }}
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
      </ul>
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
