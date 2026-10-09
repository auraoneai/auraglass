/* GlassVirtualTable — 4.x compat adapter (SURF-319). In 4.x this rendered
   GlassDataTable unvirtualized; the 5.0 adapter delegates to Table whose
   internal VirtualList is the honest implementation. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Table } from '../../../data/table/Table';
import type { TableProps } from '../../../data/table/Table';

/** @deprecated GlassVirtualTableProps DEP-S0641 since 4.2.0, removed in 6.0.0. */
export type GlassVirtualTableProps<TRow extends Record<string, unknown> = Record<string, unknown>> = {
  rows?: TRow[];
  data?: TRow[];
  columns?: { key: string; label?: React.ReactNode }[];
  rowHeight?: number;
} & Omit<TableProps<TRow>, 'data' | 'columns' | 'getRowId'>;

export function GlassVirtualTable<TRow extends Record<string, unknown> = Record<string, unknown>>(props: GlassVirtualTableProps<TRow>) {
  warnDeprecated('DEP-S0641');
  const { rows, data, columns = [], rowHeight, ...rest } = props;
  const cols = columns.map((c) => ({ id: c.key, accessorKey: c.key, header: c.label }));
  return (
    <Table
      {...rest}
      data={rows ?? data ?? []}
      columns={cols as never}
      virtualize
      size={rowHeight !== undefined && rowHeight <= 32 ? 'sm' : 'md'}
      getRowId={(_r: TRow, i: number) => String(i)}
    />
  );
}
