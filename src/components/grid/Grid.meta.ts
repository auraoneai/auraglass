import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Grid',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root','shell'],
  states: [],
  variants: { variant: ['standard','masonry'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassGrid', props: {}, selectors: { '.glass-grid': '.ag-grid' },  automation: 'full', compat: true }, { from: 'GlassMasonry', props: {}, selectors: { '.glass-masonry': '.ag-grid' },  automation: 'mostly', compat: true }, { from: 'GlassMasonryGrid', props: {}, selectors: {},  automation: 'mostly', compat: true }],
});
