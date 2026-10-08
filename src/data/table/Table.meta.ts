import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Table',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 32,
  rsc: 'client',
  parts: ['table', 'table-header', 'table-header-row', 'table-column-header', 'table-sort-button', 'table-body', 'table-row', 'table-cell', 'table-resize-handle', 'table-pin-button', 'table-empty', 'table-pagination', 'table-selection-checkbox', 'table-filter-input'],
  states: ['sorted-asc', 'sorted-desc', 'selected', 'empty', 'loading', 'resizing'],
  variants: { size: ['sm', 'md', 'lg'], mode: ['table', 'grid'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
  budgetKb: 14,
  migration: [
    { from: 'GlassDataTable', props: { rows: 'data', filterable: 'enableColumnFilter', compact: 'size', selectedRows: 'rowSelection', onSelectionChange: 'onRowSelectionChange', onRowClick: 'onRowAction', emptyMessage: 'emptyState', consciousness: null }, automation: 'mostly', compat: true },
    { from: 'GlassDataGrid', props: {}, automation: 'mostly', compat: true },
    { from: 'GlassVirtualTable', props: {}, automation: 'manual', compat: true },
  ],
  selectors: [
    { from: '.glass-data-table', to: '[data-ag-part="table"]' },
    { from: '.glass-data-grid', to: '[data-ag-part="table"]' },
  ],
});

export const TABLE_COLUMN_META = {
  name: 'Table.Column',
  migration: [{ from: 'ColumnDefinition', props: { key: 'accessorKey', label: 'header', sortable: 'enableSorting', width: 'size', render: 'cell', cellRenderer: 'cell', align: 'meta.align' } }],
} as const;
