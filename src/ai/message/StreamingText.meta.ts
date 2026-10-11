import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'StreamingText',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['action', 'actions', 'attachment', 'attachment-download', 'attachment-name', 'attachment-type', 'avatar', 'caret', 'content', 'footer', 'heading', 'message', 'step-separator', 'stopped', 'streaming-text', 'text', 'text-part'],
  states: ['streaming', 'done'],
  variants: {},
  budgetKb: 2,
  migration: [],
  selectors: [],
});
