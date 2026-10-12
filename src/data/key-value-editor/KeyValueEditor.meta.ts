import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'KeyValueEditor',
  owner: 'SURF',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  // control/control-shell/error/root are the CMP TextField parts of the key/value fields (S-33).
  parts: ['control', 'control-shell', 'error', 'key-input', 'key-value-add', 'key-value-editor', 'key-value-remove', 'key-value-row', 'root', 'value-input'],
  states: ['duplicate-key', 'disabled'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  variants: {},
  budgetKb: 15,
  migration: [
    { from: 'GlassKeyValueEditor', props: { entries: 'value', pairs: 'value', onChange: 'onValueChange' }, selectors: { '.glass-key-value-editor': '[data-ag-part="key-value-editor"]' }, automation: 'mostly', compat: true },
  ],
});
