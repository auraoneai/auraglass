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
  apg: 'figure',
  budgetKb: 5,
  migration: [
    { from: 'GlassChart', props: {}, selectors: { '.glass-chart': '[data-ag-part="chart-frame"]' }, automation: 'manual', compat: false },
    { from: 'GlassDataChart', props: {}, selectors: { '.glass-chart': '[data-ag-part="chart-frame"]' }, automation: 'manual', compat: false },
    { from: 'GlassChartContainer', props: {}, selectors: { '.glass-chart': '[data-ag-part="chart-frame"]' }, automation: 'manual', compat: false },
  ],
});
