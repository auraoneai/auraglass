import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Reasoning',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['reasoning', 'trigger', 'content'],
  states: ['streaming', 'done'],
  variants: {},
  budgetKb: 4,
  migration: [],
  selectors: [],
});
