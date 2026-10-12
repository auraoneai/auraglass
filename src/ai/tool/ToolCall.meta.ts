import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ToolCall',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 41,
  rsc: 'client',
  // control/control-shell/label/root come from the CMP TextField inside deny-reason (S-33).
  parts: ['approval', 'approve', 'content', 'control', 'control-shell', 'deny', 'deny-reason', 'error-text', 'icon', 'io', 'io-expand', 'io-pre', 'label', 'root', 'running-dots', 'state-icon', 'tool-call', 'tool-name', 'tool-state', 'trigger', 'waiting'],
  states: ['queued', 'running', 'needs-approval', 'succeeded', 'failed', 'denied'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  variants: {},
  budgetKb: 10,
  migration: [],
});
