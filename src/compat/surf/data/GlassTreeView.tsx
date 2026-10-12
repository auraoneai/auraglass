/* GlassTreeView — 4.x compat adapter (REQ-SURF-13, DEP-S0204) → TreeView.
   data (legacy nodes/items accepted) {id,label,icon,children,disabled} →
   items; selectionMode, selectedId/selectedIds/defaultSelectedIds →
   selectedKeys/defaultSelectedKeys; expandedIds/defaultExpandedIds →
   expandedKeys/defaultExpandedKeys; disabled nodes → disabledKeys;
   onSelect(id, node) / onSelectionChange(ids, nodes) ← onSelectionChange;
   onExpand(id, expanded) ← onExpandedChange. Lines/icons/checkbox styling has
   no 5.0 equivalent. The mapping lives in ./GlassTreeView.impl, loaded on
   first render (../lazyAdapter) so importing aura-glass/compat never
   evaluates react-aria-components. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import type { TreeViewBaseProps } from '../../../data/tree-view/TreeView';
import { lazyAdapter } from '../lazyAdapter';

export interface GlassTreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: GlassTreeNode[];
  disabled?: boolean;
  [extra: string]: unknown;
}

export interface GlassTreeViewProps extends Omit<TreeViewBaseProps<GlassTreeNode>, 'items' | 'onSelectionChange'> {
  data?: GlassTreeNode[];
  nodes?: GlassTreeNode[];
  items?: GlassTreeNode[];
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedId?: string;
  selectedKey?: React.Key;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onSelect?: (nodeId: string, node: GlassTreeNode) => void;
  onSelectionChange?: (nodeIds: string[], nodes: GlassTreeNode[]) => void;
  onExpand?: (nodeId: string, expanded: boolean) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  [legacy: string]: unknown;
}

const LegacyTreeLazy = lazyAdapter<GlassTreeViewProps>(() => import('./GlassTreeView.impl').then((m) => m.LegacyTreeImpl));

/** Shared 4.x tree mapping (GlassTreeView, TreeView 4.x); renders the 5.0
    TreeView once its implementation module has loaded. */
export function LegacyTree(props: GlassTreeViewProps) {
  return <LegacyTreeLazy.Render {...props} />;
}

/**
 * 4.x `GlassTreeView` compat adapter (DEP-S0204).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function GlassTreeView(props: GlassTreeViewProps) {
  warnDeprecated('DEP-S0204');
  return <LegacyTree {...props} />;
}
