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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassStack', props: {}, selectors: { '.glass-stack': '.ag-stack' },  automation: 'full', compat: true }],
});
