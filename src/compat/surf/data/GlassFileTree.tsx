/* GlassFileTree — 4.x compat adapter (REQ-SURF-13, DEP-S0206) → TreeView
   preset="files". nodes {id,name,type,path,children,isExpanded} → items
   (name is the label; folders initially expanded via isExpanded or
   expandedNodes), selectedNodeId → selected key, onNodeSelect(node) /
   onNodeToggle(id, expanded) fire from the tree. Create/rename/move/copy
   affordances are app concerns in 5.0 and are not rendered. The legacy
   `files` [{name, children}] shape is also accepted. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TreeView } from '../../../data/tree-view/TreeView';

export interface LegacyFileNode {
  id?: string;
  name: string;
  type?: 'file' | 'folder';
  path?: string;
  children?: LegacyFileNode[];
  isExpanded?: boolean;
  [extra: string]: unknown;
}

interface FileItem {
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

export interface GlassFileTreeProps {
  nodes?: LegacyFileNode[];
  files?: LegacyFileNode[];
  selectedNodeId?: string;
  expandedNodes?: string[];
  onNodeSelect?: (node: LegacyFileNode) => void;
  onNodeToggle?: (nodeId: string, expanded: boolean) => void;
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

export function LegacyFileTree(props: GlassFileTreeProps) {
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
      items={items}
      preset="files"
      getTextValue={(i) => i.name}
      selectionMode="single"
      aria-label={props['aria-label'] ?? 'Files'}
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

/**
 * 4.x `GlassFileTree` compat adapter (DEP-S0206).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function GlassFileTree(props: GlassFileTreeProps) {
  warnDeprecated('DEP-S0206');
  return <LegacyFileTree {...props} />;
}
