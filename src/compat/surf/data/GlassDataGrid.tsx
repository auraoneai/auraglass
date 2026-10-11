/* GlassDataGrid — 4.x compat adapter (REQ-SURF-13, DEP-S0201) → Table.
   ColumnDefinition {key,label,sortable,width,align,render|cellRenderer} →
   TanStack column defs (./_table.tsx); data/rows, sortable, height →
   maxHeight. Row dragging (enableRowDragging) has no 5.0 equivalent. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyTable, type LegacyTableProps } from './_table';

type Row = Record<string, unknown>;

export type GlassDataGridProps<T extends Row = Row> = LegacyTableProps<T> & { height?: number | string };

/**
 * 4.x `GlassDataGrid` compat adapter (DEP-S0201).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Table from aura-glass/data}.
 */
export function GlassDataGrid<T extends Row = Row>(props: GlassDataGridProps<T>) {
  warnDeprecated('DEP-S0201');
  const { height, ...rest } = props;
  return <LegacyTable<T> {...rest} {...(height !== undefined && rest.maxHeight === undefined ? { maxHeight: height } : {})} />;
}
