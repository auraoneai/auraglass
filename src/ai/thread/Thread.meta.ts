import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Thread',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 38,
  rsc: 'client',
  parts: ['attachment', 'attachment-download', 'attachment-name', 'attachment-type', 'bottom-sentinel', 'caret', 'content', 'empty', 'error-text', 'heading', 'icon', 'io', 'io-pre', 'jump-to-latest', 'log', 'message', 'reasoning', 'running-dots', 'source', 'source-host', 'source-link', 'source-list', 'sources', 'streaming-text', 'text', 'text-part', 'thread', 'tool-call', 'tool-name', 'tool-state', 'top-sentinel', 'trigger', 'viewport', 'waiting'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  apg: 'feed',
  variants: {},
  budgetKb: 18,
  migration: [],
});
