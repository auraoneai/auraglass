import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Composer',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 40,
  rsc: 'client',
  // Includes the Thread/Message/ToolCall parts the WithThread story renders around the composer (S-33).
  parts: ['action', 'actions', 'attachment', 'attachment-name', 'attachment-remove', 'attachments', 'bottom-sentinel', 'composer', 'composer-menu', 'composer-menu-trigger', 'content', 'counter', 'field', 'file-input', 'heading', 'hit-area', 'icon', 'io', 'io-pre', 'label', 'log', 'message', 'reasoning', 'running-dots', 'state-icon', 'stop', 'submit', 'text-part', 'textarea', 'thread', 'tool-call', 'tool-name', 'tool-state', 'top-sentinel', 'trigger', 'waiting'],
  states: ['ready', 'submitted', 'streaming', 'error'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  variants: {},
  budgetKb: 12,
  migration: [],
});
