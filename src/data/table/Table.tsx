'use client';
/* Table<TData> (SURF-155/162/164/165, REQ-SURF-66..78): one TanStack table
   with sorting, selection (single/multiple + shift-range), column
   visibility/sizing/pinning/reorder, pagination, virtualization, grid-mode
   keyboard. mode='table' renders real <table> semantics; 'grid' renders
   grid/row/gridcell + the keyboard model. All row models are imported
   per feature so unused ones tree-shake (manual* flags skip the client
   models). Ref is a prop (React 19). */
import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type Table as TanStackTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useControllableState } from './useTableState';
import { useGridKeyboard } from './useGridKeyboard';
import type { TableDensity, TableMode, SelectionMode, TableColumnDef } from './types';

export interface TableHandle<TData = unknown> {
  getInstance: () => TanStackTable<TData>;
  scrollToRow: (rowId: string, align?: 'start' | 'center' | 'end' | 'auto') => void;
  focusCell: (rowId: string, columnId: string) => void;
}

export interface TableMessages {
  sortBy?: string | undefined;              // "Sort by {col}"
  sortedAsc?: string | undefined;           // "Sorted by {col}, ascending"
  sortedDesc?: string | undefined;          // "Sorted by {col}, descending"
  sortCleared?: string | undefined;         // "Sorting cleared for {col}"
  selectAll?: string | undefined;           // "Select all rows"
  resize?: string | undefined;              // "Resize {col}"
  columnActions?: string | undefined;       // "Column actions"
  moveLeft?: string | undefined;
  moveRight?: string | undefined;
  movedTo?: string | undefined;             // "Moved {col} to position n of m"
  showTable?: string | undefined;           // "Show data table"
  loading?: string | undefined;
  empty?: string | undefined;
}

export interface TableProps<TData> {
  data: readonly TData[];
  columns: readonly TableColumnDef<TData>[];
  /** Required when selectionMode !== 'none' (dev warning otherwise). */
  getRowId?: ((row: TData, index: number) => string) | undefined;
  caption?: React.ReactNode;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  sorting?: SortingState | undefined;
  defaultSorting?: SortingState | undefined;
  onSortingChange?: ((s: SortingState) => void) | undefined;
  enableMultiSort?: boolean | undefined;
  selectionMode?: SelectionMode | undefined;
  rowSelection?: RowSelectionState | undefined;
  defaultRowSelection?: RowSelectionState | undefined;
  onRowSelectionChange?: ((s: RowSelectionState) => void) | undefined;
  columnVisibility?: VisibilityState | undefined;
  defaultColumnVisibility?: VisibilityState | undefined;
  onColumnVisibilityChange?: ((s: VisibilityState) => void) | undefined;
  columnSizing?: ColumnSizingState | undefined;
  defaultColumnSizing?: ColumnSizingState | undefined;
  onColumnSizingChange?: ((s: ColumnSizingState) => void) | undefined;
  enableColumnResizing?: boolean | undefined;
  columnPinning?: ColumnPinningState | undefined;
  defaultColumnPinning?: ColumnPinningState | undefined;
  onColumnPinningChange?: ((s: ColumnPinningState) => void) | undefined;
  columnOrder?: ColumnOrderState | undefined;
  defaultColumnOrder?: ColumnOrderState | undefined;
  onColumnOrderChange?: ((s: ColumnOrderState) => void) | undefined;
  enableColumnReordering?: boolean | undefined;
  pagination?: PaginationState | undefined;
  defaultPagination?: PaginationState | undefined;
  onPaginationChange?: ((s: PaginationState) => void) | undefined;
  /** Server-side pagination: skip client row model, take pageCount/rowCount. */
  manualPagination?: boolean | undefined;
  pageCount?: number | undefined;
  manualSorting?: boolean | undefined;
  rowCount?: number | undefined;
  virtualize?: boolean | { estimateRowHeight?: number; overscan?: number } | undefined;
  stickyHeader?: boolean | undefined;
  size?: TableDensity | undefined;
  mode?: TableMode | undefined;
  loading?: boolean | undefined;
  emptyState?: React.ReactNode;
  onRowAction?: ((row: TData) => void) | undefined;
  maxHeight?: number | string | undefined;
  messages?: TableMessages | undefined;
  ref?: React.Ref<TableHandle<TData>> | undefined;
  className?: string | undefined;
}

