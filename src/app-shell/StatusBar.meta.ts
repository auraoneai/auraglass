import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'StatusBar',
  owner: 'SURF',
  entry: './app-shell',
  tier: 'T1',
  rsc: 'server',
  parts: ['status-bar', 'status-bar-item', 'status-bar-live'],
  states: [],

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  variants: {},
  migration: [{ from: 'GlassStatusBar', props: {}, automation: 'mostly', compat: true }],
});
