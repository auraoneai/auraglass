import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ChartFrame',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 36,
  rsc: 'server',
  parts: ['chart-description', 'chart-frame', 'chart-legend', 'chart-legend-item', 'chart-plot', 'chart-table', 'chart-table-toggle', 'chart-title'],
  states: ['empty', 'loading'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/',
  budgetKb: 5,
  migration: [
    { from: 'GlassChart', props: {}, automation: 'manual', compat: false },
    { from: 'GlassDataChart', props: {}, automation: 'manual', compat: false },
    { from: 'GlassChartContainer', props: {}, automation: 'manual', compat: false },
  ],
  selectors: [{ from: '.glass-chart', to: '[data-ag-part="chart-frame"]' }],
});
