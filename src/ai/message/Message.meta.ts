import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Message',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 39,
  rsc: 'server',
  parts: ['message', 'heading', 'avatar', 'content', 'actions', 'action', 'footer', 'text-part', 'streaming-text', 'caret', 'attachment', 'stopped'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  variants: {},
  budgetKb: 10,
  migration: [],
  selectors: [],
});
