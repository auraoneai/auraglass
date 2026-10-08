import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'FilterBar',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 34,
  rsc: 'client',
  parts: ['filter-bar', 'filter-search', 'filter-chip', 'filter-chip-remove', 'filter-add', 'filter-clear', 'filter-count'],
  states: ['empty', 'active'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  budgetKb: 8,
  migration: [
    { from: 'GlassFilterBar', props: { fields: 'schema', filters: 'value', onChange: 'onValueChange' }, automation: 'mostly', compat: true },
    { from: 'GlassSearchBar', props: {}, automation: 'manual', compat: true },
  ],
  selectors: [{ from: '.glass-filter-bar', to: '[data-ag-part="filter-bar"]' }],
});
