import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Thread',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 38,
  rsc: 'client',
  parts: ['attachment', 'attachment-link', 'attachment-type', 'bottom-sentinel', 'caret', 'content', 'empty', 'error-text', 'heading', 'icon', 'io', 'io-pre', 'jump-to-latest', 'log', 'message', 'reasoning', 'running-dots', 'source', 'source-file', 'source-host', 'source-link', 'source-list', 'source-text', 'sources', 'state-icon', 'streaming-text', 'text', 'text-part', 'thread', 'tool-call', 'tool-name', 'tool-state', 'top-sentinel', 'trigger', 'waiting'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: {},
  budgetKb: 21,
  // REQ-FIN-110 → REQ-FIN-85 (SURF-196 transfer): 4.x GlassMessageList had no
  // semantic class (utility classes only); its stable hook was the
  // role=log + aria-label="Message list" root, which maps to the Thread log.
  migration: [
    {
      from: 'GlassMessageList',
      automation: 'partial',
      compat: true,
      selectors: { '[role="log"][aria-label="Message list"]': '[data-ag-part="log"]' },
    },
  ],
});
