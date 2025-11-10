'use client';
/**
 * TreeItem Component
 *
 * A item component for the TreeView.
 */
import React, { forwardRef, useContext, useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAnimationContext } from '../../contexts/AnimationContext';
import { SpringConfig, SpringPresets } from '../../animations/physics/springPhysics';
import { TreeViewContext } from './TreeView';
import styles from './TreeItem.module.css';

// TreeItem props interface
interface TreeItemProps extends React.HTMLAttributes<HTMLLIElement> {
  nodeId: string;
  label: string;
  children?: React.ReactNode;
  glass?: boolean;
  color?: string;
  icon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  animationConfig?: any;
  disableAnimation?: boolean;
  motionSensitivity?: number;
}

// Default icons
const DefaultExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
  </svg>
);

const DefaultCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor" />
  </svg>
);

const DefaultEndIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

/**
 * TreeItem Component Implementation
 */
function TreeItemComponent(props: TreeItemProps, ref: React.ForwardedRef<HTMLLIElement>) {
  const {
    nodeId,
    label,
    children,
    className,
    style,
    glass: propGlass,
    color,
    icon,
    expandIcon,
    collapseIcon,
    endIcon,
    disabled = false,
    animationConfig,
    disableAnimation,
    motionSensitivity,
    ...rest
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const { defaultSpring } = useAnimationContext();
  const finalDisableAnimation = disableAnimation ?? prefersReducedMotion;

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLUListElement>(null);

  // Get TreeView context
  const treeContext = useContext(TreeViewContext);

  if (!treeContext) {
    throw new Error('TreeItem must be used within a TreeView');
  }

  const {
    expanded,
    selected,
    focused,
    size,
    disabled: contextDisabled,
    glass: contextGlass,
    selectNode,
    toggleNode,
    focusNode,
  } = treeContext;

  // Merge props with context
  const finalGlass = propGlass !== undefined ? propGlass : contextGlass;
  const finalDisabled = disabled || contextDisabled;

  // Check if the node has children
  const hasChildren = React.Children.count(children) > 0;

  // Check if the node is expanded
  const isExpanded = hasChildren && expanded.includes(nodeId);

  // Check if the node is selected
  const isSelected = selected.includes(nodeId);

  // Check if the node is focused
  const isFocused = focused.includes(nodeId);

  // Animation Context and Config Calculation
  const finalSpringConfig = useMemo(() => {
    const baseConfig: SpringConfig = SpringPresets.default;
    let contextConfig: Partial<SpringConfig> = {};
    if (typeof defaultSpring === 'string' && defaultSpring in SpringPresets) {
      contextConfig = SpringPresets[defaultSpring as keyof typeof SpringPresets];
    } else if (typeof defaultSpring === 'object') {
      contextConfig = defaultSpring ?? {};
    }

    let propConfig: Partial<SpringConfig> = {};
    const propSource = animationConfig;
    if (typeof propSource === 'string' && propSource in SpringPresets) {
      propConfig = SpringPresets[propSource as keyof typeof SpringPresets];
    } else if (typeof propSource === 'object') {
      propConfig = propSource ?? {};
    }

    // Return merged config
    return { ...baseConfig, ...contextConfig, ...propConfig };

  }, [defaultSpring, animationConfig]);

  // State for measuring height
  const [measuredHeight, setMeasuredHeight] = useState<number | 'auto'>('auto');

  // UseLayoutEffect to measure height before animation
  useLayoutEffect(() => {
    let rafId: number | null = null;
    if (isExpanded && childrenRef.current) {
      // Use requestAnimationFrame to defer measurement slightly
      rafId = requestAnimationFrame(() => {
        if (childrenRef.current) { // Check ref again inside RAF
          const height = childrenRef.current.scrollHeight;
          setMeasuredHeight(height);
        }
      });
    } else {
        // Set to 0 when collapsed or no children
        setMeasuredHeight(0);
    }

    // Cleanup RAF on effect change or unmount
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isExpanded, children]); // Rerun when expansion state or children change

  // Define spring targets using useMemo
  const animationTargets = useMemo(() => ({
      // Use measuredHeight, ensuring it's a number for the spring
      height: isExpanded && typeof measuredHeight === 'number' ? measuredHeight : 0,
      opacity: isExpanded ? 1 : 0,
  }), [isExpanded, measuredHeight]);

  // Simple animation style calculation
  const animatedStyle = finalDisableAnimation ? {
    height: animationTargets.height,
    opacity: animationTargets.opacity,
    transform: isExpanded ? 'perspective(800px) rotateX(0deg)' : 'perspective(800px) rotateX(-5deg)',
    transformOrigin: 'top',
  } : {
    height: animationTargets.height,
    opacity: animationTargets.opacity,
    transform: isExpanded ? 'perspective(800px) rotateX(0deg)' : 'perspective(800px) rotateX(-5deg)',
    transformOrigin: 'top',
    transition: 'height 0.3s ease, opacity 0.3s ease, transform 0.28s ease',
  };

  // Handle click event
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    // Select the node
    if (!finalDisabled && selectNode) {
      selectNode(nodeId);
    }
  };

  // Handle expand/collapse
  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    // Toggle the node
    if (!finalDisabled && hasChildren && toggleNode) {
      toggleNode(nodeId);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (finalDisabled) return;

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (selectNode) {
          selectNode(nodeId);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (hasChildren && !isExpanded && toggleNode) {
          toggleNode(nodeId);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (hasChildren && isExpanded && toggleNode) {
          toggleNode(nodeId);
        }
        break;
      default:
        break;
    }
  };

  // Handle focus
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!finalDisabled && focusNode) {
      focusNode(nodeId);
    }
  };

  // Determine which icon to show
  const renderToggleIcon = () => {
    if (!hasChildren) {
      return endIcon || <DefaultEndIcon />;
    }

    if (isExpanded) {
      return collapseIcon || <DefaultCollapseIcon />;
    }

    return expandIcon || <DefaultExpandIcon />;
  };

  const sizeClass =
    (size === 'small' && styles.sizeSmall) ||
    (size === 'large' && styles.sizeLarge) ||
    styles.sizeMedium;

  const contentClassName = cn(
    styles.content,
    sizeClass,
    finalGlass && styles.glass,
    finalDisabled && styles.disabled,
    isSelected && styles.selected,
    isFocused && styles.focused,
    'glass-focus glass-touch-target glass-contrast-guard'
  );

  const toggleIconClass = cn(styles.icon, hasChildren && styles.toggleIcon, hasChildren && 'glass-focus glass-touch-target');
  const iconClass = cn(styles.icon);
  const labelClass = styles.label;
  const rootClass = cn(styles.root, className);

  const itemStyleVars: React.CSSProperties | undefined = color
    ? ({ '--tree-view-color': color } as React.CSSProperties)
    : undefined;

  return (
    <li
      ref={ref}
      className={rootClass}
      style={style}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      {...rest}
    >
      <div
        ref={contentRef}
        onClick={handleClick}
        onDoubleClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        tabIndex={finalDisabled ? -1 : 0}
        aria-disabled={finalDisabled}
        className={contentClassName}
        style={itemStyleVars}
      >
        <div
          onClick={hasChildren ? handleToggle : undefined}
          className={toggleIconClass}
          role={hasChildren ? 'button' : undefined}
          aria-hidden={!hasChildren}
        >
          {renderToggleIcon()}
        </div>

        {icon && <div className={iconClass}>{icon}</div>}

        <div className={labelClass}>{label}</div>
      </div>

      {hasChildren && (
        <ul
          ref={childrenRef}
          role="group"
          key={`children-${nodeId}`}
          className={styles.children}
          style={{
            ...animatedStyle,
            willChange: 'height, opacity, transform',
          }}
        >
          {children}
        </ul>
      )}
    </li>
  );
}

/**
 * TreeItem Component
 *
 * A item component for the TreeView.
 */
const TreeItem = forwardRef(TreeItemComponent);

/**
 * GlassTreeItem Component
 *
 * Glass variant of the TreeItem component.
 */
const GlassTreeItem = forwardRef<HTMLLIElement, TreeItemProps>((props, ref) => (
  <TreeItem {...props} glass={true} ref={ref} />
));

GlassTreeItem.displayName = 'GlassTreeItem';

export default TreeItem;
export { TreeItem, GlassTreeItem };
