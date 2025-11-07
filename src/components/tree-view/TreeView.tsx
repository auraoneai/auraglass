/**
 * Glass TreeView Component
 *
 * A hierarchical list with collapsible items.
 */
import React, { forwardRef, useState, useCallback, useMemo, createContext } from 'react';
import { cn } from '@/lib/utils';
import { glassStyleCSS, createGlassStyle } from '../../core/mixins/glassMixins';
import { AURA_GLASS } from '../../tokens/glass';
import styled, { css } from 'styled-components';

import { TreeViewProps, TreeViewContextProps } from './types';

// Create context for TreeView state
export const TreeViewContext = createContext<TreeViewContextProps | null>(null);

// Styled components
const TreeViewRoot = styled.ul<{
  $color: string;
  $disabled: boolean;
  $size: 'small' | 'medium' | 'large';
}>`
  list-style: none;
  margin: 0;
  padding: 0;
  outline: 0;
  width: 100%;

  /* Basic styling */
  background-color: ${AURA_GLASS.surfaces.neutral.level2.surface.base};
  ${glassStyleCSS({ intent: 'neutral', elevation: 'level2' })}
  border: 1px solid ${AURA_GLASS.surfaces.neutral.level2.surface.base};
  border-radius: 8px;
  padding: 8px;

  /* Color variations */
  ${props => {
    switch (props.$color) {
      case 'primary':
        return `--tree-view-color: rgba(99, 102, 241, 0.9);`;
      case 'secondary':
        return `--tree-view-color: rgba(156, 39, 176, 0.9);`;
      case 'error':
        return `--tree-view-color: rgba(240, 82, 82, 0.9);`;
      case 'info':
        return `--tree-view-color: rgba(3, 169, 244, 0.9);`;
      case 'success':
        return `--tree-view-color: rgba(76, 175, 80, 0.9);`;
      case 'warning':
        return `--tree-view-color: rgba(255, 152, 0, 0.9);`;
      case 'default':
      default:
        return `--tree-view-color: ${AURA_GLASS.surfaces.neutral.level2.text.primary};`;
    }
  }}

  /* Size variations */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `font-size: 0.8125rem;`;
      case 'large':
        return `font-size: 1rem;`;
      case 'medium':
      default:
        return `font-size: 0.875rem;`;
    }
  }}

  /* Disabled state */
  ${props =>
    props.$disabled &&
    `
    opacity: 0.6;
    pointer-events: none;
  `}
`;

/**
 * TreeView Component Implementation
 */
function TreeViewComponent(props: TreeViewProps, ref: React.ForwardedRef<HTMLUListElement>) {
  // Unified glass styles
  const glassStyles = createGlassStyle({ intent: 'neutral', elevation: 'level2', tier: 'high' });

  const {
    items,
    selectedIds,
    expandedIds,
    onSelectionChange,
    onExpansionChange,
    multiSelect = false,
    showIcons = false,
    showLines = false,
    glassVariant,
    blurStrength,
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

  // Toggle node expansion
  const toggleNode = useCallback(
    (event: React.SyntheticEvent, nodeId: string) => {
      const newExpanded = expanded!.includes(nodeId)
        ? expanded!.filter((id: any) => id !== nodeId)
        : [...expanded!, nodeId];

      if (!isExpandedControlled) {
        setInternalExpanded(newExpanded);
      }

      if (onExpansionChange) {
        onExpansionChange(newExpanded);
      }
    },
    [expanded, isExpandedControlled, onExpansionChange]
  );

  // Select node
  const selectNode = useCallback(
    (event: React.SyntheticEvent, nodeId: string) => {
      let newSelected: string[];

      if (multiSelect) {
        newSelected = selected!.includes(nodeId)
          ? selected!.filter((id: any) => id !== nodeId)
          : [...selected!, nodeId];
      } else {
        newSelected = [nodeId];
      }

      if (!isSelectedControlled) {
        setInternalSelected(newSelected);
      }

      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
    },
    [selected, isSelectedControlled, onSelectionChange, multiSelect]
  );

  // Focus node
  const focusNode = useCallback(
    (event: React.SyntheticEvent, nodeId: string) => {
      setInternalFocused(nodeId);
    },
    []
  );

  // Create context value
  const contextValue = useMemo<TreeViewContextProps>(
    () => ({
      selectedIds: selected || [],
      expandedIds: expanded || [],
      onSelectionChange,
      onExpansionChange,
      multiSelect,
      showIcons,
      showLines,
    }),
    [
      expanded,
      selected,
      onSelectionChange,
      onExpansionChange,
      multiSelect,
      showIcons,
      showLines,
    ]
  );

  // Extract compatible HTML attributes (rest already contains HTML attributes from props)
  const compatibleRest = rest;

  return (
    <TreeViewContext data-glass-component.Provider value={contextValue}>
      <TreeViewRoot
        ref={ref}
        role="tree"
        className={className}
        style={style}
        $color="default"
        $disabled={false}
        $size="medium"
        aria-multiselectable={multiSelect}
        {...compatibleRest}
      >
        {children}
      </TreeViewRoot>
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
