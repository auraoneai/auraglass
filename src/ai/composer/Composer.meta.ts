import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Composer',
  owner: 'SURF',
  entry: './ai',
  tier: 'T1',
  flagship: 40,
  rsc: 'client',
  parts: ['action', 'actions', 'attachment', 'attachment-name', 'attachment-remove', 'attachments', 'composer', 'composer-menu', 'composer-menu-trigger', 'counter', 'field', 'file-input', 'icon', 'label', 'stop', 'submit', 'textarea'],
  states: ['ready', 'submitted', 'streaming', 'error'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  variants: {},
  budgetKb: 12,
  migration: [],
});
