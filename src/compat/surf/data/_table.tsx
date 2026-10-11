/* Shared 4.x table mapping for GlassDataTable / GlassDataGrid /
   GlassVirtualTable (REQ-SURF-13). Accepts both 4.x column shapes:
     - GlassDataGrid ColumnDefinition {key, label, sortable, width, align,
       render | cellRenderer(value, row)},
     - GlassDataTable/VirtualTable ColumnDef {id, header, accessorKey,
       accessorFn, cell({row, value}), sortable | enableSorting, width, align}
   and emits TanStack column defs for the 5.0 Table. 4.x align left/right →
   meta.align start/end. cellRenderers[key] (GlassDataTable) wins over a
   column's own renderer. */
import * as React from 'react';
import type { TableColumnDef } from '../../../data/table/types';
import { Table } from '../../../data/table/Table';

type Row = Record<string, unknown>;


export interface LegacyColumn<T extends Row = Row> {
  key?: string;
  label?: React.ReactNode;
  id?: string;
  header?: string | ((props: { column: unknown }) => React.ReactNode);
  accessorKey?: string;
  accessorFn?: (row: T) => unknown;
  cell?: (props: { row: T; value: unknown }) => React.ReactNode;
  render?: (value: unknown, row: T) => React.ReactNode;
  cellRenderer?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  enableSorting?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

type Ctx = { getValue: () => unknown; row: { original: unknown } };

const ALIGN = { left: 'start', center: 'center', right: 'end' } as const;

export function legacyColumns<T extends Row>(
  columns: readonly LegacyColumn<T>[],
  cellRenderers?: Record<string, (value: unknown, row: T) => React.ReactNode>,
): TableColumnDef<T>[] {
  return columns.map((c, i) => {
    const accessor = c.accessorKey ?? c.key;
    const id = c.id ?? accessor ?? `col-${i}`;
    const header = c.label ?? c.header ?? id;
    const custom = (accessor && cellRenderers?.[accessor]) || c.render || c.cellRenderer;
    const def: Record<string, unknown> = {
      id,
      header: typeof header === 'function' ? header : () => header,
      enableSorting: c.enableSorting ?? c.sortable ?? false,
      ...(typeof c.width === 'number' ? { size: c.width } : {}),
      ...(c.align ? { meta: { align: ALIGN[c.align], ...(typeof header === 'string' ? { headerLabel: header } : {}) } } : typeof header === 'string' ? { meta: { headerLabel: header } } : {}),
    };
    if (c.accessorFn) def['accessorFn'] = c.accessorFn;
    else if (accessor) def['accessorKey'] = accessor;
    if (custom) def['cell'] = (ctx: Ctx) => custom(ctx.getValue(), ctx.row.original as T);
    else if (c.cell) def['cell'] = (ctx: Ctx) => c.cell!({ row: ctx.row.original as T, value: ctx.getValue() });
    return def as unknown as TableColumnDef<T>;
  });
}

/** 4.x rows carried `id` (number or string); index is the fallback. */
export function legacyRowId<T extends Row>(row: T, index: number): string {
  const id = row['id'];
  return typeof id === 'string' || typeof id === 'number' ? String(id) : String(index);
}

export interface LegacyTableProps<T extends Row = Row> {
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

export function LegacyTable<T extends Row>({ virtualize, ...props }: LegacyTableProps<T> & { virtualize?: boolean }) {
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
