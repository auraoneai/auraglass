import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Backdrop',
  owner: 'SURF',
  entry: './backdrops',
  tier: 'T2',
  rsc: 'server',
  parts: ['backdrop-content', 'backdrop-layer', 'backdrop-pause'],
  states: ['media', 'light', 'dark', 'auto', 'none'],
  material: { layer: 'content', refractionEligible: false },
  variants: { preset: ['photo', 'video', 'aurora', 'mesh', 'grain'] },
  budgetKb: 7,
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  migration: [
    { from: 'AuroraBackground', props: { motion: { to: 'motion', values: { none: 'static', subtle: 'static', full: 'drift' } } }, selectors: { '.aurora-background': '.ag-backdrop[data-ag-backdrop-preset="aurora"]' }, automation: 'partial', compat: true },
    { from: 'AuroraOrb', props: {}, selectors: { '.aurora-orb': '[data-ag-part="backdrop-layer"]' }, automation: 'partial', compat: true },
    { from: 'AtmosphericBackground', props: { variant: null, weather: null, colorScheme: null }, selectors: { '.atmospheric-background': '[data-ag-part="backdrop-layer"]' }, automation: 'partial', compat: true },
    { from: 'GlassDynamicAtmosphere', props: { type: null, primaryColor: null, secondaryColor: null }, selectors: { '.glass-dynamic-atmosphere': '[data-ag-part="backdrop-layer"]' }, automation: 'partial', compat: true },
    { from: 'GlassMeshGradient', props: { colors: null, animate: 'motion' }, selectors: { '.glass-mesh-gradient': '[data-ag-part="backdrop-layer"]' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassBackdropSampler', props: {}, selectors: { '.glass-backdrop-sampler': '[data-ag-part="backdrop-layer"]' }, automation: 'none', compat: false },
  ],
});
