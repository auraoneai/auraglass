import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Stack',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root','separator'],
  states: [],
  variants: { direction: ['row','column'] },
  migration: [{ from: 'GlassStack', automation: 'full', compat: true }, { from: 'GlassFlex', automation: 'mostly', compat: true }, { from: 'Box', automation: 'mostly', compat: true }],
});
