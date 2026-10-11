import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Message',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 39,
  rsc: 'server',
  parts: ['action', 'actions', 'attachment', 'attachment-download', 'attachment-name', 'attachment-type', 'avatar', 'caret', 'content', 'error-detail', 'error-title', 'footer', 'heading', 'icon', 'message', 'provider-error', 'step-separator', 'stopped', 'streaming-text', 'text', 'text-part', 'tool-call', 'tool-name', 'tool-state', 'trigger'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  apg: 'feed',
  variants: {},
  budgetKb: 10,
  migration: [],
});
