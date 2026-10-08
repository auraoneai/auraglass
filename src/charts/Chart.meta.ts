import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Chart',
  owner: 'SURF',
  entry: './charts',
  tier: 'preview',
  rsc: 'mixed',
  parts: ['chart', 'chart-frame', 'chart-title', 'chart-plot', 'chart-legend', 'chart-legend-item', 'chart-table', 'chart-tooltip'],
  states: ['empty', 'loading'],
  variants: { type: ['line', 'area', 'bar', 'donut'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/',
  budgetKb: 15,
  migration: [
    { from: 'GlassDataChart', props: {}, automation: 'manual', compat: false, note: 'on @tier preview until 5.1.0' },
  ],
  selectors: [{ from: '.glass-data-chart', to: '[data-ag-part="chart"]' }],
});
