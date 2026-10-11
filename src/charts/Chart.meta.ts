import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Chart',
  owner: 'SURF',
  entry: './charts',
  tier: 'preview',
  rsc: 'mixed',
  // Chart renders inside ChartFrame (chart-frame/title/plot/legend/table are ChartFrame's parts).
  parts: ['chart-focus-cursor', 'chart-grid', 'chart-mark-area', 'chart-mark-bar', 'chart-mark-donut', 'chart-mark-line', 'chart-plot-svg', 'chart-tooltip'],
  states: ['empty', 'loading'],
  variants: { type: ['line', 'area', 'bar', 'donut'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/',
  budgetKb: 15,
  migration: [
    { from: 'GlassDataChart', props: {}, automation: 'manual', compat: false, note: 'on @tier preview until 5.1.0' },
  ],
  selectors: [{ from: '.glass-data-chart', to: '[data-ag-part="chart-frame"]' }],
});
