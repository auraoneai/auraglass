import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'UsageMeter',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'server',
  parts: ['usage-meter', 'usage', 'usage-window', 'usage-window-text'],
  states: ['normal', 'warning', 'critical'],
  variants: {},
  budgetKb: 4,
  migration: [],
  selectors: [],
});
