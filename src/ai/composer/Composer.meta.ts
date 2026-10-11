import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Composer',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 40,
  rsc: 'client',
  parts: ['action', 'actions', 'attachment', 'attachment-name', 'attachment-remove', 'attachments', 'composer', 'counter', 'file-input', 'icon', 'input', 'stop', 'submit'],
  states: ['ready', 'submitted', 'streaming', 'error'],
  apg: 'textbox',
  variants: {},
  budgetKb: 12,
  migration: [],
});
