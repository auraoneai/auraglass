import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Badge',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root','label'],
  states: [],
  variants: { intent: ['neutral','info','success','warning','danger'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1.5,
  migration: [{ from: 'GlassBadge', props: {}, selectors: { '.glass-badge': '.ag-badge' },  automation: 'mostly', compat: true }, { from: 'LiquidGlassBadgeCluster', props: {}, selectors: { '.glass-liquid-glass-badge-cluster': '.ag-badge' },  automation: 'partial', compat: true }],
});
