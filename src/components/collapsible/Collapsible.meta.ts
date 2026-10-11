import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Collapsible',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','trigger','content'],
  states: ['expanded','collapsed'],
  variants: {},
  material: { layer: 'content' },
  apg: 'disclosure',
  budgetKb: 5,
  migration: [],
});
