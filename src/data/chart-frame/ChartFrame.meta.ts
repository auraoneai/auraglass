import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ChartFrame',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 36,
  rsc: 'server',
  parts: ['chart-frame', 'chart-title', 'chart-plot', 'chart-legend', 'chart-legend-item', 'chart-table'],
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
