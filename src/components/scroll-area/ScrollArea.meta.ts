import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'ScrollArea',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','viewport','scrollbar','thumb'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'region',
  budgetKb: 10000 / 1024,
  migration: [{ from: 'GlassScrollArea', props: {}, selectors: { '.glass-scroll-area': '.ag-scroll-area' },  automation: 'mostly', compat: true }],
});
