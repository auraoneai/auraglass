import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Table',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 32,
  rsc: 'client',
  parts: ['hit-area', 'icon', 'indicator', 'root', 'table-body', 'table-cell', 'table-column-menu', 'table-empty', 'table-header', 'table-header-cell', 'table-loading', 'table-resize-handle', 'table-root', 'table-row', 'table-scroller', 'table-selection', 'table-selection-all', 'table-selection-cell', 'table-sort-trigger'],
  states: ['sorted-asc', 'sorted-desc', 'selected', 'empty', 'loading', 'resizing'],
  variants: { size: ['sm', 'md', 'lg'], mode: ['table', 'grid'] },
  apg: 'table',
  budgetKb: 14,
  migration: [
    { from: 'GlassDataTable', props: { rows: 'data', filterable: 'enableColumnFilter', compact: { to: 'size', values: { true: 'sm' } }, selectedRows: 'rowSelection', onSelectionChange: 'onRowSelectionChange', onRowClick: 'onRowAction', emptyMessage: 'emptyState', consciousness: null }, selectors: { '.glass-data-table': '[data-ag-part="table"]', '.glass-data-grid': '[data-ag-part="table"]' }, automation: 'mostly', compat: true },
    { from: 'GlassDataGrid', props: {}, selectors: { '.glass-data-table': '[data-ag-part="table"]', '.glass-data-grid': '[data-ag-part="table"]' }, automation: 'mostly', compat: true },
    { from: 'GlassVirtualTable', props: {}, selectors: { '.glass-data-table': '[data-ag-part="table"]', '.glass-data-grid': '[data-ag-part="table"]' }, automation: 'manual', compat: true },
  ],
});

export const TABLE_COLUMN_META = {
  name: 'Table.Column',
  migration: [{ from: 'ColumnDefinition', props: { key: 'accessorKey', label: 'header', sortable: 'enableSorting', width: 'size', render: 'cell', cellRenderer: 'cell', align: 'meta.align' } }],
} as const;
