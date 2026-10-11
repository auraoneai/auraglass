import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'KeyValueEditor',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  parts: ['key-input', 'key-value-add', 'key-value-editor', 'key-value-error', 'key-value-remove', 'key-value-row', 'value-input'],
  states: ['duplicate-key', 'disabled'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  variants: {},
  budgetKb: 15,
  migration: [
    { from: 'GlassKeyValueEditor', props: { entries: 'value', pairs: 'value', onChange: 'onValueChange' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-key-value-editor', to: '[data-ag-part="key-value-editor"]' }],
});
