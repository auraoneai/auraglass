import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Tour',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','step','positioner','popup'],
  states: ['open','closed'],
  variants: {},
  migration: [{ from: 'GlassCoachmarks', automation: 'partial', compat: true }, { from: 'GlassSpotlight', automation: 'partial', compat: true }],
});
