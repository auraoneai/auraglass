import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Combobox',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 12,
  rsc: 'client',
  parts: [
    'input-shell', 'input', 'trigger', 'clear', 'chips', 'chip', 'chip-remove',
    'popup', 'list', 'item', 'item-indicator', 'empty', 'loading',
    'group', 'group-label', 'positioner', 'create-item',
  ],
  states: ['popup-open', 'highlighted', 'selected', 'empty', 'disabled', 'invalid', 'loading'],
  variants: {
    size: ['sm', 'md', 'lg'],
    multiple: ['true', 'false'],
    mode: ['select', 'autocomplete'],
    disabled: ['true', 'false'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'combobox',
  budgetKb: 30000 / 1024,
  migration: [
    {
      from: 'GlassCombobox',
      props: {
        onChange: { to: 'onValueChange' },
        onInputChange: { to: 'onInputValueChange' },
        options: 'items',
        glassVariant: null,
      },
      selectors: {
        '.glass-combobox': '.ag-combobox',
        '.glass-combobox-option': "[data-ag-part='item']",
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassMultiSelect',
      props: {
        selected: 'value',
        onSelectionChange: { to: 'onValueChange' },
        options: 'items',
        searchable: 'multiple',
      },
      selectors: { '.glass-multi-select': '.ag-combobox' }, automation: 'partial',
      compat: true,
    },
  ],
});

export default meta;
