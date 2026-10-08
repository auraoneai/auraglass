import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ToolCall',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: true,
  rsc: 'client',
  parts: ['tool-call', 'trigger', 'tool-name', 'tool-state', 'content', 'io', 'io-pre', 'io-expand', 'error-text', 'approval', 'approve', 'deny', 'deny-reason', 'waiting'],
  states: ['queued', 'running', 'needs-approval', 'succeeded', 'failed', 'denied'],
  variants: {},
  budgetKb: 8,
  migration: [],
  selectors: [],
});
