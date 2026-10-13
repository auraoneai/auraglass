import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Chart',
  owner: 'SURF',
  entry: './charts',
  tier: 'preview',
  rsc: 'mixed',
  parts: ['chart-focus-cursor', 'chart-frame', 'chart-grid', 'chart-legend', 'chart-legend-item', 'chart-mark-area', 'chart-mark-bar', 'chart-mark-donut', 'chart-mark-line', 'chart-plot', 'chart-plot-svg', 'chart-table', 'chart-table-toggle', 'chart-title', 'chart-tooltip', 'hit-area'],
  states: ['empty', 'loading'],
  material: { layer: 'content', refractionEligible: false },
  variants: { type: ['line', 'area', 'bar', 'donut'] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/',
  budgetKb: 15,
  migration: [
    { from: 'GlassDataChart', props: {}, selectors: { '.glass-data-chart': '[data-ag-part="chart"]' }, automation: 'manual', compat: false, note: 'on @tier preview until 5.1.0' },
  ],
});
