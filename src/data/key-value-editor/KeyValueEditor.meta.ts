import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'KeyValueEditor',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  flagship: true,
  rsc: 'client',
  parts: ['key-value-editor', 'key-value-row', 'key-input', 'value-input', 'key-value-remove', 'key-value-add'],
  states: ['duplicate-key', 'disabled'],
  variants: {},
  budgetKb: 15,
  migration: [
    { from: 'GlassKeyValueEditor', props: { entries: 'value', pairs: 'value', onChange: 'onValueChange' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-key-value-editor', to: '[data-ag-part="key-value-editor"]' }],
});
