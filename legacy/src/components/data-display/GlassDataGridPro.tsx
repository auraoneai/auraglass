"use client";
import { cn } from "../../lib/utilsComprehensive";

import React from "react";
import { ColumnDef, GlassDataTable, GlassDataTableRow } from "./GlassDataTable";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassDataGridProColumn<
  T extends GlassDataTableRow = GlassDataTableRow,
> extends ColumnDef<T> {
  key?: string;
}

export interface GlassDataGridProProps<
  T extends GlassDataTableRow = GlassDataTableRow,
> extends React.HTMLAttributes<HTMLDivElement> {
  columns?: GlassDataGridProColumn<T>[];
  rows?: T[];
  grouping?: string[];
  density?: "compact" | "normal" | "spacious";
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
}

// Lightweight wrapper around GlassDataTable; placeholder for advanced features
export const GlassDataGridPro = React.forwardRef<
  HTMLDivElement,
  GlassDataGridProProps
>(
  (
    {
      columns = [],
      rows = [],
      className,
      density = "normal",
      compact = false,
      contained = false,
      maxHeight,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    // ContrastGuard text coverage is tracked in the manual accessibility QA report.
    const normalizedColumns = React.useMemo<ColumnDef<GlassDataTableRow>[]>(
      () =>
        columns.map(({ key, ...column }) => ({
          ...column,
          id: column.id ?? key,
          accessorKey: column.accessorKey ?? key,
        })),
      [columns]
    );

    return (
      <div
        ref={ref}
        className={cn(className)}
        role="region"
        aria-label={ariaLabel || "Data Grid Pro"}
        data-testid={dataTestId}
        {...props}
      >
        <GlassDataTable
          columns={normalizedColumns}
          data={rows}
          compact={compact || density === "compact"}
          contained={contained}
          maxHeight={maxHeight}
        />
      </div>
    );
  }
);

GlassDataGridPro.displayName = "GlassDataGridPro";

export default GlassDataGridPro;
