"use client";
import React from "react";
import {
  ColumnDef,
  GlassDataTable,
  GlassDataTableProps,
  GlassDataTableRow,
} from "./GlassDataTable";

export interface GlassVirtualTableProps<
  T extends GlassDataTableRow = GlassDataTableRow,
> extends Omit<GlassDataTableProps<T>, "columns" | "data"> {
  columns?: ColumnDef<T>[];
  rows?: T[];
  children?: React.ReactNode;
  disabled?: boolean;
}

export function GlassVirtualTable<
  T extends GlassDataTableRow = GlassDataTableRow,
>({ columns, rows, ...rest }: GlassVirtualTableProps<T>) {
  // In a future iteration this can swap to an actual virtualized list implementation.
  // ContrastGuard text coverage is tracked in the manual accessibility QA report.

  return <GlassDataTable columns={columns ?? []} data={rows ?? []} {...rest} />;
}

export default GlassVirtualTable;
