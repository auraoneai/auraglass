/* GlassTreeView — 4.x compat adapter (SURF-321). */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TreeView } from '../../../data/tree-view/TreeView';
import type { TreeViewProps, TreeItemData } from '../../../data/tree-view/TreeView';

export type GlassTreeViewProps<T extends TreeItemData = TreeItemData> = {
  nodes?: T[];
  items?: T[];
  selectedId?: React.Key;
  selectedKey?: React.Key;
  onSelect?: (id: React.Key | null) => void;
} & Omit<TreeViewProps<T>, 'items' | 'selectedKeys' | 'onSelectionChange'>;

export function GlassTreeView<T extends TreeItemData = TreeItemData>(props: GlassTreeViewProps<T>) {
  warnDeprecated('GlassTreeView');
  const { nodes, items, selectedId, selectedKey, onSelect, ...rest } = props;
  const sel = selectedKey ?? selectedId;
  return (
    <TreeView
      {...rest}
      items={(items ?? nodes ?? []) as T[]}
      {...(sel !== undefined ? { selectedKeys: [sel] } : {})}
      onSelectionChange={(keys: Set<React.Key>) => onSelect?.(keys.size ? (keys.values().next().value ?? null) : null)}
    />
  );
}
