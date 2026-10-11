import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'FilterBar',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 34,
  rsc: 'client',
  // REQ-SURF-87: own parts plus the parts of the composed CMP SearchField
  // (root, control-shell, icon, control) and ToggleGroup (root, item); the chip
  // editor and the collapsed sheet are CMP Popover / Sheet popups (portaled).
  parts: ['control', 'control-shell', 'filter-add', 'filter-bar', 'filter-clear', 'filter-collapsed', 'filter-count', 'filter-more', 'filter-quick', 'filter-rule-chip', 'filter-rule-edit', 'filter-rule-remove', 'filter-rules', 'filter-search', 'icon', 'item', 'root'],
  states: ['empty', 'active'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  budgetKb: 8,
  migration: [
    { from: 'GlassFilterBar', props: { fields: 'schema', filters: 'value', onChange: 'onValueChange' }, selectors: { '.glass-filter-bar': '[data-ag-part="filter-bar"]' }, automation: 'mostly', compat: true },
    { from: 'GlassSearchBar', props: {}, selectors: { '.glass-filter-bar': '[data-ag-part="filter-bar"]' }, automation: 'manual', compat: true },
  ],
});
