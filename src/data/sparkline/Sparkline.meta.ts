import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Sparkline',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  flagship: 36,
  rsc: 'server',
  parts: ['sparkline'],
  states: [],
  // Non-interactive role="img" graphic: no APG pattern (apg is the pattern URL of interactive metas).
  variants: { appearance: ['line', 'area', 'bar'], intent: ['neutral', 'info', 'success', 'danger'] },
  budgetKb: 2.5,
  migration: [
    { from: 'GlassSparkline', props: { values: 'data', color: 'intent' }, selectors: { '.glass-sparkline': '[data-ag-part="sparkline"]' }, automation: 'mostly', compat: true },
  ],
});
