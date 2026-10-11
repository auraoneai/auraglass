import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Chip',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  parts: ['chip', 'chip-remove'],
  states: ['selected', 'disabled'],
  variants: { intent: ['neutral', 'info', 'success', 'warning', 'danger'], size: ['sm', 'md', 'lg'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  budgetKb: 3,
  migration: [
    { from: 'GlassChip', props: { label: null, text: null, onSelect: 'onSelectedChange' }, automation: 'mostly', compat: true },
    { from: 'GlassMetricChip', props: { label: null, text: null, onSelect: 'onSelectedChange' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-chip', to: '[data-ag-part="chip"]' }],
});
