import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'UsageMeter',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'server',
  parts: ['usage', 'usage-meter', 'usage-window', 'usage-window-text'],
  states: ['normal', 'warning', 'critical'],
  apg: 'meter',
  variants: {},
  budgetKb: 4,
  migration: [],
  selectors: [],
});
