/* LegacyFileTree implementation (GlassFileTree / GlassFileExplorer 4.x
   mapping) — loaded on first render by ./GlassFileTree (../lazyAdapter: keeps
   react-aria-components out of the compat import graph). */
'use client';
import * as React from 'react';
import { TreeView } from '../../../data/tree-view/TreeView';
import type { GlassFileTreeProps, LegacyFileNode } from './GlassFileTree';

export interface FileItem {
  id: string;
  name: string;
  node: LegacyFileNode;
  children?: FileItem[];
  [key: string]: unknown;
}

function toItems(nodes: readonly LegacyFileNode[], prefix = ''): FileItem[] {
  return nodes.map((n, i) => {
    const id = n.id ?? n.path ?? `${prefix}${i}-${n.name}`;
    return { id, name: n.name, node: n, ...(n.children?.length ? { children: toItems(n.children, `${id}/`) } : {}) };
  });
}

function collect(items: readonly FileItem[], pick: (i: FileItem) => boolean, out: FileItem[] = []): FileItem[] {
  for (const i of items) {
    if (pick(i)) out.push(i);
    if (i.children) collect(i.children, pick, out);
  }
  return out;
}

export function LegacyFileTreeImpl(props: GlassFileTreeProps) {
  const { nodes, files, selectedNodeId, expandedNodes, onNodeSelect, onNodeToggle, className } = props;
  const items = React.useMemo(() => toItems(nodes ?? files ?? []), [nodes, files]);
  const all = React.useMemo(() => new Map(collect(items, () => true).map((i) => [i.id, i])), [items]);
  const initiallyExpanded = React.useMemo(
    () => expandedNodes ?? collect(items, (i) => i.node.isExpanded === true).map((i) => i.id),
    [items, expandedNodes],
  );
  const expanded = React.useRef(new Set(initiallyExpanded));
  return (
    <TreeView<FileItem>
      {...props}
      items={items}
      preset="files"
      getTextValue={(i) => i.name}
      selectionMode="single"
      aria-label={props['aria-label'] ?? 'Files'}
      aria-labelledby={props['aria-labelledby']}
      defaultExpandedKeys={initiallyExpanded}
      {...(selectedNodeId !== undefined ? { defaultSelectedKeys: [selectedNodeId] } : {})}
      onSelectionChange={(keys: Set<React.Key>) => {
        const first = [...keys][0];
        const item = first !== undefined ? all.get(String(first)) : undefined;
        if (item) onNodeSelect?.(item.node);
      }}
      onExpandedChange={(keys: Set<React.Key>) => {
        const next = new Set([...keys].map(String));
        for (const id of next) if (!expanded.current.has(id)) onNodeToggle?.(id, true);
        for (const id of expanded.current) if (!next.has(id)) onNodeToggle?.(id, false);
        expanded.current = next;
      }}
      {...(className ? { className } : {})}
    />
  );
}
