/* 4.x unglassed `TreeView` — same adapter target as GlassTreeView. */
'use client';
import { warnDeprecated } from '../../../internal';
import { GlassTreeView, type GlassTreeViewProps } from './GlassTreeView';
import type { TreeItemData } from '../../../data/tree-view/TreeView';

export function TreeView<T extends TreeItemData = TreeItemData>(props: GlassTreeViewProps<T>) {
  warnDeprecated('DEP-S0650');
  return <GlassTreeView {...props} />;
}
