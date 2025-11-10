'use client';
/**
 * ImageListItem Component
 *
 * An item component for the ImageList with glass morphism styling.
 * Features comprehensive accessibility support including ARIA labels,
 * keyboard navigation, and screen reader announcements.
 */
import React, { forwardRef, useContext, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ImageListItemProps } from './types';
import { ImageListContext } from './ImageList';
import styles from './ImageListItem.module.css';

const elevationClassMap: Record<string, string | undefined> = {
  level1: styles.elevationLevel1,
  level2: styles.elevationLevel2,
  level3: styles.elevationLevel3,
  level4: styles.elevationLevel4,
};

/**
 * ImageListItem Component Implementation
 */
function ImageListItemComponent(props: ImageListItemProps, ref: React.ForwardedRef<HTMLLIElement>) {
  const {
    children,
    className,
    style,
    cols: propCols,
    rows: propRows,
    glass: propGlass,
    hoverOverlay = false,
    elevation = 0,
    rounded: propRounded,
    alt,
    src,
    srcSet,
    onClick,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    role,
    ...rest
  } = props;

  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();

  const context = useContext(ImageListContext);
  const variant = context?.variant ?? 'standard';
  const contextGlass = context?.glass ?? false;
  const variableSize = context?.variableSize ?? false;
  const contextRounded = context?.glassRadiusMd ?? false;

  // Calculate cols and rows based on variableSize
  const cols =
    propCols !== undefined
      ? propCols
      : // If variable size is enabled, allow items to span multiple columns/rows
      // Otherwise, enforce single-cell items
      variableSize
      ? 1
      : 1;
  const rows = propRows !== undefined ? propRows : variableSize ? 1 : 1;

  // Merge props with context
  const glass = propGlass !== undefined ? propGlass : contextGlass;
  const glassRadiusMd = propRounded !== undefined ? propRounded : contextRounded;

  // Simplified animation settings
  const finalDisableAnimation = prefersReducedMotion;

  // State for hover and focus
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Accessibility handlers
  const handleClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(event);
  }, [onClick]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLLIElement>) => {
    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick(event as any);
      }
    }
    // Pass through any custom key handling
    onKeyDown?.(event);
  }, [onClick, onKeyDown]);
  
  // Generate accessible description
  const accessibleDescription = useMemo(() => {
    if (alt) return alt;
    if (ariaLabel) return ariaLabel;
    return 'Image in gallery';
  }, [alt, ariaLabel]);
  
  // Determine if this item is interactive
  const isInteractive = Boolean(onClick);
  
  // Generate ARIA attributes
  const ariaAttributes = useMemo(() => {
    const attributes: Record<string, any> = {};
    
    if (isInteractive) {
      attributes.role = role || 'button';
      attributes['aria-label'] = ariaLabel || accessibleDescription;
      if (ariaDescribedBy) {
        attributes['aria-describedby'] = ariaDescribedBy;
      }
    } else {
      attributes.role = role || 'listitem';
      attributes['aria-label'] = ariaLabel || accessibleDescription;
    }
    
    // Add state information
    if (hoverOverlay && (isHovered || isFocused)) {
      attributes['aria-expanded'] = 'true';
    }
    
    return attributes;
  }, [role, ariaLabel, ariaDescribedBy, accessibleDescription, isInteractive, hoverOverlay, isHovered, isFocused]);

  // Prepare image element if src is provided with enhanced accessibility
  const image = src ? (
    <img 
      src={src} 
      srcSet={srcSet} 
      alt={alt || accessibleDescription} 
      loading="lazy" 
      role={alt ? undefined : 'presentation'}
      {...rest} 
    />
  ) : null;

  const itemStyle = useMemo<React.CSSProperties>(() => {
    const styleVars: React.CSSProperties = {
      '--image-item-col-span': String(Math.max(1, cols)),
      '--image-item-row-span': String(Math.max(1, rows)),
      '--image-item-scale': (!finalDisableAnimation && (isHovered || isFocused) ? 1.03 : 1).toString(),
    } as React.CSSProperties;

    if (finalDisableAnimation) {
      styleVars.transition = 'none';
    }

    return { ...style, ...styleVars };
  }, [cols, rows, finalDisableAnimation, isHovered, isFocused, style]);

  const elevationClass = useMemo(() => {
    if (glass) return undefined;
    if (typeof elevation === 'string') {
      return elevationClassMap[elevation];
    }
    return undefined;
  }, [glass, elevation]);

  const rootClassName = cn(
    styles.item,
    glass && styles.glass,
    glassRadiusMd && styles.rounded,
    variant === 'masonry' && styles.masonryItem,
    isInteractive && styles.clickable,
    elevationClass,
    'galileo-image-list-item',
    className
  );

  const overlayClassName = cn(
    styles.overlay,
    (isHovered || isFocused) && styles.overlayVisible,
    finalDisableAnimation && styles.noTransition
  );

  return (
    <li
      ref={ref}
      className={rootClassName}
      style={itemStyle}
      tabIndex={isInteractive ? 0 : -1}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}
      onFocus={() => { setIsFocused(true); }}
      onBlur={() => { setIsFocused(false); }}
      {...ariaAttributes}
    >
      <div className={styles.media}>
        {image}
        {children}

        {hoverOverlay && (
          <div className={overlayClassName} aria-hidden="true" />
        )}
      </div>
    </li>
  );
}

/**
 * ImageListItem Component
 *
 * An item component for the ImageList.
 */
const ImageListItem = forwardRef<HTMLLIElement, ImageListItemProps>(ImageListItemComponent);

/**
 * GlassImageListItem Component
 *
 * Glass variant of the ImageListItem component.
 */
const GlassImageListItem = forwardRef<HTMLLIElement, ImageListItemProps>((props, ref) => (
  <ImageListItem {...props} glass={true} ref={ref} />
));

GlassImageListItem.displayName = 'GlassImageListItem';

export default ImageListItem;
export { ImageListItem, GlassImageListItem };
