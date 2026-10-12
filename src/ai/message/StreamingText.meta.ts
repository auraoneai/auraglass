import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StreamingText',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['caret', 'streaming-text', 'text'],
  states: ['streaming', 'done'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  material: { layer: 'content', refractionEligible: false },
  variants: {},
  budgetKb: 6,
  migration: [],
});
