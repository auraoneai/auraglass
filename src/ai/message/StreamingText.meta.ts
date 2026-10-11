import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StreamingText',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['caret', 'streaming-text', 'text'],
  states: ['streaming', 'done'],
  variants: {},
  budgetKb: 2,
  migration: [],
  selectors: [],
});
