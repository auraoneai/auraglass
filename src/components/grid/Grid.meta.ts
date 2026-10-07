import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Grid',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { variant: ['standard','masonry'] },
  migration: [{ from: 'GlassGrid', automation: 'full', compat: true }, { from: 'GlassMasonry', automation: 'mostly', compat: true }],
});
