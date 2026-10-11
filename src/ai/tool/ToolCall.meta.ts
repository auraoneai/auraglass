import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ToolCall',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 41,
  rsc: 'client',
  parts: ['approval', 'approve', 'content', 'deny', 'deny-reason', 'error-text', 'io', 'io-expand', 'io-pre', 'running-dots', 'tool-call', 'tool-name', 'tool-state', 'trigger', 'waiting'],
  states: ['queued', 'running', 'needs-approval', 'succeeded', 'failed', 'denied'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  variants: {},
  budgetKb: 8,
  migration: [],
  selectors: [],
});
