'use client';
import { cn } from "@/lib/utils";
import React, { forwardRef, useState } from "react";
import { Glass } from "../../../../primitives";
import { GlassButton } from "../../../button/GlassButton";
import { GlassBadge } from "../../../data-display/GlassBadge";
import { HStack, VStack } from "../../../layout/GlassStack";

export interface TableColumn {
  id: string;
  header: string;
  accessor: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface TableData {
  title: string;
  subtitle?: string;
  columns: TableColumn[];
  rows: TableRow[];
  summary?: {
    total?: number;
    filtered?: number;
    message?: string;
  };
}

export interface TableWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Table data
   */
  data: TableData;
  /**
   * Widget variant
   */
  variant?: "default" | "minimal" | "compact";
  /**
   * Table size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Maximum rows to display
   */
  maxRows?: number;
  /**
   * Whether to show header
   */
  showHeader?: boolean;
  /**
   * Whether table is sortable
   */
  sortable?: boolean;
  /**
   * Whether to show row numbers
   */
  showRowNumbers?: boolean;
  /**
   * Row hover effect
   */
  hoverable?: boolean;
  /**
   * Striped rows
   */
  striped?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Table actions
   */
  actions?: React.ReactNode;
  /**
   * Row click handler
   */
  onRowClick?: (row: TableRow) => void;
  /**
   * Sort handler
   */
  onSort?: (column: string, direction: "asc" | "desc") => void;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}

/**
 * TableWidget component
 * Display tabular data with sorting and styling
 */
