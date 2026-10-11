/* TreeView — the 4.x unglassed `TreeView` compat adapter (REQ-SURF-13,
   DEP-S0205), exported from aura-glass/compat under its 4.x name. items,
   selectedIds/expandedIds, multiSelect → selectionMode 'multiple' (else
   'single'), onSelectionChange(ids) / onExpansionChange(ids) map onto the
   5.0 TreeView through the shared LegacyTree mapping. Static <TreeItem>
   children are a 4.x sub-part with no adapter; pass `items`. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyTree, type GlassTreeNode } from './GlassTreeView';

export interface TreeViewProps {
  items?: GlassTreeNode[];
  selectedIds?: string[];
  expandedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExpansionChange?: (expandedIds: string[]) => void;
  multiSelect?: boolean;
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `TreeView` compat adapter (DEP-S0205).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function TreeView(props: TreeViewProps) {
  warnDeprecated('DEP-S0205');
  const { items, selectedIds, expandedIds, onSelectionChange, onExpansionChange, multiSelect, className } = props;
  const expanded = React.useRef(new Set(expandedIds ?? []));
  return (
    <LegacyTree
      data={items ?? []}
      selectionMode={multiSelect ? 'multiple' : 'single'}
      {...(selectedIds ? { defaultSelectedIds: selectedIds } : {})}
      {...(expandedIds ? { defaultExpandedIds: expandedIds } : {})}
      {...(onSelectionChange ? { onSelectionChange: (ids: string[]) => onSelectionChange(ids) } : {})}
      {...(onExpansionChange
        ? {
            onExpand: (id: string, open: boolean) => {
              if (open) expanded.current.add(id);
              else expanded.current.delete(id);
              onExpansionChange([...expanded.current]);
            },
          }
        : {})}
      {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}
      {...(className ? { className } : {})}
    />
  );
}
