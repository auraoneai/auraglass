'use client';

import React, { useState, useMemo } from 'react';
import { Glass } from '../../../primitives';
import { cn } from '../../../lib/utilsComprehensive';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  width?: string;
}

export interface GlassDataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
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
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  data,
  columns,
  loading = false,
  searchable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage = 'No data available',
  loadingRows = 5,
  className,
  ...props
}: GlassDataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      result = result.filter((item: any) =>
        columns.some(col => 
          col.filterable !== false && 
          String(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
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
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: loadingRows }).map((_, index) => (
        <tr key={`loading-${index}`} className="animate-pulse">
          {columns.map((column, colIndex) => (
            <td key={`loading-${index}-${colIndex}`} className="p-4">
              <div className="h-4 glass-surface-subtle glass-radius"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="p-12 text-center">
        <div className="flex flex-col items-center gap-4 glass-text-secondary">
          <div className="text-6xl opacity-50">📭</div>
          <div className="font-medium">{emptyMessage}</div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 glass-surface-primary/10 hover:glass-surface-primary/20 glass-radius-lg text-primary text-sm font-medium transition-colors"
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
      <div className="flex items-center justify-between p-4 border-t border-glass-border">
        <div className="text-sm glass-text-secondary">
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, processedData.length)} of {processedData.length} results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 glass-radius-md border border-glass-border hover:glass-surface-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  'glass-px-3 glass-py-1 glass-radius-md border transition-colors',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                )}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 glass-radius-md border border-glass-border hover:glass-surface-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <Glass className={cn('glass-radius-xl overflow-hidden', className)} {...props}>
      {/* Header with search */}
      {searchable && (
        <div className="p-4 border-b border-glass-border">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 glass-pl-10 bg-background border border-glass-border glass-radius-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <div className="absolute left-3 glass--glass--glass--glass--glassglass--glass-top-1/2 -translate-y-1/2 glass-text-secondary">
              🔍
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="glass-surface-subtle">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'glass-px-4 glass-py-3 text-left text-sm font-medium glass-text-secondary',
                    column.sortable && 'cursor-pointer hover:bg-muted/80 transition-colors select-none',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <div className={cn(
                          'text-xs transition-colors',
                          sortColumn === column.key && sortDirection === 'asc'
                            ? 'text-primary'
                            : 'glass-text-secondary/50'
                        )}>
                          ▲
                        </div>
                        <div className={cn(
                          'text-xs transition-colors -mt-1',
                          sortColumn === column.key && sortDirection === 'desc'
                            ? 'text-primary'
                            : 'glass-text-secondary/50'
                        )}>
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
            {loading ? renderLoadingSkeleton() : (
              paginatedData.length === 0 ? renderEmptyState() : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:glass-surface-subtle transition-colors border-b border-glass-border last:border-b-0"
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-4 py-3 text-sm">
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key])
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </Glass>
  );
}

GlassDataTable.displayName = 'GlassDataTable';