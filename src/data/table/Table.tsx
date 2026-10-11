'use client';
/* Table<TData> (SURF-155/162/164/165, REQ-SURF-66..78): one TanStack table
   with sorting, selection (single/multiple + shift-range), column
   visibility/sizing/pinning/reorder, pagination, virtualization, grid-mode
   keyboard. mode='table' renders real <table> semantics; 'grid' renders
   grid/row/gridcell + the keyboard model. All row models are imported
   per feature so unused ones tree-shake (manual* flags skip the client
   models). Ref is a prop (React 19; no forwardRef). */
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
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type Table as TanStackTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAnnouncer } from '../../theme';
import { Checkbox } from '../../components/checkbox';
import { Menu } from '../../components/menu';
import { IconButton } from '../../components/icon-button';
import { Skeleton } from '../../components/skeleton';
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
  columnMenu?: string | undefined;
  hideColumn?: string | undefined;
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

const ROW_HEIGHT: Record<TableDensity, number> = { sm: 32, md: 40, lg: 48 };

type PinnableColumn = {
  getIsPinned: () => false | 'left' | 'right';
  getStart: (position?: 'left' | 'center' | 'right') => number;
  getAfter: (position?: 'left' | 'center' | 'right') => number;
  getIsLastColumn: (position?: 'left' | 'center' | 'right') => boolean;
  getIsFirstColumn: (position?: 'left' | 'center' | 'right') => boolean;
};

/* SURF-072: pinned cells are sticky with inset-inline-start from
   getStart('left') / inset-inline-end from getAfter('right') (logical, so
   RTL flips). data-ag-pinned marks the cell for table.css (surface + layer);
   data-ag-pinned-edge marks the boundary of each pin region (last start-
   pinned / first end-pinned) where table.css draws --_ag-table-pin-shadow. */
function pinAttrs(column: PinnableColumn): Record<string, string> {
  const pinned = column.getIsPinned();
  if (pinned === false) return {};
  const edge =
    pinned === 'left' ? (column.getIsLastColumn('left') ? 'start' : null) : column.getIsFirstColumn('right') ? 'end' : null;
  return { 'data-ag-pinned': pinned === 'left' ? 'start' : 'end', ...(edge !== null ? { 'data-ag-pinned-edge': edge } : {}) };
}

function pinStyle(column: PinnableColumn): React.CSSProperties {
  const pinned = column.getIsPinned();
  if (pinned === false) return {};
  return pinned === 'left'
    ? { position: 'sticky', insetInlineStart: column.getStart('left') }
    : { position: 'sticky', insetInlineEnd: column.getAfter('right') };
}

interface RowCtx<TData> {
  onRowAction: ((row: TData) => void) | undefined;
  selectionMode: SelectionMode;
  /** Toggle (shift=false) or range-select from the anchor (shift=true). */
  select: (rowId: string, shift: boolean) => void;
  /** A cell received focus: it becomes the grid's active cell. */
  focusCell: (rowId: string, columnId: string) => void;
}

interface TableRowProps<TData> {
  row: Row<TData>;
  index: number;
  top: number | undefined;
  selected: boolean;
  loading: boolean;
  grid: boolean;
  virtualized: boolean;
  /** Set only on the row owning the grid's roving tab stop. */
  activeColumnId: string | undefined;
  /** Identity token: columns/visibility/sizing/pinning/order. */
  layout: object;
  ctx: React.RefObject<RowCtx<TData>>;
}

