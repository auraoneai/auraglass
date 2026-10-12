/* GlassFileTree — 4.x compat adapter (REQ-SURF-13, DEP-S0206) → TreeView
   preset="files". nodes {id,name,type,path,children,isExpanded} → items
   (name is the label; folders initially expanded via isExpanded or
   expandedNodes), selectedNodeId → selected key, onNodeSelect(node) /
   onNodeToggle(id, expanded) fire from the tree. Create/rename/move/copy
   affordances are app concerns in 5.0 and are not rendered. The legacy
   `files` [{name, children}] shape is also accepted. The mapping lives in
   ./GlassFileTree.impl, loaded on first render (../lazyAdapter) so importing
   aura-glass/compat never evaluates react-aria-components. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import type { TreeViewBaseProps } from '../../../data/tree-view/TreeView';
import { lazyAdapter } from '../lazyAdapter';
import type { FileItem } from './GlassFileTree.impl';

export interface LegacyFileNode {
  id?: string;
  name: string;
  type?: 'file' | 'folder';
  path?: string;
  children?: LegacyFileNode[];
  isExpanded?: boolean;
  [extra: string]: unknown;
}

export interface GlassFileTreeProps extends Omit<TreeViewBaseProps<FileItem>, 'items'> {
  nodes?: LegacyFileNode[];
  files?: LegacyFileNode[];
  selectedNodeId?: string;
  expandedNodes?: string[];
  onNodeSelect?: (node: LegacyFileNode) => void;
  onNodeToggle?: (nodeId: string, expanded: boolean) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  [legacy: string]: unknown;
}

const LegacyFileTreeLazy = /*#__PURE__*/ lazyAdapter<GlassFileTreeProps>(() => import('./GlassFileTree.impl').then((m) => m.LegacyFileTreeImpl));

/** Shared 4.x file-tree mapping (GlassFileTree, GlassFileExplorer); renders
    the 5.0 TreeView preset="files" once its implementation module has loaded. */
export function LegacyFileTree(props: GlassFileTreeProps) {
  return <LegacyFileTreeLazy.Render {...props} />;
}

/**
 * 4.x `GlassFileTree` compat adapter (DEP-S0206).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function GlassFileTree(props: GlassFileTreeProps) {
  warnDeprecated('DEP-S0206');
  return <LegacyFileTree {...props} />;
}
