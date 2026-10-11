import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Backdrop',
  owner: 'SURF',
  entry: './backdrops',
  tier: 'T2',
  rsc: 'server',
  parts: ['backdrop-content', 'backdrop-layer', 'backdrop-pause'],
  states: ['media', 'light', 'dark', 'auto', 'none'],
  variants: { preset: ['photo', 'video', 'aurora', 'mesh', 'grain'] },
  budgetKb: 3,
  migration: [
    { from: 'AuroraBackground', props: { motion: { to: 'motion', values: { none: 'static', subtle: 'static', full: 'drift' } } }, selectors: { '.aurora-background': '.ag-backdrop[data-ag-backdrop-preset="aurora"]' }, automation: 'partial', compat: true },
    { from: 'AuroraOrb', props: {}, automation: 'partial', compat: true },
    { from: 'AtmosphericBackground', props: { variant: null, weather: null, colorScheme: null }, automation: 'partial', compat: true },
    { from: 'GlassDynamicAtmosphere', props: { type: null, primaryColor: null, secondaryColor: null }, automation: 'partial', compat: true },
    { from: 'GlassMeshGradient', props: { colors: null, animate: 'motion' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassBackdropSampler', props: {}, automation: 'none', compat: false },
  ],
});
