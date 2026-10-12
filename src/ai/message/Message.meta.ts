import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Message',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 39,
  rsc: 'server',
  parts: ['action', 'actions', 'attachment', 'attachment-link', 'attachment-name', 'attachment-type', 'avatar', 'caret', 'content', 'error-detail', 'error-title', 'footer', 'heading', 'hit-area', 'icon', 'io', 'io-pre', 'message', 'message-list', 'provider-error', 'state-icon', 'step-separator', 'stopped', 'streaming-text', 'text', 'text-part', 'tool-call', 'tool-name', 'tool-state', 'trigger'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  material: { layer: 'content', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: {},
  budgetKb: 17,
  migration: [],
});
