'use client';
/**
 * ImageListItemBar Component
 *
 * A title bar for an ImageListItem with glass morphism styling.
 */
// Typography tokens available via typography.css (imported in index.css)
import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../../hooks/useReducedMotion';

import { ImageListItemBarProps } from './types';
import styles from './ImageListItemBar.module.css';

/**
 * ImageListItemBar Component Implementation
 */
function ImageListItemBarComponent(
  props: ImageListItemBarProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    children,
    className,
    style,
    title,
    subtitle,
    position = 'bottom',
    glass = false,
    actionIcon,
    actionPosition = 'right',
    showOnHover = false,
    ...rest
  } = props;

  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();

  // State for hover
  const [isHovered, setIsHovered] = useState(false);

  const rootClassName = cn(
    styles.root,
    position === 'top' && styles.positionTop,
    position === 'bottom' && styles.positionBottom,
    position === 'below' && styles.positionBelow,
    glass && styles.glass,
    actionPosition === 'left' && styles.actionLeft,
    showOnHover && styles.showOnHover,
    showOnHover && (isHovered || prefersReducedMotion) && styles.visible,
    prefersReducedMotion && styles.noTransition,
    className
  );

  const actionClassName = cn(
    styles.action,
    actionPosition === 'left' && styles.actionLeftAction
  );

  return (
    <div
      ref={ref}
      className={rootClassName}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      <div className={styles.titleWrapper}>
        {title && <div className={styles.title}>{title}</div>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      {actionIcon && (
        <div className={actionClassName}>{actionIcon}</div>
      )}

      {children}
    </div>
  );
}

/**
 * ImageListItemBar Component
 *
 * A title bar for an ImageListItem.
 */
const ImageListItemBar = forwardRef(ImageListItemBarComponent);

/**
 * GlassImageListItemBar Component
 *
 * Glass variant of the ImageListItemBar component.
 */
const GlassImageListItemBar = forwardRef<HTMLDivElement, ImageListItemBarProps>((props, ref) => (
  <ImageListItemBar {...props} glass={true} ref={ref} />
));

GlassImageListItemBar.displayName = 'GlassImageListItemBar';

export default ImageListItemBar;
export { ImageListItemBar, GlassImageListItemBar };