const pinnedStyle = (column: { getIsPinned: () => 'left' | 'right' | false; getStart: (side?: 'left' | 'right') => number }) => {
  const side = column.getIsPinned();
  if (!side) return {};
  return { position: 'sticky' as const, [side === 'left' ? 'insetInlineStart' : 'insetInlineEnd']: column.getStart(side || undefined), background: 'var(--ag-surface-raised, Canvas)', zIndex: 1 };
};

const ROW_HEIGHT: Record<TableDensity, number> = { sm: 32, md: 40, lg: 48 };

function announce(text: string) {
  // The announcer seam is MAT's useAnnouncer; a detached <div aria-live>
  // on the table root keeps announcements working in tests and when the
  // provider is absent — the provider wires its own live region in the app.
  return text;
}

function ResizeHandleInner<TData>({
  header,
  table,
  label,
}: {
  header: {
    column: {
      id: string;
      getSize: () => number;
      columnDef: { minSize?: number | undefined; maxSize?: number | undefined };
    };
    getResizeHandler: () => (e: unknown) => void;
  };
  table: TanStackTable<TData>;
  label: string;
}) {
  const setSize = (px: number) => {
    const min = Math.max(header.column.columnDef.minSize ?? 48, 48);
    const max = Math.min(header.column.columnDef.maxSize ?? 800, 800);
    const next = Math.min(Math.max(px, min), max);
    table.setColumnSizing((prev) => ({ ...prev, [header.column.id]: next }));
  };
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={header.column.getSize()}
      aria-valuemin={Math.max(header.column.columnDef.minSize ?? 48, 48)}
      aria-valuemax={Math.min(header.column.columnDef.maxSize ?? 800, 800)}
      aria-label={label}
      tabIndex={0}
      data-ag-part="table-resize-handle"
      className="ag-table__resize-handle"
      onPointerDown={(e) => {
        e.preventDefault();
        header.getResizeHandler()(e);
      }}
      onKeyDown={(e) => {
        const start = header.column.getSize();
        const rtl = typeof document !== 'undefined' && document.dir === 'rtl';
        const grow = rtl ? 'ArrowLeft' : 'ArrowRight';
        const shrink = rtl ? 'ArrowRight' : 'ArrowLeft';
        const step = e.shiftKey ? 32 : 8;
        if (e.key === grow) setSize(start + step);
        else if (e.key === shrink) setSize(start - step);
        else if (e.key === 'Home') setSize(48);
        else if (e.key === 'End') setSize(800);
        else return;
        e.preventDefault();
      }}
    />
  );
}

