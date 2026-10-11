import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'FilterBar',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 34,
  rsc: 'client',
  parts: ['filter-add', 'filter-bar', 'filter-clear', 'filter-quick', 'filter-quick-toggle', 'filter-rule-chip', 'filter-rule-editor', 'filter-rules', 'filter-search'],
  states: ['empty', 'active'],
  variants: {},
  apg: 'searchbox',
  budgetKb: 8,
  migration: [
    { from: 'GlassFilterBar', props: { fields: 'schema', filters: 'value', onChange: 'onValueChange' }, selectors: { '.glass-filter-bar': '[data-ag-part="filter-bar"]' }, automation: 'mostly', compat: true },
    { from: 'GlassSearchBar', props: {}, selectors: { '.glass-filter-bar': '[data-ag-part="filter-bar"]' }, automation: 'manual', compat: true },
  ],
});
