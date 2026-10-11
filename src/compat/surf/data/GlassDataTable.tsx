/* GlassDataTable — 4.x compat adapter (REQ-SURF-13, DEP-S0200) → Table.
   data (legacy `rows` accepted) / columns (both 4.x shapes, ./_table.tsx) /
   cellRenderers; sortable={false} disables every column's sorting;
   pagination + initialPageSize → defaultPagination; selectable +
   selectionMode/selectedRows/onSelectionChange(ids) → row selection;
   onRowClick → onRowAction; loading; emptyMessage / emptyState.message →
   emptyState; compact or size → density; stickyHeader, maxHeight and
   aria-label map 1:1. Built-in search/filter UI (searchable/filterable) is
   composed with FilterBar in 5.0 and is not rendered here. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyTable, type LegacyTableProps } from './_table';

type Row = Record<string, unknown>;

export type GlassDataTableProps<T extends Row = Row> = LegacyTableProps<T>;

export function GlassDataTable<T extends Row = Row>(props: GlassDataTableProps<T>) {
  warnDeprecated('DEP-S0200');
  return <LegacyTable<T> {...props} />;
}
