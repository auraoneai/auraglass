"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GlassButton } from "../button/GlassButton";

export type GlassFormTableRow = object;

export interface ColumnDef<T extends GlassFormTableRow = GlassFormTableRow> {
  key: Extract<keyof T, string>;
  header: string;
}
export interface GlassFormTableProps<
  T extends GlassFormTableRow = GlassFormTableRow,
> {
  columns: ColumnDef<T>[];
  rows: T[];
  onChange: (rows: T[]) => void;
  className?: string;
  "data-testid"?: string;
}

export function GlassFormTable<
  T extends GlassFormTableRow = GlassFormTableRow,
>({
  columns,
  rows,
  onChange,
  className,
  "data-testid": dataTestId,
}: GlassFormTableProps<T>) {
  const safeColumns = columns ?? [];
  const safeRows = rows ?? [];
  const update = (ri: number, key: Extract<keyof T, string>, value: string) => {
    const next = safeRows.slice();
    next[ri] = { ...next[ri], [key]: value } as T;
    onChange(next);
  };
  const add = () => onChange([...safeRows, {} as T]);
  const remove = (ri: number) => onChange(safeRows.filter((_, i) => i !== ri));
  return (
    <div
      data-glass-component
      className={cn(
        "glass-overflow-auto glass-radius-xl glass-border glass-border-white-15",
        className
      )}
      data-testid={dataTestId}
      role="region"
      aria-label="Editable data table"
    >
      <table
        className={cn("glass-w-full glass-text-sm")}
        role="table"
        aria-label="Form data table"
      >
        <thead className={cn("glass-surface-white-5")}>
          <tr role="row">
            {safeColumns.map((c) => (
              <th
                key={String(c.key)}
                role="columnheader"
                className={cn(
                  "glass-text-left glass-px-3 glass-py-2 glass-text-primary-70"
                )}
              >
                {c.header}
              </th>
            ))}
            <th
              role="columnheader"
              className={cn("glass-px-3 glass-py-2")}
              aria-label="Actions"
              scope="col"
            >
              <span className="glass-sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {safeRows.map((r, ri) => (
            <tr
              key={ri}
              role="row"
              className={cn("glass-border-t glass-border-white-10")}
            >
              {safeColumns.map((c) => (
                <td
                  key={String(c.key)}
                  role="gridcell"
                  className={cn("glass-px-3 glass-py-2")}
                >
                  <input
                    className={cn(
                      "glass-bg-transparent glass-border glass-border-white-20 glass-radius-md glass-px-2 glass-py-1 glass-w-full glass-focus glass-touch-target glass-contrast-guard"
                    )}
                    value={String(r[c.key] ?? "")}
                    onChange={(e) => update(ri, c.key, e.target.value)}
                    aria-label={`${c.header} for row ${ri + 1}`}
                  />
                </td>
              ))}
              <td
                role="gridcell"
                className={cn("glass-px-3 glass-py-2 glass-text-right")}
              >
                <GlassButton
                  size="sm"
                  variant="ghost"
                  onClick={(e) => remove(ri)}
                  aria-label={`Remove row ${ri + 1}`}
                >
                  Remove
                </GlassButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn("glass-p-2")}>
        <GlassButton
          size="sm"
          variant="secondary"
          onClick={add}
          aria-label="Add new row"
        >
          Add Row
        </GlassButton>
      </div>
    </div>
  );
}

export default GlassFormTable;