function TableRowImpl<TData>({
  row,
  index,
  top,
  selected,
  loading,
  grid,
  virtualized,
  activeColumnId,
  ctx,
}: TableRowProps<TData>) {
  const c = () => ctx.current!;
  const inSelectCell = (t: EventTarget) => (t as HTMLElement).closest?.('[data-ag-cell="__select"]') != null;
  return (
    <tr
      data-ag-part="table-row"
      data-row-id={row.id}
      {...(selected ? { 'data-selected': '' } : {})}
      {...(loading ? { 'data-state': 'loading' } : {})}
      {...(c().selectionMode !== 'none' ? { 'aria-selected': selected } : {})}
      {...(virtualized ? { 'aria-rowindex': index + 2 } : {})}
      {...(grid ? { role: 'row' } : {})}
      className="ag-table__tr"
      onClick={(e) => {
        const { selectionMode, onRowAction, select } = c();
        // SURF-069: the checkbox cell selects through its own onCheckedChange.
        if (selectionMode !== 'none' && !inSelectCell(e.target)) {
          if (selectionMode === 'multiple') select(row.id, e.shiftKey);
          else row.toggleSelected();
        }
        onRowAction?.(row.original);
      }}
      style={
        top !== undefined
          ? { position: 'absolute', top: 0, transform: `translateY(${top}px)`, width: '100%' }
          : undefined
      }
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        const isSelectCol = cell.column.id === '__select';
        return (
          <td
            key={cell.id}
            {...(grid
              ? {
                  role: 'gridcell',
                  // SURF-073: the roving active cell is the only tab stop.
                  tabIndex: activeColumnId === cell.column.id ? 0 : -1,
                  onFocus: () => c().focusCell(row.id, cell.column.id),
                }
              : {})}
            onKeyDown={(e) => {
              const { selectionMode, onRowAction, select } = c();
              if (grid && e.key === 'Enter') {
                // SURF-073: Enter activates the row.
                e.preventDefault();
                onRowAction?.(row.original);
              } else if (e.key === ' ' && selectionMode !== 'none' && (grid || (isSelectCol && e.shiftKey))) {
                // SURF-073: Space toggles; SURF-069: Shift+Space selects the
                // anchor..row range on the sorted model. (Plain Space on the
                // table-mode checkbox is the checkbox's own activation.)
                e.preventDefault();
                if (selectionMode === 'multiple') select(row.id, e.shiftKey);
                else row.toggleSelected();
              }
            }}
            data-ag-part={isSelectCol ? 'table-selection-cell' : 'table-cell'}
            data-ag-cell={cell.column.id}
            {...pinAttrs(cell.column)}
            className={`ag-table__td${meta?.truncate ? ' ag-table__td--truncate' : ''}`}
            style={{
              width: cell.column.getSize(),
              ...(meta?.numeric
                ? { textAlign: 'end', fontVariantNumeric: 'tabular-nums' }
                : meta?.align
                  ? { textAlign: meta.align }
                  : {}),
              ...pinStyle(cell.column),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

const TableRow = React.memo(TableRowImpl) as typeof TableRowImpl;

const MenuRoot = Menu.Root as React.FC<{ children?: React.ReactNode }>;
const MenuTrigger = Menu.Trigger as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuContent = Menu.Content as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuItem = Menu.Item as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MaybePortal = ('Portal' in Menu ? Menu.Portal : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
const MaybePositioner = ('Positioner' in Menu ? Menu.Positioner : React.Fragment) as React.FC<{ children?: React.ReactNode }>;

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
  // SURF-071: declared min/max used verbatim (no 48/800 hard clamps).
  // Tanstack fills unset columns with its own defaults (20 /
  // Number.MAX_SAFE_INTEGER) — those count as undeclared, not user intent.
  const declaredMin = header.column.columnDef.minSize;
  const declaredMax = header.column.columnDef.maxSize;
  const min = declaredMin !== undefined && declaredMin !== 20 ? declaredMin : 48;
  const max = declaredMax !== undefined && declaredMax !== Number.MAX_SAFE_INTEGER ? declaredMax : 800;
  const setSize = (px: number) => {
    const next = Math.min(Math.max(px, min), max);
    table.setColumnSizing((prev) => ({ ...prev, [header.column.id]: next }));
  };
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={header.column.getSize()}
      aria-valuemin={min}
      aria-valuemax={max}
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
        // SURF-071: direction resolved off the element (closest [dir] /
        // computed style), not the document — a dir="rtl" subtree must flip.
        const el = e.currentTarget as HTMLElement;
        const dirAttr = el.closest('[dir]')?.getAttribute('dir');
        const rtl =
          dirAttr !== null && dirAttr !== undefined
            ? dirAttr === 'rtl'
            : getComputedStyle(el).direction === 'rtl';
        const grow = rtl ? 'ArrowLeft' : 'ArrowRight';
        const shrink = rtl ? 'ArrowRight' : 'ArrowLeft';
        const step = e.shiftKey ? 32 : 8;
        if (e.key === grow) setSize(start + step);
        else if (e.key === shrink) setSize(start - step);
        else if (e.key === 'Home') setSize(min);
        else if (e.key === 'End') setSize(max);
        else return;
        e.preventDefault();
      }}
    />
  );
}

export function Table<TData>(props: TableProps<TData>) {
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
      columnMenu: messages?.columnMenu ?? 'Column actions',
      hideColumn: messages?.hideColumn ?? 'Hide',
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

  // SURF-066: announcements go through the MAT useAnnouncer seam (no local
  // status span — provider wires the live region; no-op without a portal).
  const { announce } = useAnnouncer();
  const hasPagination =
    manualPagination ||
    pagination !== undefined ||
    defaultPagination !== undefined ||
    onPaginationChange !== undefined;

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

  // SURF-069: selection goes through one ref'd handler so the memoized
  // column defs never change identity when selection state changes.
  const selectRef = React.useRef<(rowId: string, shift: boolean) => void>(() => undefined);
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
          // REQ-SURF-75: the checkboxes carry CMP's own parts; the table
          // part for the column is the cell (table-selection-cell) only.
          header: ({ table }) => (
            <Checkbox
              aria-label={msgs.selectAll}
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onCheckedChange={() => table.toggleAllRowsSelected()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              aria-label={`Select row ${row.id}`}
              checked={row.getIsSelected()}
              onCheckedChange={(_checked, details) =>
                selectRef.current(row.id, (details.event as MouseEvent | KeyboardEvent | undefined)?.shiftKey === true)
              }
            />
          ),
        }),
      );
    }
    cols.push(...(columns as ColumnDef<TData, unknown>[]));
    return cols;
  }, [columns, selectionMode, helper, msgs.selectAll]);

  const sticky = stickyHeader ?? !!virtualize;
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  // SURF-072: below 480 px with >3 data columns and no pinning props, the
  // selection column + first data column auto-pin to the start edge.
  const pinPropsGiven = columnPinning !== undefined || defaultColumnPinning !== undefined;
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (pinPropsGiven || el === null || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1]?.contentRect.width ?? el.clientWidth;
      setNarrow(w > 0 && w < 480);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pinPropsGiven]);
  const firstDataCol = columns[0] as { id?: string; accessorKey?: unknown } | undefined;
  const firstDataColId = firstDataCol?.id ?? (typeof firstDataCol?.accessorKey === 'string' ? firstDataCol.accessorKey : undefined);
  const autoPin = !pinPropsGiven && narrow && columns.length > 3 && firstDataColId !== undefined;
  const effectivePinning = React.useMemo<ColumnPinningState>(
    () =>
      autoPin
        ? { left: [...(selectionMode === 'multiple' ? ['__select'] : []), firstDataColId!], right: [] }
        : pinning,
    [autoPin, selectionMode, firstDataColId, pinning],
  );

  const table = useReactTable({
    data: data as TData[],
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? { manualSorting: true } : { getSortedRowModel: getSortedRowModel() }),
    ...(manualPagination
      ? { manualPagination: true }
      : hasPagination
        ? { getPaginationRowModel: getPaginationRowModel() }
        : {}),
    state: {
      sorting: sortingState,
      rowSelection: rowSel,
      columnVisibility: vis,
      columnSizing: sizing,
      columnPinning: effectivePinning,
      columnOrder: order,
      // SURF-066: pagination state only participates when a pagination prop
      // was supplied — keeps the row model out of the tree otherwise.
      ...(hasPagination ? { pagination: page } : {}),
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
    enableMultiRowSelection: selectionMode === 'multiple',
    enableColumnResizing,
    columnResizeMode: data.length > 1000 ? 'onEnd' : 'onChange',
    ...(pageCount !== undefined ? { pageCount } : {}),
    ...(rowCount !== undefined ? { rowCount } : {}),
  });

  // SURF-067/070: resolve + virtualize over the FULL (pre-pagination) row
  // model — paginated slices only apply when pagination props were passed.
  const allRows = table.getPrePaginationRowModel().rows;
  const rows = virtualize || !hasPagination ? allRows : table.getRowModel().rows;
  const leafCols = table.getVisibleLeafColumns();
  // Identity token for everything a row's cells depend on besides the row
  // itself — column defs, visibility, sizing, pinning and order.
  const layoutDeps = React.useMemo(
    () => [allColumns, vis, sizing, effectivePinning, order] as const,
    [allColumns, vis, sizing, effectivePinning, order],
  );

  const vOpts = typeof virtualize === 'object' ? virtualize : {};
  const estimate = vOpts.estimateRowHeight ?? ROW_HEIGHT[size];
  const overscan = vOpts.overscan ?? 8;
  const virtualizer = useVirtualizer({
    count: virtualize ? rows.length : 0,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => estimate,
    overscan,
  });

  // Shift-range selection anchor: index into `rows` (the sorted model).
  const anchorIndex = React.useRef<number | null>(null);
  selectRef.current = (rowId, shift) => {
    const idx = rows.findIndex((r) => r.id === rowId);
    if (idx < 0) return;
    if (shift && anchorIndex.current !== null) {
      const lo = Math.min(anchorIndex.current, idx);
      const hi = Math.max(anchorIndex.current, idx);
      const next: RowSelectionState = { ...rowSel };
      for (let k = lo; k <= hi; k++) next[rows[k]!.id] = true;
      setRowSel(next);
      return;
    }
    anchorIndex.current = idx;
    rows[idx]!.toggleSelected();
  };

  const handle = React.useMemo<TableHandle<TData>>(
    () => ({
      getInstance: () => table,
      scrollToRow: (rowId, align) => {
        const idx = allRows.findIndex((r) => r.id === rowId);
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
    [table, allRows, virtualize, virtualizer],
  );
  React.useEffect(() => {
    if (typeof ref === 'function') {
      ref(handle);
      return () => {
        ref(null);
      };
    }
    if (ref && typeof ref === 'object') {
      const obj = ref as React.MutableRefObject<TableHandle<TData> | null>;
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
    if (next === 'asc') announce(msgs.sortedAsc.replace('{col}', label));
    else if (next === 'desc') announce(msgs.sortedDesc.replace('{col}', label));
    else announce(msgs.sortCleared.replace('{col}', label));
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
    announce(
      msgs.movedTo.replace('{col}', label).replace('{n}', String(j + 1)).replace('{m}', String(ids.length)),
    );
  };

  const visibleRows = virtualize ? virtualizer.getVirtualItems().map((vi) => rows[vi.index]!).slice(0) : rows;
  const totalSize = virtualize ? virtualizer.getTotalSize() : 0;

  const grid = mode === 'grid';
  const roleTable = grid ? 'grid' : undefined;
  // SURF-073: APG data-grid roving tabindex — one cell owns tabIndex 0. The
  // active cell is tracked by rowId+columnId so focus survives the row being
  // unmounted by virtualization and is re-resolved when it mounts again.
  const [activeCell, setActiveCell] = React.useState<{ rowId: string; columnId: string } | null>(null);
  const activeRowId = activeCell?.rowId ?? rows[0]?.id;
  const activeColId = activeCell?.columnId ?? leafCols[0]?.id;
  const focusWanted = React.useRef(false);
  const cellEl = (rowId: string, columnId: string) =>
    scrollerRef.current?.querySelector<HTMLElement>(
      `[data-row-id="${CSS.escape(rowId)}"] [data-ag-cell="${CSS.escape(columnId)}"]`,
    ) ?? null;
  React.useLayoutEffect(() => {
    if (!grid || !focusWanted.current || activeRowId === undefined || activeColId === undefined) return;
    const el = cellEl(activeRowId, activeColId);
    const doc = scrollerRef.current?.ownerDocument;
    // Only reclaim focus when nothing else took it (row unmount drops focus
    // to <body>); never steal focus from another control.
    if (el !== null && doc !== undefined && el !== doc.activeElement &&
        (doc.activeElement === null || doc.activeElement === doc.body || scrollerRef.current!.contains(doc.activeElement))) {
      el.focus();
    }
  });
  const gridKeyboard = useGridKeyboard({
    rowIds: () => rows.map((r) => r.id),
    columnIds: () => leafCols.map((c) => c.id),
    pageRows: () => Math.floor((scrollerRef.current?.clientHeight ?? 0) / estimate),
    moveTo: (rowId, columnId, rowIndex) => {
      focusWanted.current = true;
      setActiveCell({ rowId, columnId });
      const el = cellEl(rowId, columnId);
      if (el !== null) el.focus();
      else if (virtualize) virtualizer.scrollToIndex(rowIndex);
    },
  });

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
        {...pinAttrs(header.column)}
        style={{
          width: header.getSize(),
          ...(meta?.numeric
            ? { textAlign: 'end', fontVariantNumeric: 'tabular-nums' }
            : meta?.align
              ? { textAlign: meta.align }
              : {}),
          ...pinStyle(header.column),
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
        {enableColumnReordering && !header.isPlaceholder && header.column.id !== '__select' ? (
          <MenuRoot>
            <MenuTrigger
              render={<IconButton label={`${msgs.columnMenu ?? 'Column actions'} ${label}`} icon={'\u2026'} />}
              data-ag-part="table-column-menu"
              className="ag-table__col-menu"
            />
            <MaybePortal>
              <MaybePositioner>
                <MenuContent>
                  <MenuItem onClick={() => moveColumn(header.column.id, -1)}>
                    {msgs.moveLeft} {label}
                  </MenuItem>
                  <MenuItem onClick={() => moveColumn(header.column.id, 1)}>
                    {msgs.moveRight} {label}
                  </MenuItem>
                  {header.column.getCanHide() ? (
                    <MenuItem onClick={() => header.column.toggleVisibility(false)}>
                      {msgs.hideColumn ?? 'Hide'} {label}
                    </MenuItem>
                  ) : null}
                </MenuContent>
              </MaybePositioner>
            </MaybePortal>
          </MenuRoot>
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

  // SURF-069: rows are a memoized component; the latest handlers live in a
  // stable ref so a selection toggle re-renders only the changed row (its
  // `selected` prop flips) plus the header checkbox.
  const rowCtx = React.useRef<RowCtx<TData>>(null as unknown as RowCtx<TData>);
  rowCtx.current = {
    onRowAction,
    selectionMode,
    select: (rowId, shift) => selectRef.current(rowId, shift),
    focusCell: (rowId, columnId) => {
      focusWanted.current = true;
      setActiveCell((prev) => (prev?.rowId === rowId && prev.columnId === columnId ? prev : { rowId, columnId }));
    },
  };
  const renderRow = (row: (typeof rows)[number], index: number, top?: number) => (
    <TableRow<TData>
      key={row.id}
      row={row}
      index={index}
      top={top}
      selected={row.getIsSelected()}
      loading={loading}
      grid={grid}
      virtualized={!!virtualize}
      activeColumnId={grid && row.id === activeRowId ? activeColId : undefined}
      layout={layoutDeps}
      ctx={rowCtx}
    />
  );
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
        {...(grid
          ? {
              onKeyDown: gridKeyboard.onKeyDown,
              // Focus moved to another control: stop reclaiming it.
              onBlur: (e: React.FocusEvent) => {
                if (e.relatedTarget !== null && !e.currentTarget.contains(e.relatedTarget as Node)) {
                  focusWanted.current = false;
                }
              },
            }
          : {})}
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
              <tr key={hg.id} {...(grid ? { role: 'row' } : {})} {...(virtualize ? { 'aria-rowindex': 1 + i } : {})}>
                {hg.headers.map((h) => renderHeaderCell(i, h))}
              </tr>
            ))}
          </thead>
          <tbody
            data-ag-part="table-body"
            style={virtualize ? { height: totalSize, position: 'relative', display: 'block' } : undefined}
          >
            {/* SURF-074: loading KEEPS the rows (each data-state='loading')
                and appends 8 skeleton rows; empty moved onto the td. */}
            {(virtualize
              ? virtualizer.getVirtualItems().map((vi) => renderRow(rows[vi.index]!, vi.index, vi.start))
              : visibleRows.map((row, i) => renderRow(row, i)))}
            {loading
              ? Array.from({ length: 8 }, (_, i) => (
                  <tr key={`loading-${i}`} data-ag-part="table-loading" aria-hidden="true">
                    {leafCols.map((col) => (
                      <td key={col.id} data-ag-part="table-cell" className="ag-table__td">
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              : null}
            {rows.length === 0 && !loading ? (
              <tr>
                <td colSpan={leafCols.length} data-ag-part="table-empty">
                  {emptyState ?? msgs.empty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
