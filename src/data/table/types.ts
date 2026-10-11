// src/data/table/types.ts (SURF-153): column + prop types for Table.
// TableColumnDef is a TanStack ColumnDef re-export; the `meta` keys the
// renderer honours are declared by module augmentation so consumers get
// typing without importing @tanstack/react-table internals.
import type { ColumnDef, Table as TanStackTable } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    /** text-align for header + cells. */
    align?: 'start' | 'center' | 'end';
    /** tabular-nums + align end (numeric columns). */
    numeric?: boolean;
    /** ellipsis the cell content. */
    truncate?: boolean;
    /** Accessible name for the sort button + resize handle. */
    headerLabel?: string;
    /** 5.1 inline edit (C-E): editor kind for the column. */
    editor?: 'text' | 'number' | 'select';
    /** Options for editor: 'select'. */
    options?: readonly { value: string; label: string }[];
    /** Render this column's body cells as row headers (`<th scope="row">`;
     *  role="rowheader" in grid mode) — the cell that names its row. */
    rowHeader?: boolean;
  }
}

export type TableColumnDef<TData> = ColumnDef<TData, unknown>;
export type { TanStackTable };

export type TableDensity = 'sm' | 'md' | 'lg';
export type TableMode = 'table' | 'grid';
export type SelectionMode = 'none' | 'single' | 'multiple';
