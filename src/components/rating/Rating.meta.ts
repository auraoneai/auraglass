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
  apg: 'radio',
  migration: [{ from: 'GlassRating', automation: 'mostly', compat: true }],
});
