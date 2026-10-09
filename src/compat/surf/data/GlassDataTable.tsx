/* GlassDataTable — 4.x compat adapter (SURF-317). Delegates to Table and
   warns once; prop mapping per fragments/codemods/surf.ts W2 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Table } from '../../../data/table/Table';
import type { TableProps } from '../../../data/table/Table';

type Ctx = { getValue: <T = unknown>() => T; row: { original: unknown } };

/** @deprecated GlassDataTableProps DEP-S0636 since 4.2.0, removed in 6.0.0. */
export type GlassDataTableProps<TRow extends Record<string, unknown> = Record<string, unknown>> = {
  rows?: TRow[];
  data?: TRow[];
  columns?: { key: string; label?: React.ReactNode; render?: (value: unknown, row: TRow) => React.ReactNode; sortable?: boolean; width?: number }[];
  filterable?: boolean;
  compact?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  onRowClick?: (row: TRow) => void;
  emptyMessage?: React.ReactNode;
  getRowId?: (row: TRow, index: number) => string;
} & Omit<TableProps<TRow>, 'data' | 'columns' | 'onRowAction' | 'emptyState' | 'getRowId'>;

export function GlassDataTable<TRow extends Record<string, unknown> = Record<string, unknown>>(props: GlassDataTableProps<TRow>) {
  warnDeprecated('DEP-S0636');
  const { rows, data, columns = [], filterable, compact, selectedRows, onSelectionChange, onRowClick, emptyMessage, getRowId, ...rest } = props;
  const cols = columns.map((c) => ({
    id: c.key,
    accessorKey: c.key,
    header: c.label,
    enableSorting: c.sortable,
    size: c.width,
    ...(c.render ? { cell: (ctx: Ctx) => c.render!(ctx.getValue(), ctx.row.original as TRow) } : {}),
  }));
  const rid = getRowId ?? ((_row: TRow, i: number) => String(i));
  const rowSelection = selectedRows ? Object.fromEntries(selectedRows.map((id) => [String(id), true])) : undefined;
  return (
    <Table
      {...rest}
      data={rows ?? data ?? []}
      columns={cols as never}
      size={compact ? 'sm' : rest.size}
      rowSelection={rowSelection as never}
      onRowSelectionChange={onSelectionChange ? (next: Record<string, boolean>) => onSelectionChange(Object.keys(next).filter((k) => next[k])) : undefined}
      onRowAction={onRowClick as never}
      emptyState={emptyMessage ?? 'No rows'}
      getRowId={rid as never}
    />
  );
}
