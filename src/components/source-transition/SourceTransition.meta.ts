import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'SourceTransition',
  owner: 'SURF',
  entry: '.',
  budgetKb: 3,
  flagship: 31,
  tier: 'T1',
  rsc: 'client',
  parts: ['destination', 'source', 'source-transition'],
  states: [],
  variants: {},
  migration: [],
});
