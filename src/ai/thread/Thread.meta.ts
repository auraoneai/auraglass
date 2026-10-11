import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Thread',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 38,
  rsc: 'client',
  parts: ['bottom-sentinel', 'empty', 'jump-to-latest', 'log', 'thread', 'top-sentinel', 'viewport'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  apg: 'feed',
  variants: {},
  budgetKb: 18,
  migration: [],
  selectors: [],
});
