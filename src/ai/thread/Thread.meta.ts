import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Thread',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 38,
  rsc: 'client',
  parts: ['thread', 'log', 'top-sentinel', 'bottom-sentinel', 'empty', 'jump-to-latest', 'message', 'heading', 'avatar', 'content', 'text-part', 'streaming-text', 'caret'],
  states: ['complete', 'streaming', 'pending', 'error', 'aborted'],
  variants: {},
  budgetKb: 18,
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
  selectors: [{ from: '[role="log"][aria-label="Message list"]', to: '[data-ag-part="log"]' }],
});
