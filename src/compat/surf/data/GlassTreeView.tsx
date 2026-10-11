/* GlassTreeView — 4.x compat adapter (REQ-SURF-13, DEP-S0204) → TreeView.
   data (legacy nodes/items accepted) {id,label,icon,children,disabled} →
   items; selectionMode, selectedId/selectedIds/defaultSelectedIds →
   selectedKeys/defaultSelectedKeys; expandedIds/defaultExpandedIds →
   expandedKeys/defaultExpandedKeys; disabled nodes → disabledKeys;
   onSelect(id, node) / onSelectionChange(ids, nodes) ← onSelectionChange;
   onExpand(id, expanded) ← onExpandedChange. Lines/icons/checkbox styling has
   no 5.0 equivalent. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TreeView } from '../../../data/tree-view/TreeView';

export interface GlassTreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: GlassTreeNode[];
  disabled?: boolean;
  [extra: string]: unknown;
}

export interface GlassTreeViewProps {
  data?: GlassTreeNode[];
  nodes?: GlassTreeNode[];
  items?: GlassTreeNode[];
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onSelect?: (nodeId: string, node: GlassTreeNode) => void;
  onSelectionChange?: (nodeIds: string[], nodes: GlassTreeNode[]) => void;
  onExpand?: (nodeId: string, expanded: boolean) => void;
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

function flatten(nodes: readonly GlassTreeNode[], out = new Map<string, GlassTreeNode>()): Map<string, GlassTreeNode> {
  for (const n of nodes) {
    out.set(n.id, n);
    if (n.children) flatten(n.children, out);
  }
  return out;
}

export function LegacyTree(props: GlassTreeViewProps) {
  const {
    data, nodes, items, selectionMode, selectedId, selectedIds, defaultSelectedIds, expandedIds, defaultExpandedIds,
    onSelect, onSelectionChange, onExpand, className,
  } = props;
  const tree = React.useMemo(() => data ?? nodes ?? items ?? [], [data, nodes, items]);
  const byId = React.useMemo(() => flatten(tree), [tree]);
  const disabledKeys = React.useMemo(() => [...byId.values()].filter((n) => n.disabled).map((n) => n.id), [byId]);
  const selected = selectedIds ?? (selectedId !== undefined ? [selectedId] : undefined);
  const mode = selectionMode ?? (selected || defaultSelectedIds || onSelect || onSelectionChange ? 'single' : 'none');
  const expandedRef = React.useRef(new Set(expandedIds ?? defaultExpandedIds ?? []));
  return (
    <TreeView<GlassTreeNode>
      items={tree}
      getTextValue={(n) => (typeof n.label === 'string' ? n.label : n.id)}
      selectionMode={mode}
      aria-label={props['aria-label'] ?? 'Tree'}
      {...(selected ? { selectedKeys: selected } : {})}
      {...(defaultSelectedIds ? { defaultSelectedKeys: defaultSelectedIds } : {})}
      {...(expandedIds ? { expandedKeys: expandedIds } : {})}
      {...(defaultExpandedIds ? { defaultExpandedKeys: defaultExpandedIds } : {})}
      {...(disabledKeys.length ? { disabledKeys } : {})}
      onSelectionChange={(keys: Set<React.Key>) => {
        const ids = [...keys].map(String);
        const picked = ids.map((id) => byId.get(id)).filter((n): n is GlassTreeNode => n !== undefined);
        if (picked[0] && onSelect) onSelect(picked[0].id, picked[0]);
        onSelectionChange?.(ids, picked);
      }}
      onExpandedChange={(keys: Set<React.Key>) => {
        const next = new Set([...keys].map(String));
        for (const id of next) if (!expandedRef.current.has(id)) onExpand?.(id, true);
        for (const id of expandedRef.current) if (!next.has(id)) onExpand?.(id, false);
        expandedRef.current = next;
      }}
      {...(className ? { className } : {})}
    />
  );
}

/**
 * 4.x `GlassTreeView` compat adapter (DEP-S0204).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function GlassTreeView(props: GlassTreeViewProps) {
  warnDeprecated('DEP-S0204');
  return <LegacyTree {...props} />;
}
