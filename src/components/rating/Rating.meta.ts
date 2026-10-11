import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Rating',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','item'],
  states: ['on','off'],
  variants: { readOnly: ['true','false'] },
  material: { layer: 'content' },
  apg: 'radio',
  budgetKb: 10,
  migration: [{ from: 'GlassRating', props: {}, selectors: { '.glass-rating': '.ag-rating' },  automation: 'mostly', compat: true }],
});
