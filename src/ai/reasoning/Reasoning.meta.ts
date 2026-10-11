import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Reasoning',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['content', 'reasoning', 'trigger'],
  states: ['streaming', 'done'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  variants: {},
  budgetKb: 4,
  migration: [],
  selectors: [],
});
