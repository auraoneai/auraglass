'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TreeView } from '../../../data/tree-view/TreeView';
import type { TreeViewBaseProps, TreeViewLabelling, TreeItemData } from '../../../data/tree-view/TreeView';

/** 4.x file nodes: { name, children }. */
export type GlassFileTreeProps = Omit<TreeViewBaseProps<TreeItemData>, 'items'> & {
  /** 4.x did not require a name; TreeView still dev-warns when both are missing. */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  files?: { name: string; children?: { name: string; children?: unknown[] }[] }[];
};

function mapFiles(files: NonNullable<GlassFileTreeProps['files']>, prefix = ''): { id: string; label: string; children?: ReturnType<typeof mapFiles> }[] {
  return files.map((f, i) => {
    const id = `${prefix}${i}-${f.name}`;
    return { id, label: f.name, ...(f.children?.length ? { children: mapFiles(f.children as never, `${id}/`) } : {}) };
  });
}

export function GlassFileTree(props: GlassFileTreeProps) {
  warnDeprecated('GlassFileTree');
  const { files = [], ...rest } = props;
  return <TreeView {...(rest as Omit<TreeViewBaseProps<TreeItemData>, 'items'> & TreeViewLabelling)} items={mapFiles(files) as never} />;
}
