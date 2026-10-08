import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StreamingText',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['streaming-text', 'text', 'caret'],
  states: ['streaming', 'done'],
  variants: {},
  budgetKb: 2,
  migration: [],
  selectors: [],
});
