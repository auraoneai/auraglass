import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TopBar',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 24,
  tier: 'T1',
  rsc: 'server',
  parts: ['edge-registrar', 'top-bar', 'top-bar-center', 'top-bar-leading', 'top-bar-title', 'top-bar-trailing'],
  states: [],

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  variants: {},
  migration: [{ from: 'GlassTopBar', props: {}, automation: 'mostly', compat: true }],
});
