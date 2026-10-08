import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Sparkline',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  flagship: 36,
  rsc: 'server',
  parts: ['sparkline', 'sparkline-line', 'sparkline-area', 'sparkline-bar', 'sparkline-dot'],
  states: [],
  variants: { variant: ['line', 'area', 'bar'], intent: ['neutral', 'info', 'success', 'danger'] },
  budgetKb: 2.5,
  migration: [
    { from: 'GlassSparkline', props: { values: 'data', color: 'intent' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-sparkline', to: '[data-ag-part="sparkline"]' }],
});
