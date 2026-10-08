import { defineMeta } from '../../foundation';

export const KeyValueEditorMeta = defineMeta({
  name: 'KeyValueEditor',
  owner: 'CMP',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  parts: ['root', 'list', 'item', 'input', 'actions', 'error'],
  states: ['invalid', 'disabled'],
  variants: {},
  migration: [
    {
      from: 'GlassKeyValueEditor',
      props: {
        onChange: { to: 'onValueChange' },
        'data-testid': { to: 'data-ag-part hooks' },
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default KeyValueEditorMeta;
