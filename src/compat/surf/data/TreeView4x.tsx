/* 4.x unglassed `TreeView` — same adapter target as GlassTreeView. */
'use client';
import { warnDeprecated } from '../../../internal';
import { GlassTreeView, type GlassTreeViewProps } from './GlassTreeView';
import type { TreeItemData } from '../../../data/tree-view/TreeView';

export function TreeView<T extends TreeItemData = TreeItemData>(props: GlassTreeViewProps<T>) {
  warnDeprecated('TreeView(4.x)');
  return <GlassTreeView {...props} />;
}
