/* LegacyTree implementation (GlassTreeView / TreeView 4.x mapping) — loaded
   on first render by ./GlassTreeView (../lazyAdapter: keeps
   react-aria-components out of the compat import graph). */
'use client';
import * as React from 'react';
import { TreeView } from '../../../data/tree-view/TreeView';
import type { GlassTreeNode, GlassTreeViewProps } from './GlassTreeView';

function flatten(nodes: readonly GlassTreeNode[], out = new Map<string, GlassTreeNode>()): Map<string, GlassTreeNode> {
  for (const n of nodes) {
    out.set(n.id, n);
    if (n.children) flatten(n.children, out);
  }
  return out;
}

export function LegacyTreeImpl(props: GlassTreeViewProps) {
  const {
    data, nodes, items, selectionMode, selectedId, selectedIds, defaultSelectedIds, expandedIds, defaultExpandedIds,
    onSelect, onSelectionChange, onExpand, className, selectedKey,
  } = props;
  const tree = React.useMemo(() => data ?? nodes ?? items ?? [], [data, nodes, items]);
  const byId = React.useMemo(() => flatten(tree), [tree]);
  const disabledKeys = React.useMemo(() => [...byId.values()].filter((n) => n.disabled).map((n) => n.id), [byId]);
  const selected = props.selectedKeys ?? selectedIds ?? (selectedKey !== undefined ? [selectedKey] : selectedId !== undefined ? [selectedId] : undefined);
  const mode = selectionMode ?? (selected || defaultSelectedIds || onSelect || onSelectionChange ? 'single' : 'none');
  const expandedRef = React.useRef(new Set(expandedIds ?? defaultExpandedIds ?? []));
  return (
    <TreeView<GlassTreeNode>
      {...props}
      items={tree}
      getTextValue={(n) => (typeof n.label === 'string' ? n.label : n.id)}
      selectionMode={mode}
      aria-label={props['aria-label'] ?? 'Tree'}
      aria-labelledby={props['aria-labelledby']}
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
