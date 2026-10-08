import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StatCard',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: true,
  rsc: 'server',
  parts: ['stat-card', 'stat-card-label', 'stat-card-value', 'stat-card-delta', 'stat-card-sparkline', 'stat-card-description'],
  states: ['loading'],
  variants: { trendDirection: ['up-is-good', 'down-is-good', 'neutral'] },
  budgetKb: 3,
  migration: [
    { from: 'GlassStatCard', props: { title: 'label', trend: 'trendDirection' }, automation: 'full', compat: true },
    { from: 'GlassKPICard', props: {}, automation: 'full', compat: true },
    { from: 'GlassMetricCard', props: {}, automation: 'full', compat: true },
    { from: 'GlassAnimatedNumber', props: {}, automation: 'manual', compat: true },
    { from: 'KpiChart', props: {}, automation: 'manual', compat: false },
    { from: 'GlassMetricsGrid', props: {}, automation: 'manual', compat: false },
  ],
  selectors: [{ from: '.glass-stat-card', to: '[data-ag-part="stat-card"]' }],
});
