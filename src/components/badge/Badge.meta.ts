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
  migration: [{ from: 'GlassBadge', automation: 'mostly', compat: true }, { from: 'LiquidGlassBadgeCluster', automation: 'partial', compat: true }],
});
