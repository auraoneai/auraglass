/* GlassDataGrid — 4.x compat adapter (SURF-318). ColumnDefinition key/label
   map onto accessorKey/header; render/cellRenderer wrap as cell(ctx). */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Table } from '../../../data/table/Table';
import type { TableProps } from '../../../data/table/Table';

type Ctx = { getValue: <T = unknown>() => T; row: { original: unknown } };

/** @deprecated ColumnDefinition DEP-S0640 since 4.2.0, removed in 6.0.0. */
export interface ColumnDefinition<TRow = Record<string, unknown>> {
  key: string;
  label?: React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  render?: (value: unknown, row: TRow) => React.ReactNode;
  cellRenderer?: (value: unknown, row: TRow) => React.ReactNode;
}

export type GlassDataGridProps<TRow extends Record<string, unknown> = Record<string, unknown>> = {
  rows?: TRow[];
  data?: TRow[];
  columns: ColumnDefinition<TRow>[];
  getRowId?: (row: TRow, index: number) => string;
} & Omit<TableProps<TRow>, 'data' | 'columns' | 'getRowId'>;

export function GlassDataGrid<TRow extends Record<string, unknown> = Record<string, unknown>>(props: GlassDataGridProps<TRow>) {
  warnDeprecated('DEP-S0640');
  const { rows, data, columns, getRowId, ...rest } = props;
  const cols = columns.map((c) => ({
    id: c.key,
    accessorKey: c.key,
    header: c.label,
    enableSorting: c.sortable,
    size: typeof c.width === 'number' ? c.width : undefined,
    meta: c.align ? { align: c.align === 'left' ? 'start' : c.align === 'right' ? 'end' : 'center' } : undefined,
    ...((c.render ?? c.cellRenderer) ? { cell: (ctx: Ctx) => (c.render ?? c.cellRenderer)!(ctx.getValue(), ctx.row.original as TRow) } : {}),
  }));
  return <Table {...rest} data={rows ?? data ?? []} columns={cols as never} getRowId={(getRowId as never) ?? ((_r: TRow, i: number) => String(i))} />;
}
