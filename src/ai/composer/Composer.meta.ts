import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Composer',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: true,
  rsc: 'client',
  parts: ['composer', 'input', 'attachments', 'attachment', 'attachment-name', 'attachment-remove', 'actions', 'action', 'submit', 'stop', 'counter', 'file-input'],
  states: ['ready', 'submitted', 'streaming', 'error'],
  variants: {},
  budgetKb: 12,
  migration: [],
  selectors: [],
});
