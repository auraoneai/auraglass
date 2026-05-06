"use client";
import React, { useState, useMemo } from "react";
import { Glass } from "../../../primitives";
import { cn } from "../../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  width?: string;
}

export interface GlassDataTableProps<T>
  extends React.HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  loadingRows?: number;
}

export function GlassDataTable<T extends Record<string, any>>({
  // ContrastGuard text coverage is tracked in the manual accessibility QA report.

  data,
  columns,
  loading = false,
  searchable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage = "No data available",
  loadingRows = 5,
  className,
  ...props
}: GlassDataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      result = result.filter((item: any) =>
        columns.some(
          (col) =>
            col.filterable !== false &&
            String(item[col.key])
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columns, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = paginated
    ? processedData.slice(startIndex, startIndex + pageSize)
    : processedData;

  const handleSort = (columnKey: keyof T) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: loadingRows }).map((_, index) => (
        <tr key={`loading-${index}`} className="glass-animate-pulse">
          {columns.map((column, colIndex) => (
            <td key={`loading-${index}-${colIndex}`} className="glass-p-4">
              <div className="glass-h-4 glass-surface-subtle glass-radius"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="glass-p-12 glass-text-center">
        <div className="glass-flex glass-flex-col glass-items-center glass-gap-4 glass-text-secondary">
          <div className="glass-text-6xl glass-opacity-50">📭</div>
          <div className="glass-font-medium">{emptyMessage}</div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="glass-px-4 glass-py-2 glass-surface-primary/10 hover:glass-surface-primary/20 glass-radius-lg glass-text-primary glass-text-sm glass-font-medium glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              Clear Search
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const renderPagination = () => {
    if (!paginated || totalPages <= 1) return null;

    return (
      <div
        data-glass-component
        className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-t glass-border-glass-border"
      >
        <div className="glass-text-sm glass-text-secondary">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + pageSize, processedData.length)} of{" "}
          {processedData.length} results
        </div>

        <div className="glass-flex glass-items-center glass-gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="glass-px-3 glass-py-1 glass-radius-md glass-border glass-border-glass-border hover:glass-surface-subtle disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "glass-px-3 glass-py-1 glass-radius-md border transition-colors glass-focus glass-touch-target glass-contrast-guard",
                  currentPage === page
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="glass-px-3 glass-py-1 glass-radius-md glass-border glass-border-glass-border hover:glass-surface-subtle disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <Glass
      className={cn("glass-radius-xl overflow-hidden", className)}
      {...props}
    >
      {/* Header with search */}
      {searchable && (
        <div className="glass-p-4 glass-border-b glass-border-glass-border">
          <div className="glass-relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="glass-w-full glass-px-4 glass-py-2 glass-pl-10 glass-bg-background glass-border glass-border-glass-border glass-radius-lg glass-focus-outline-none glass-focus-ring-2 glass-focus-ring-primary/20 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            />
            <div className="glass-absolute glass-left-3 glass-top-1/2 glass--translate-y-1-2 glass-text-secondary">
              🔍
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-overflow-x-auto">
        <table className="glass-w-full">
          <thead className="glass-surface-subtle">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "glass-px-4 glass-py-3 text-left text-sm font-medium glass-text-secondary",
                    column.sortable &&
                      "cursor-pointer hover:bg-muted/80 transition-colors select-none",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="glass-flex glass-items-center glass-gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="glass-flex glass-flex-col">
                        <div
                          className={cn(
                            "text-xs transition-colors",
                            sortColumn === column.key && sortDirection === "asc"
                              ? "text-primary"
                              : "glass-text-secondary/50"
                          )}
                        >
                          ▲
                        </div>
                        <div
                          className={cn(
                            "text-xs transition-colors -mt-1",
                            sortColumn === column.key &&
                              sortDirection === "desc"
                              ? "text-primary"
                              : "glass-text-secondary/50"
                          )}
                        >
                          ▼
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? renderLoadingSkeleton()
              : paginatedData.length === 0
                ? renderEmptyState()
                : paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:glass-surface-subtle glass-transition-colors glass-border-b glass-border-glass-border last:glass-border-b-0"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className="glass-px-4 glass-py-3 glass-text-sm"
                        >
                          {column.render
                            ? column.render(item[column.key], item)
                            : String(item[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </Glass>
  );
}

GlassDataTable.displayName = "GlassDataTable";
