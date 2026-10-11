import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Meter',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','track','indicator','label','value'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 5,
  migration: [],
});
