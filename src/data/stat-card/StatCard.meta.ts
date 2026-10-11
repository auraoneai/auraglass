import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StatCard',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 35,
  rsc: 'server',
  parts: ['sparkline', 'stat-card', 'stat-card-delta', 'stat-card-description', 'stat-card-label', 'stat-card-sparkline', 'stat-card-value'],
  states: ['loading'],
  variants: { trendDirection: ['up-is-good', 'down-is-good', 'neutral'] },
  budgetKb: 3,
  migration: [
    { from: 'GlassStatCard', props: { title: 'label', trend: { to: 'trendDirection', values: { up: 'up-is-good', down: 'up-is-good', flat: 'neutral' } } }, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'full', compat: true },
    { from: 'GlassKPICard', props: {}, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'full', compat: true },
    { from: 'GlassMetricCard', props: {}, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'full', compat: true },
    { from: 'GlassAnimatedNumber', props: {}, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'manual', compat: true },
    { from: 'KpiChart', props: {}, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'manual', compat: false },
    { from: 'GlassMetricsGrid', props: {}, selectors: { '.glass-stat-card': '[data-ag-part="stat-card"]' }, automation: 'manual', compat: false },
  ],
});
