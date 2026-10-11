import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Kbd',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root','item','separator'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [],
});