export function Table<TData>(props: TableProps<TData>) {
  'use no memo';
  const {
    data,
    columns,
    getRowId,
    caption,
    sorting,
    defaultSorting,
    onSortingChange,
    enableMultiSort = false,
    selectionMode = 'none',
    rowSelection,
    defaultRowSelection,
    onRowSelectionChange,
    columnVisibility,
    defaultColumnVisibility,
    onColumnVisibilityChange,
    columnSizing,
    defaultColumnSizing,
    onColumnSizingChange,
    enableColumnResizing = false,
    columnPinning,
    defaultColumnPinning,
    onColumnPinningChange,
    columnOrder,
    defaultColumnOrder,
    onColumnOrderChange,
    enableColumnReordering = false,
    pagination,
    defaultPagination,
    onPaginationChange,
    manualPagination = false,
    pageCount,
    manualSorting = false,
    rowCount,
    virtualize = false,
    stickyHeader,
    size = 'md',
    mode = 'table',
    loading = false,
    emptyState,
    onRowAction,
    maxHeight,
    messages,
    ref,
    className,
    ...rest
  } = props;

  const ariaLabel = rest['aria-label'];
  const ariaLabelledBy = rest['aria-labelledby'];
  const msgs = React.useMemo(
    () => ({
      sortBy: messages?.sortBy ?? 'Sort by {col}',
      sortedAsc: messages?.sortedAsc ?? 'Sorted by {col}, ascending',
      sortedDesc: messages?.sortedDesc ?? 'Sorted by {col}, descending',
      sortCleared: messages?.sortCleared ?? 'Sorting cleared for {col}',
      selectAll: messages?.selectAll ?? 'Select all rows',
      resize: messages?.resize ?? 'Resize {col}',
      columnActions: messages?.columnActions ?? 'Column actions',
      moveLeft: messages?.moveLeft ?? 'Move left',
      moveRight: messages?.moveRight ?? 'Move right',
      movedTo: messages?.movedTo ?? 'Moved {col} to position {n} of {m}',
      showTable: messages?.showTable ?? 'Show data table',
      loading: messages?.loading ?? 'Loading rows',
      empty: messages?.empty ?? 'No rows',
    }),
    [messages],
  );

  const [sortingState, setSorting] = useControllableState(sorting, defaultSorting ?? [], onSortingChange);
  const [rowSel, setRowSel] = useControllableState(rowSelection, defaultRowSelection ?? {}, onRowSelectionChange);
  const [vis, setVis] = useControllableState(columnVisibility, defaultColumnVisibility ?? {}, onColumnVisibilityChange);
  const [sizing, setSizing] = useControllableState(columnSizing, defaultColumnSizing ?? {}, onColumnSizingChange);
  const [pinning, setPinning] = useControllableState<ColumnPinningState>(
    columnPinning,
    defaultColumnPinning ?? {},
    onColumnPinningChange,
  );
  const [order, setOrder] = useControllableState<ColumnOrderState>(
    columnOrder,
    defaultColumnOrder ?? [],
    onColumnOrderChange,
  );
  const [page, setPage] = useControllableState<PaginationState>(
    pagination,
    defaultPagination ?? { pageIndex: 0, pageSize: 50 },
    onPaginationChange,
  );

  const [announcement, setAnnouncement] = React.useState('');

  if (process.env['NODE_ENV'] === 'development') {
    if (caption === undefined && ariaLabel === undefined && ariaLabelledBy === undefined) {
      console.warn('[auraglass] Table: pass caption or aria-label/aria-labelledby — the table must be named.');
    }
    if (selectionMode !== 'none' && getRowId === undefined) {
      console.warn('[auraglass] Table: getRowId is required when selectionMode is set.');
    }
    if (!virtualize && data.length > 500) {
      console.warn('[auraglass] Table: >500 rows without virtualize — pass virtualize for large datasets.');
    }
  }

  const helper = React.useMemo(() => createColumnHelper<TData>(), []);
  const allColumns = React.useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = [];
    if (selectionMode === 'multiple') {
      cols.push(
        helper.display({
          id: '__select',
          size: 44,
          minSize: 44,
          maxSize: 44,
          enableResizing: false,
          enableSorting: false,
          enablePinning: true,
          header: ({ table }) => (
            <input
              type="checkbox"
              aria-label={msgs.selectAll}
              data-ag-part="table-selection-all"
              checked={table.getIsAllRowsSelected()}
              ref={(el) => {
                if (el) el.indeterminate = table.getIsSomeRowsSelected();
              }}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              aria-label={`Select row ${row.id}`}
              data-ag-part="table-selection-cell"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        }),
      );
    }
    cols.push(...(columns as ColumnDef<TData, unknown>[]));
    return cols;
  }, [columns, selectionMode, helper, msgs.selectAll]);

  const sticky = stickyHeader ?? !!virtualize;

  const table = useReactTable({
    data: data as TData[],
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? { manualSorting: true } : { getSortedRowModel: getSortedRowModel() }),
    ...(manualPagination ? { manualPagination: true } : { getPaginationRowModel: getPaginationRowModel() }),
    state: {
      sorting: sortingState,
      rowSelection: rowSel,
      columnVisibility: vis,
      columnSizing: sizing,
      columnPinning: pinning,
      columnOrder: order,
      pagination: page,
    },
    onSortingChange: (u) =>
      setSorting((prev) => {
        const next = typeof u === 'function' ? u(prev) : u;
        return next;
      }),
    onRowSelectionChange: (u) => setRowSel((prev) => (typeof u === 'function' ? u(prev) : u)),
    onColumnVisibilityChange: (u) => setVis((prev) => (typeof u === 'function' ? u(prev) : u)),
    onColumnSizingChange: (u) => setSizing((prev) => (typeof u === 'function' ? u(prev) : u)),
    onColumnPinningChange: (u) => setPinning((prev) => (typeof u === 'function' ? u(prev) : u)),
    onColumnOrderChange: (u) => setOrder((prev) => (typeof u === 'function' ? u(prev) : u)),
    onPaginationChange: (u) => setPage((prev) => (typeof u === 'function' ? u(prev) : u)),
    ...(getRowId ? { getRowId: (r: TData, i: number) => getRowId(r, i) } : {}),
    enableSortingRemoval: true,
    sortDescFirst: false,
    enableMultiSort,
    enableRowSelection: selectionMode !== 'none',
    enableColumnResizing,
    columnResizeMode: data.length > 1000 ? 'onEnd' : 'onChange',
    ...(pageCount !== undefined ? { pageCount } : {}),
    ...(rowCount !== undefined ? { rowCount } : {}),
  });

  const rows = table.getRowModel().rows;
  const leafCols = table.getVisibleLeafColumns();
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  const vOpts = typeof virtualize === 'object' ? virtualize : {};
  const estimate = vOpts.estimateRowHeight ?? ROW_HEIGHT[size];
  const overscan = vOpts.overscan ?? 8;
  const virtualizer = useVirtualizer({
    count: virtualize ? rows.length : 0,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => estimate,
    overscan,
  });

  // Shift-range selection: anchor = last normally-clicked row index.
  const anchorIndex = React.useRef<number | null>(null);

  const handle = React.useMemo<TableHandle<TData>>(
    () => ({
      getInstance: () => table,
      scrollToRow: (rowId, align) => {
        const idx = rows.findIndex((r) => r.id === rowId);
        if (idx < 0) return;
        if (virtualize) {
          virtualizer.scrollToIndex(idx, align !== undefined ? { align } : {});
        }
        else {
          scrollerRef.current
            ?.querySelector(`[data-row-id="${CSS.escape(rowId)}"]`)
            ?.scrollIntoView?.({ block: align === 'end' ? 'end' : align === 'center' ? 'center' : 'nearest' });
        }
      },
      focusCell: (rowId, columnId) => {
        (
          scrollerRef.current?.querySelector(
            `[data-row-id="${CSS.escape(rowId)}"] [data-ag-cell="${CSS.escape(columnId)}"]`,
          ) as HTMLElement | null
        )?.focus();
      },
    }),
    [table, rows, virtualize, virtualizer],
  );
  React.useEffect(() => {
    if (typeof ref === 'function') {
      ref(handle);
      return () => {
        ref(null);
      };
    }
    if (ref && typeof ref === 'object') {
      const obj = ref as React.RefObject<TableHandle<TData> | null>;
      obj.current = handle;
      return () => {
        obj.current = null;
      };
    }
    return undefined;
  }, [handle, ref]);

  const onSortClick = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return;
    const label = (column.columnDef.meta?.headerLabel ?? columnId) as string;
    const next = column.getNextSortingOrder();
    column.toggleSorting();
    if (next === 'asc') setAnnouncement(msgs.sortedAsc.replace('{col}', label));
    else if (next === 'desc') setAnnouncement(msgs.sortedDesc.replace('{col}', label));
    else setAnnouncement(msgs.sortCleared.replace('{col}', label));
    void announce;
  };

  const moveColumn = (columnId: string, dir: -1 | 1) => {
    const ids = leafCols.map((c) => c.id);
    const i = ids.indexOf(columnId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    const next = [...ids];
    const [id] = next.splice(i, 1);
    next.splice(j, 0, id!);
    setOrder(next);
    const label = (table.getColumn(columnId)?.columnDef.meta?.headerLabel ?? columnId) as string;
    setAnnouncement(
      msgs.movedTo.replace('{col}', label).replace('{n}', String(j + 1)).replace('{m}', String(ids.length)),
    );
  };

  const visibleRows = virtualize ? virtualizer.getVirtualItems().map((vi) => rows[vi.index]!).slice(0) : rows;
  const totalSize = virtualize ? virtualizer.getTotalSize() : 0;

  const grid = mode === 'grid';
  const roleTable = grid ? 'grid' : undefined;
  const gridKeyboard = useGridKeyboard(scrollerRef);

  const renderHeaderCell = (headerGroupIndex: number, header: ReturnType<typeof table.getFlatHeaders>[number]) => {
    const meta = header.column.columnDef.meta;
    const sorted = header.column.getIsSorted();
    const canSort = header.column.getCanSort();
    const label = (meta?.headerLabel ?? header.column.id) as string;
    const cell = (
      <th
        key={header.id}
        scope="col"
        colSpan={header.colSpan}
        {...(grid ? { role: 'columnheader' } : {})}
        {...(canSort ? { 'aria-sort': sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none' } : {})}
        {...(sorted ? { 'data-sorted': sorted === 'asc' ? 'asc' : 'desc' } : {})}
        data-ag-part="table-header-cell"
        className="ag-table__th"
        style={{
          width: header.getSize(),
          textAlign: meta?.numeric ? 'end' : meta?.align,
          ...pinnedStyle(header.column),
        }}
      >
        {canSort ? (
          <button
            type="button"
            data-ag-part="table-sort-trigger"
            className="ag-table__sort"
            aria-label={msgs.sortBy.replace('{col}', label)}
            onClick={() => onSortClick(header.column.id)}
          >
            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
          </button>
        ) : (
          flexRender(header.column.columnDef.header, header.getContext())
        )}
        {enableColumnReordering && !header.isPlaceholder ? (
          <span className="ag-table__col-actions">
            <button
              type="button"
              aria-label={`${msgs.moveLeft} ${label}`}
              onClick={() => moveColumn(header.column.id, -1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={`${msgs.moveRight} ${label}`}
              onClick={() => moveColumn(header.column.id, 1)}
            >
              ›
            </button>
          </span>
        ) : null}
        {enableColumnResizing && header.column.getCanResize() && !header.isPlaceholder ? (
          <ResizeHandleInner
            header={header}
            table={table}
            label={msgs.resize.replace('{col}', label)}
          />
        ) : null}
      </th>
    );
    return cell;
  };

  const renderRow = (row: (typeof rows)[number], viIndex: number, absoluteTop?: number) => {
    const selected = row.getIsSelected();
    const cells = row.getVisibleCells();
    return (
      <tr
        key={row.id}
        data-ag-part="table-row"
        data-row-id={row.id}
        {...(selected ? { 'data-selected': '' } : {})}
        {...(loading ? { 'data-state': 'loading' } : {})}
        {...(selectionMode !== 'none' ? { 'aria-selected': selected } : {})}
        {...(virtualize ? { 'aria-rowindex': viIndex + 2 } : {})}
        {...(grid ? { role: 'row' } : {})}
        className="ag-table__tr"
        onClick={
          selectionMode === 'multiple'
            ? (e) => {
                if (e.shiftKey && anchorIndex.current !== null) {
                  const lo = Math.min(anchorIndex.current, viIndex);
                  const hi = Math.max(anchorIndex.current, viIndex);
                  const next: RowSelectionState = { ...rowSel };
                  for (let k = lo; k <= hi; k++) next[rows[k]!.id] = true;
                  setRowSel(next);
                } else {
                  anchorIndex.current = viIndex;
                }
                onRowAction?.(row.original);
              }
            : selectionMode === 'single'
              ? () => {
                  row.toggleSelected();
                  onRowAction?.(row.original);
                }
              : onRowAction !== undefined
                ? () => onRowAction(row.original)
                : undefined
        }
        style={
          absoluteTop !== undefined
            ? { position: 'absolute', top: 0, transform: `translateY(${absoluteTop}px)`, width: '100%' }
            : undefined
        }
      >
        {cells.map((cell) => {
          const meta = cell.column.columnDef.meta;
          const content = flexRender(cell.column.columnDef.cell, cell.getContext());
          const isSelectCol = cell.column.id === '__select';
          const tag = isSelectCol ? 'td' : 'td';
          const el = React.createElement(
            tag,
            {
              key: cell.id,
              ...(grid ? { role: 'gridcell', tabIndex: -1 } : {}),
              'data-ag-part': isSelectCol ? 'table-selection-cell' : 'table-cell',
              'data-ag-cell': cell.column.id,
              className: `ag-table__td${meta?.truncate ? ' ag-table__td--truncate' : ''}`,
              style: {
                width: cell.column.getSize(),
                ...(meta?.numeric
                  ? { textAlign: 'end', fontVariantNumeric: 'tabular-nums' }
                  : meta?.align
                    ? { textAlign: meta.align }
                    : {}),
                ...pinnedStyle(cell.column),
              },
            },
            content,
          );
          return el;
        })}
      </tr>
    );
  };

  return (
    <div
      data-ag-part="table-root"
      className={`ag-table ag-table--${size}${className ? ` ${className}` : ''}`}
      data-ag-size={size}
    >
      <div
        ref={scrollerRef}
        data-ag-part="table-scroller"
        className="ag-table__scroller"
        {...(grid ? { tabIndex: 0, onKeyDown: gridKeyboard.onKeyDown } : {})}
        style={maxHeight !== undefined ? { maxHeight, overflow: 'auto' } : { overflow: 'auto' }}
      >
        <table
          {...(roleTable !== undefined ? { role: roleTable } : {})}
          {...(virtualize ? { 'aria-rowcount': (rowCount ?? data.length) + 1 } : {})}
          {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
          {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
          aria-busy={loading || undefined}
          className="ag-table__table"
        >
          {caption !== undefined ? <caption>{caption}</caption> : null}
          <thead data-ag-part="table-header" className={sticky ? 'ag-table__thead--sticky' : 'ag-table__thead'}>
            {table.getHeaderGroups().map((hg, i) => (
              <tr key={hg.id} {...(grid ? { role: 'row' } : {})}>
                {hg.headers.map((h) => renderHeaderCell(i, h))}
              </tr>
            ))}
          </thead>
          <tbody
            data-ag-part="table-body"
            style={virtualize ? { height: totalSize, position: 'relative', display: 'block' } : undefined}
          >
            {loading ? (
              <tr data-ag-part="table-loading">
                <td colSpan={leafCols.length}>{msgs.loading}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr data-ag-part="table-empty">
                <td colSpan={leafCols.length}>{emptyState ?? msgs.empty}</td>
              </tr>
            ) : virtualize ? (
              virtualizer.getVirtualItems().map((vi) => renderRow(rows[vi.index]!, vi.index, vi.start))
            ) : (
              visibleRows.map((row, i) => renderRow(row, i))
            )}
          </tbody>
        </table>
        <span aria-live="polite" role="status" className="ag-visually-hidden">
          {announcement}
        </span>
      </div>
    </div>
  );
}
