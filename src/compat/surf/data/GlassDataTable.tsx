/* GlassDataTable — 4.x compat adapter (REQ-SURF-13, DEP-S0200) → Table.
   data (legacy `rows` accepted) / columns (both 4.x shapes, ./_table.tsx) /
   cellRenderers; sortable={false} disables every column's sorting;
   pagination + initialPageSize → defaultPagination; selectable +
   selectionMode/selectedRows/onSelectionChange(ids) → row selection;
   onRowClick → onRowAction; loading; emptyMessage / emptyState.message →
   emptyState; compact or size → density; stickyHeader, maxHeight and
   aria-label map 1:1. Built-in search/filter UI (searchable/filterable) is
   composed with FilterBar in 5.0 and is not rendered here. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Table } from '../../../data/table/Table';
import { legacyColumns, legacyRowId, type LegacyColumn } from './_table';

type Row = Record<string, unknown>;

export interface GlassDataTableProps<T extends Row = Row> {
  data?: T[];
  rows?: T[];
  columns?: LegacyColumn<T>[];
  cellRenderers?: Record<string, (value: unknown, row: T) => React.ReactNode>;
  sortable?: boolean;
  pagination?: boolean;
  initialPageSize?: number;
  selectable?: boolean;
  selectionMode?: 'single' | 'multiple';
  selectedRows?: (string | number)[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  emptyState?: { message?: string; description?: string };
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  maxHeight?: number | string;
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

export function LegacyTable<T extends Row>({ virtualize, ...props }: GlassDataTableProps<T> & { virtualize?: boolean }) {
  const {
    data, rows, columns = [], cellRenderers, sortable = true, pagination, initialPageSize = 10, selectable,
    selectionMode, selectedRows, onSelectionChange, onRowClick, getRowId, loading, emptyMessage, emptyState,
    compact, size, stickyHeader, maxHeight, className,
  } = props;
  const cols = React.useMemo(() => {
    const mapped = legacyColumns(columns, cellRenderers);
    return sortable ? mapped : mapped.map((c) => ({ ...c, enableSorting: false }));
  }, [columns, cellRenderers, sortable]);
  const mode = selectable || selectedRows || onSelectionChange ? (selectionMode ?? 'multiple') : undefined;
  return (
    <Table<T>
      data={rows ?? data ?? []}
      columns={cols}
      getRowId={getRowId ?? legacyRowId}
      {...(pagination ? { defaultPagination: { pageIndex: 0, pageSize: initialPageSize } } : {})}
      {...(mode ? { selectionMode: mode } : {})}
      {...(selectedRows ? { rowSelection: Object.fromEntries(selectedRows.map((id) => [String(id), true])) } : {})}
      {...(onSelectionChange ? { onRowSelectionChange: (s: Record<string, boolean>) => onSelectionChange(Object.keys(s).filter((k) => s[k])) } : {})}
      {...(onRowClick ? { onRowAction: onRowClick } : {})}
      {...(loading ? { loading: true } : {})}
      emptyState={emptyMessage ?? emptyState?.message ?? 'No rows'}
      size={compact ? 'sm' : (size ?? 'md')}
      {...(stickyHeader ? { stickyHeader: true } : {})}
      {...(maxHeight !== undefined ? { maxHeight } : {})}
      {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}
      {...(className ? { className } : {})}
      {...(virtualize ? { virtualize: true } : {})}
    />
  );
}

/**
 * 4.x `GlassDataTable` compat adapter (DEP-S0200).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Table from aura-glass/data}.
 */
export function GlassDataTable<T extends Row = Row>(props: GlassDataTableProps<T>) {
  warnDeprecated('DEP-S0200');
  return <LegacyTable<T> {...props} />;
}
