import React from "react";

export type DataDisplayRow = Record<string, unknown>;
export type DataDisplayCellValue = unknown;

export interface ColumnDefinition<T extends DataDisplayRow = DataDisplayRow> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: DataDisplayCellValue, row: T) => React.ReactNode;
  id?: string;
  header?: string;
  cellRenderer?: (value: DataDisplayCellValue, row: T) => React.ReactNode;
  accessorKey?: string;
  placeholder?: React.ReactNode;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc" | null;
}

export interface GlassDataGridProps<T extends DataDisplayRow = DataDisplayRow>
  extends React.HTMLAttributes<HTMLDivElement> {
  data?: T[];
  columns?: ColumnDefinition<T>[];
  sortable?: boolean;
  onSort?: (sortState: SortState) => void;
  height?: string | number;
  /** Compact mode for constrained cards, drawers, and documentation previews. */
  compact?: boolean;
  /** Contain the grid in a bounded viewport. */
  contained?: boolean;
  /** Maximum rendered height when contained or compact. */
  maxHeight?: string | number;
  initialSort?: SortState;
  enableRowDragging?: boolean;
  onRowOrderChange?: (newOrder: T[]) => void;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}
