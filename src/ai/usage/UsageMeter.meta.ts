import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'UsageMeter',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'server',
  // own parts plus the composed CMP Meter's (REQ-SURF-126)
  parts: ['indicator', 'label', 'root', 'track', 'usage', 'usage-meter', 'usage-window', 'usage-window-text'],
  states: ['normal', 'warning', 'critical'],
  material: { layer: 'content', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/',
  variants: {},
  budgetKb: 4,
  migration: [],
});
