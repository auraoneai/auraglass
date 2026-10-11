import { defineMeta } from '../../foundation';

export const KeyValueEditorMeta = defineMeta({
  name: 'KeyValueEditor',
  owner: 'CMP',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  parts: ['actions', 'error', 'hit-area', 'input', 'item', 'key-input', 'key-value-add', 'key-value-editor', 'key-value-error', 'key-value-remove', 'key-value-row', 'label', 'list', 'root', 'value-input'],
  states: ['invalid', 'disabled'],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 15000 / 1024,
  migration: [
    {
      from: 'GlassKeyValueEditor',
      props: {
        onChange: { to: 'onValueChange' },
        'data-testid': { to: 'data-ag-part hooks' },
      },
      selectors: { '.glass-key-value-editor': '.ag-key-value-editor' }, automation: 'mostly',
      compat: true,
    },
  ],
});

export default KeyValueEditorMeta;