export const TableWidget = forwardRef<HTMLDivElement, TableWidgetProps>(
  (
    {
      data,
      variant = "default",
      size = "md",
      maxRows = 5,
      showHeader = true,
      sortable = true,
      showRowNumbers = false,
      hoverable = true,
      striped = false,
      loading = false,
      actions,
      onRowClick,
      onSort,
      className,
      ...props
    },
    ref
  ) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const sizeClasses = {
      sm: {
        padding: "glass-p-3",
        title: "glass-text-sm",
        subtitle: "glass-text-xs",
        cell: "glass-px-2 glass-py-1 glass-text-xs",
        header: "glass-px-2 glass-py-2 glass-text-xs",
      },
      md: {
        padding: "glass-p-4",
        title: "glass-text-base",
        subtitle: "glass-text-sm",
        cell: "glass-px-3 glass-py-2 glass-text-sm",
        header: "glass-px-3 glass-py-2 glass-text-sm",
      },
      lg: {
        padding: "glass-p-6",
        title: "glass-text-lg",
        subtitle: "glass-text-base",
        cell: "glass-px-4 glass-py-3 glass-text-base",
        header: "glass-px-4 glass-py-3 glass-text-base",
      },
    };

    const config = sizeClasses?.[size];

    // Handle column sort
    const handleSort = (columnId: string) => {
      const column = data?.columns.find((col) => col.id === columnId);
      if (!column?.sortable && !sortable) return;

      const newDirection =
        sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
      setSortColumn(columnId);
      setSortDirection(newDirection);
      onSort?.(columnId, newDirection);
    };

    // Sort data if local sorting
    const sortedRows = React.useMemo(() => {
      if (!sortColumn || onSort) return data?.rows || [];

      const column = (data?.columns || []).find((col) => col.id === sortColumn);
      if (!column) return data?.rows || [];

      return [...(data?.rows || [])].sort((a, b) => {
        const aValue = a[column.accessor];
        const bValue = b?.[column.accessor];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }, [data?.rows, data?.columns, sortColumn, sortDirection, onSort]);

    const displayRows = sortedRows.slice(0, maxRows);

    const renderCellContent = (column: TableColumn, row: TableRow) => {
      const value = row?.[column.accessor];

      if (column.render) {
        return column.render(value, row);
      }

      // Default renderers for common data types
      if (typeof value === "boolean") {
        return (
          <GlassBadge
            data-glass-component
            variant={value ? "success" : "error"}
            size="xs"
          >
            {value ? "Yes" : "No"}
          </GlassBadge>
        );
      }

      if (typeof value === "number") {
        return value.toLocaleString();
      }

      if (value === null || value === undefined) {
        return <span className="glass-text-secondary">—</span>;
      }

      return String(value);
    };

    const renderTable = () => {
      if (loading) {
        return (
          <div className="glass-flex glass-items-center glass-justify-center glass-py-8">
            <div className="w-6 h-6 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full animate-spin" />
          </div>
        );
      }

      if ((displayRows?.length || 0) === 0) {
        return (
          <div className="glass-flex glass-items-center glass-justify-center glass-py-8 glass-text-secondary">
            No data available
          </div>
        );
      }

      return (
        <div className="overflow-x-auto">
          <table className="glass-w-full">
            {/* Header */}
            {showHeader && (
              <thead>
                <tr className="glass-border-b glass-border-glass-border/20">
                  {showRowNumbers && (
                    <th
                      className={cn(
                        config.header,
                        "w-12 text-left font-medium glass-text-secondary"
                      )}
                    >
                      #
                    </th>
                  )}
                  {(data?.columns || []).map((column) => (
                    <th
                      key={column.id}
                      className={cn(
                        config.header,
                        "font-medium glass-text-secondary",
                        {
                          "text-left": column.align === "left" || !column.align,
                          "text-center": column.align === "center",
                          "text-right": column.align === "right",
                          "cursor-pointer hover:text-foreground":
                            column.sortable || sortable,
                        }
                      )}
                      style={{ width: column.width }}
                      onClick={(e) => handleSort(column.id)}
                    >
                      <HStack
                        space="xs"
                        align="center"
                        className="glass-justify-start"
                      >
                        <span>{column.header}</span>
                        {(column.sortable || sortable) && (
                          <div className="glass-flex glass-flex-col">
                            <div
                              className={cn(
                                "w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent",
                                sortColumn === column.id &&
                                  sortDirection === "asc"
                                  ? "border-b-primary"
                                  : "border-b-muted-foreground/30"
                              )}
                            />
                            <div
                              className={cn(
                                "w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent mt-0.5",
                                sortColumn === column.id &&
                                  sortDirection === "desc"
                                  ? "border-t-primary"
                                  : "border-t-muted-foreground/30"
                              )}
                            />
                          </div>
                        )}
                      </HStack>
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {/* Body */}
            <tbody>
              {displayRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn("transition-colors animate-fade-in", {
                    "bg-muted/20": striped && index % 2 === 1,
                    "hover:bg-muted/30": hoverable,
                    "cursor-pointer": onRowClick,
                  })}
                  style={{
                    animationDelay: `${Math.min(index, 15) * 50}ms`,
                    animationFillMode: "both",
                  }}
                  onClick={(e) => onRowClick?.(row)}
                >
                  {showRowNumbers && (
                    <td className={cn(config.cell, "glass-text-secondary")}>
                      {index + 1}
                    </td>
                  )}
                  {(data?.columns || []).map((column) => (
                    <td
                      key={column.id}
                      className={cn(config.cell, "text-foreground", {
                        "text-left": column.align === "left" || !column.align,
                        "text-center": column.align === "center",
                        "text-right": column.align === "right",
                      })}
                    >
                      {renderCellContent(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const renderContent = () => {
      switch (variant) {
        case "minimal":
          return renderTable();

        case "compact":
          return (
            <VStack space="sm">
              <HStack space="sm" align="center" justify="between">
                <h3 className={cn("font-medium text-foreground", config.title)}>
                  {data?.title || "Table"}
                </h3>
                {actions}
              </HStack>
              {renderTable()}
            </VStack>
          );

        default:
          return (
            <VStack space="md">
              {/* Header */}
              <HStack space="sm" align="center" justify="between">
                <VStack space="xs">
                  <h3
                    className={cn("font-medium text-foreground", config.title)}
                  >
                    {data?.title || "Table"}
                  </h3>
                  {data?.subtitle && (
                    <p className={cn("glass-text-secondary", config.subtitle)}>
                      {data?.subtitle}
                    </p>
                  )}
                </VStack>
                {actions}
              </HStack>

              {/* Summary */}
              {data?.summary && (
                <HStack space="sm" align="center">
                  {data?.summary.total && (
                    <span className="glass-text-sm glass-text-secondary">
                      Total: {data?.summary.total.toLocaleString()}
                    </span>
                  )}
                  {data?.summary.filtered &&
                    data?.summary.filtered !== data?.summary.total && (
                      <span className="glass-text-sm glass-text-secondary">
                        Showing: {data?.summary.filtered.toLocaleString()}
                      </span>
                    )}
                  {data?.summary.message && (
                    <GlassBadge variant="outline" size="xs">
                      {data?.summary.message}
                    </GlassBadge>
                  )}
                </HStack>
              )}

              {/* Table */}
              <div className="glass-flex-1">{renderTable()}</div>

              {/* Footer */}
              {(data?.rows?.length || 0) > maxRows && (
                <HStack space="sm" align="center" justify="center">
                  <span className="glass-text-xs glass-text-secondary">
                    Showing {maxRows} of {data?.rows?.length || 0} rows
                  </span>
                  <GlassButton variant="ghost" size="xs">
                    View All
                  </GlassButton>
                </HStack>
              )}
            </VStack>
          );
      }
    };

    return (
      <Glass
        ref={ref}
        className={cn(
          "w-full h-full glass-radius-lg",
          config.padding,
          className
        )}
        {...props}
      >
        {renderContent()}
      </Glass>
    );
  }
);

TableWidget.displayName = "TableWidget";