/* GlassVirtualList — 4.x compat adapter (SURF-320). VirtualList is internal
   at 5.0; consumers rendering row lists migrate to Table or a plain list —
   this adapter renders the children list static (no virtualization) with
   the deprecation warning so existing pages still paint. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

export type GlassVirtualListProps = {
  items?: readonly unknown[];
  renderItem?: (item: unknown, index: number) => React.ReactNode;
  rowHeight?: number;
  height?: number | string;
  children?: React.ReactNode;
};

export function GlassVirtualList(props: GlassVirtualListProps) {
  warnDeprecated('GlassVirtualList');
  const { items, renderItem, children } = props;
  if (items && renderItem) {
    return <div data-ag-compat="GlassVirtualList">{items.map((it, i) => <React.Fragment key={i}>{renderItem(it, i)}</React.Fragment>)}</div>;
  }
  return <div data-ag-compat="GlassVirtualList">{children}</div>;
}
