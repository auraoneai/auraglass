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
  material: { layer: 'overlay' },
  apg: 'none',
  budgetKb: 15000 / 1024,
  migration: [{ from: 'GlassCoachmarks', props: {}, selectors: { '.glass-coachmarks': '.ag-tour' },  automation: 'partial', compat: true }, { from: 'GlassSpotlight', props: {}, selectors: { '.glass-spotlight': '.ag-tour' },  automation: 'partial', compat: true }],
});
