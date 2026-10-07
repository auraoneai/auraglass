import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Thread',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: true,
  rsc: 'client',
  parts: ['thread', 'log', 'viewport', 'top-sentinel', 'bottom-sentinel', 'empty', 'jump-to-latest', 'message', 'heading', 'avatar', 'content', 'text-part', 'streaming-text', 'caret'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  variants: {},
  budgetKb: 18,
  migration: [],
  selectors: [],
});
