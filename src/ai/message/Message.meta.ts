import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Message',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 39,
  rsc: 'server',
  parts: ['action', 'actions', 'attachment', 'attachment-download', 'attachment-name', 'attachment-type', 'avatar', 'content', 'footer', 'heading', 'message', 'step-separator', 'stopped', 'text-part'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: {},
  budgetKb: 10,
  migration: [],
  selectors: [],
});
