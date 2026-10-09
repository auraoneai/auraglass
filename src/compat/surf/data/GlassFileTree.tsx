'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TreeView } from '../../../data/tree-view/TreeView';
import type { TreeViewProps, TreeItemData } from '../../../data/tree-view/TreeView';

/** 4.x file nodes: { name, children }. */
export type GlassFileTreeProps = Omit<TreeViewProps<TreeItemData>, 'items'> & {
  files?: { name: string; children?: { name: string; children?: unknown[] }[] }[];
};

function mapFiles(files: NonNullable<GlassFileTreeProps['files']>, prefix = ''): { id: string; label: string; children?: ReturnType<typeof mapFiles> }[] {
  return files.map((f, i) => {
    const id = `${prefix}${i}-${f.name}`;
    return { id, label: f.name, ...(f.children?.length ? { children: mapFiles(f.children as never, `${id}/`) } : {}) };
  });
}

export function GlassFileTree(props: GlassFileTreeProps) {
  warnDeprecated('DEP-S0634');
  const { files = [], ...rest } = props;
  return <TreeView {...rest} items={mapFiles(files) as never} />;
}
