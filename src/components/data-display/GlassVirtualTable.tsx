'use client';
import { cn } from '@/lib/utils';

import React from 'react';
import { GlassDataTable } from './GlassDataTable';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export interface GlassVirtualTableProps<T=any> {
  columns: any[];
  rows: T[];
  [key: string]: any; // passthrough for DataTable props (cellRenderers emptyState, className, etc.)
}

export function GlassVirtualTable<T=any>({ columns, rows, ...rest }: GlassVirtualTableProps<T>) { // In a future iteration this can swap to an actual virtualized list implementation.
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

  return <GlassDataTable columns={columns as any} data={rows as any} {...rest} />;
}

export default GlassVirtualTable;
