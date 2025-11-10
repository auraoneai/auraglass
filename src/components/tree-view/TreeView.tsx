'use client';
/**
 * Glass TreeView Component
 *
 * A hierarchical list with collapsible items.
 */
import React, { forwardRef, useState, useCallback, useMemo, createContext } from 'react';
import { cn } from '@/lib/utils';

import { TreeViewProps, TreeViewContextProps } from './types';
import styles from './TreeView.module.css';

const TREE_COLOR_MAP: Record<NonNullable<TreeViewProps['color']>, { accent: string; highlight: string }> = {
  default: { accent: 'rgba(248, 250, 252, 0.9)', highlight: 'rgba(99, 102, 241, 0.14)' },
  primary: { accent: 'rgba(99, 102, 241, 0.9)', highlight: 'rgba(99, 102, 241, 0.18)' },
  secondary: { accent: 'rgba(156, 39, 176, 0.9)', highlight: 'rgba(156, 39, 176, 0.16)' },
  success: { accent: 'rgba(34, 197, 94, 0.9)', highlight: 'rgba(34, 197, 94, 0.18)' },
  warning: { accent: 'rgba(251, 191, 36, 0.9)', highlight: 'rgba(251, 191, 36, 0.18)' },
  danger: { accent: 'rgba(239, 68, 68, 0.9)', highlight: 'rgba(239, 68, 68, 0.18)' },
  info: { accent: 'rgba(14, 165, 233, 0.9)', highlight: 'rgba(14, 165, 233, 0.18)' },
};

// Create context for TreeView state
export const TreeViewContext = createContext<TreeViewContextProps | null>(null);

/**
 * TreeView Component Implementation
 */
function TreeViewComponent(props: TreeViewProps, ref: React.ForwardedRef<HTMLUListElement>) {
  const {
    selectedIds,
    expandedIds,
    onSelectionChange,
    onExpansionChange,
    multiSelect = false,
    showIcons = false,
    showLines = false,
    size = 'medium',
    disabled = false,
    glass = true,
    color = 'default',
    children,
    className,
    style,
    ...rest
  } = props;

  // State for uncontrolled component
  const [internalExpanded, setInternalExpanded] = useState<string[]>(expandedIds || []);
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedIds || []);
  const [internalFocused, setInternalFocused] = useState<string | null>(null);

  // Determine if component is controlled
  const isExpandedControlled = expandedIds !== undefined;
  const isSelectedControlled = selectedIds !== undefined;

  // Get values based on controlled/uncontrolled state
  const expanded = isExpandedControlled ? expandedIds : internalExpanded;
  const selected = isSelectedControlled ? selectedIds : internalSelected;

  const currentExpanded = expanded ?? [];
  const currentSelected = selected ?? [];
  const focusedIds = internalFocused ? [internalFocused] : [];

  // Toggle node expansion
  const toggleNode = useCallback(
    (nodeId: string) => {
      const isOpen = currentExpanded.includes(nodeId);
      const nextExpanded = isOpen
        ? currentExpanded.filter((id) => id !== nodeId)
        : [...currentExpanded, nodeId];

      if (!isExpandedControlled) {
        setInternalExpanded(nextExpanded);
      }

      onExpansionChange?.(nextExpanded);
    },
    [currentExpanded, isExpandedControlled, onExpansionChange]
  );

  // Select node
  const selectNode = useCallback(
    (nodeId: string) => {
      let nextSelected: string[];

      if (multiSelect) {
        const isActive = currentSelected.includes(nodeId);
        nextSelected = isActive
          ? currentSelected.filter((id) => id !== nodeId)
          : [...currentSelected, nodeId];
      } else {
        nextSelected = [nodeId];
      }

      if (!isSelectedControlled) {
        setInternalSelected(nextSelected);
      }

      onSelectionChange?.(nextSelected);
    },
    [currentSelected, isSelectedControlled, multiSelect, onSelectionChange]
  );

  // Focus node
  const focusNode = useCallback((nodeId: string) => {
    setInternalFocused(nodeId);
  }, []);

  // Create context value
  const contextValue = useMemo<TreeViewContextProps>(
    () => ({
      expanded: currentExpanded,
      selected: currentSelected,
      focused: focusedIds,
      multiSelect,
      size,
      disabled,
      glass,
      selectNode,
      toggleNode,
      focusNode,
      showIcons,
      showLines,
    }),
    [
      currentExpanded,
      currentSelected,
      focusedIds,
      multiSelect,
      size,
      disabled,
      glass,
      selectNode,
      toggleNode,
      focusNode,
      showIcons,
      showLines,
    ]
  );

  // Extract compatible HTML attributes (rest already contains HTML attributes from props)
  const compatibleRest = rest;

  const sizeClass =
    size === 'small'
      ? styles.sizeSmall
      : size === 'large'
      ? styles.sizeLarge
      : styles.sizeMedium;

  const containerVars = useMemo<React.CSSProperties>(
    () => ({
      '--tree-view-color': (TREE_COLOR_MAP[color] ?? TREE_COLOR_MAP.default).accent,
      '--tree-view-selected-bg': (TREE_COLOR_MAP[color] ?? TREE_COLOR_MAP.default).highlight,
    }) as React.CSSProperties,
    [color]
  );

  return (
    <TreeViewContext.Provider data-glass-component value={contextValue}>
      <ul
        ref={ref}
        role="tree"
        className={cn(styles.root, sizeClass, disabled && styles.disabled, className)}
        style={{ ...containerVars, ...style }}
        aria-multiselectable={multiSelect}
        {...compatibleRest}
      >
        {children}
      </ul>
    </TreeViewContext.Provider>
  );
}

/**
 * TreeView Component
 *
 * A hierarchical list with collapsible items.
 */
const TreeView = forwardRef(TreeViewComponent);

/**
 * GlassTreeView Component
 *
 * Glass variant of the TreeView component.
 */
const GlassTreeView = forwardRef<HTMLUListElement, TreeViewProps>((props, ref) => (
  <TreeView {...props} ref={ref} />
));

GlassTreeView.displayName = 'GlassTreeView';

export default TreeView;
export { TreeView, GlassTreeView };
