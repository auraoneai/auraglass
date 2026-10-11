import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Composer',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 40,
  rsc: 'client',
  parts: ['composer', 'field', 'label', 'textarea', 'attachments', 'attachment', 'attachment-name', 'attachment-remove', 'actions', 'action', 'composer-menu', 'composer-menu-trigger', 'submit', 'stop', 'counter', 'file-input'],
  states: ['ready', 'submitted', 'streaming', 'error'],
  variants: {},
  budgetKb: 12,
  migration: [],
  selectors: [],
});
