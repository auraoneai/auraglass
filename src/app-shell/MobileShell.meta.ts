import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'MobileShell',
  owner: 'SURF',
  entry: './app-shell',
  tier: 'T1',
  rsc: 'server',
  parts: ['edge-registrar', 'main', 'root', 'scroll-edge', 'top-bar'],
  states: [],
  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  budgetKb: 4,
  variants: {},
  migration: [{ from: 'GlassMobileShell', props: {}, selectors: { '.glass-mobile-shell': '[data-ag-part="root"]' }, automation: 'mostly', compat: true }],
});
