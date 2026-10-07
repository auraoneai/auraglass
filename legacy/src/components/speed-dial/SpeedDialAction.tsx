'use client';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

import { SpeedDialActionProps } from './types';
import styles from './SpeedDialAction.module.css';

// Calculate the position based on direction
const getPosition = (
  direction: 'up' | 'down' | 'left' | 'right',
  index: number,
  totalActions: number,
  size: 'small' | 'medium' | 'large'
): { top?: string; right?: string; bottom?: string; left?: string } => {
  // Base spacing between buttons
  const spacing = size === 'small' ? 40 : size === 'large' ? 65 : 55;
  const offset = (index + 1) * spacing;

  switch (direction) {
    case 'up':
      return { bottom: `${offset}px` };
    case 'down':
      return { top: `${offset}px` };
    case 'left':
      return { right: `${offset}px` };
    case 'right':
      return { left: `${offset}px` };
    default:
      return { top: `${offset}px` };
  }
};

const getTransitionDelay = (index: number, totalActions: number, opening: boolean): string => {
  if (!opening) {
    return `${(totalActions - 1 - index) * 30}ms`;
  }
  return `${index * 30}ms`;
};

const SpeedDialActionComponent = (
  props: SpeedDialActionProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    className,
    style,
    icon,
    tooltipTitle,
    tooltip,
    disabled = false,
    onClick,
    glass = false,
    index = 0,
    totalActions = 1,
    direction = 'up',
    transition = true,
    showTooltip = true,
    size = 'medium',
    open = false,
    'data-testid': dataTestId,
    children,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const positionStyle = useMemo(() => getPosition(direction, index, totalActions, size), [
    direction,
    index,
    totalActions,
    size,
  ]);

  const transitionDelay = useMemo(
    () => (transition ? getTransitionDelay(index, totalActions, open) : '0ms'),
    [index, totalActions, open, transition]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (!disabled) {
        onClick?.(event);
      }
    },
    [disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    },
    [disabled, onClick]
  );

  const tooltipContent = tooltipTitle ?? tooltip;
  // Use children, tooltipContent, or aria-label as accessible name
  const accessibleName = ariaLabel ?? (typeof children === 'string' ? children : tooltipContent);

  const actionClassName = cn(
    styles.action,
    glass ? styles.actionGlass : styles.actionSolid,
    size === 'small' && styles.sizeSmall,
    size === 'medium' && styles.sizeMedium,
    size === 'large' && styles.sizeLarge,
    !open && direction === 'up' && styles.hiddenUp,
    !open && direction === 'down' && styles.hiddenDown,
    !open && direction === 'left' && styles.hiddenLeft,
    !open && direction === 'right' && styles.hiddenRight,
    disabled && styles.actionDisabled,
    !transition && styles.actionNoTransition,
    className,
  );

  const tooltipClassName = cn(
    styles.tooltip,
    direction === 'up' && styles.tooltipUp,
    direction === 'down' && styles.tooltipDown,
    direction === 'left' && styles.tooltipLeft,
    direction === 'right' && styles.tooltipRight,
    open && showTooltip && tooltipContent && styles.tooltipVisible,
  );

  return (
    <div
      ref={ref}
      className={cn('glass-speed-dial-action', actionClassName)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={accessibleName}
      data-testid={dataTestId || 'speeddialaction'}
      style={{
        ...positionStyle,
        transitionDelay,
        ...(style ?? {}),
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {icon}
      {children && typeof children !== 'string' && children}
      {tooltipContent && (
        <div className={tooltipClassName}>{tooltipContent}</div>
      )}
    </div>
  );
};

const SpeedDialAction = forwardRef(SpeedDialActionComponent);
SpeedDialAction.displayName = 'SpeedDialAction';

export default SpeedDialAction;
