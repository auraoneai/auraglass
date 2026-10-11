/* GlassVirtualTable — 4.x compat adapter (REQ-SURF-13, DEP-S0202) → Table
   with virtualize. In 4.x this rendered the data table unvirtualized; the 5.0
   Table's internal VirtualList is the honest implementation. columns
   (ColumnDef {id, header, accessorKey}) / rows map through ./_table.tsx.
   disabled has no 5.0 equivalent. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyTable, type LegacyTableProps } from './_table';

type Row = Record<string, unknown>;

export type GlassVirtualTableProps<T extends Row = Row> = LegacyTableProps<T> & { rowHeight?: number };

/**
 * 4.x `GlassVirtualTable` compat adapter (DEP-S0202).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Table with virtualize from aura-glass/data}.
 */
export function GlassVirtualTable<T extends Row = Row>(props: GlassVirtualTableProps<T>) {
  warnDeprecated('DEP-S0202');
  const { rowHeight, ...rest } = props;
  return (
    <LegacyTable<T>
      {...rest}
      {...(rowHeight !== undefined && rest.size === undefined ? { size: rowHeight <= 32 ? 'sm' : rowHeight >= 48 ? 'lg' : 'md' } : {})}
      virtualize
    />
  );
}
