import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Select',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 11,
  rsc: 'client',
  parts: [
    'trigger', 'value', 'icon', 'positioner', 'popup', 'list', 'item',
    'item-indicator', 'group', 'group-label', 'separator', 'scroll-up', 'scroll-down',
  ],
  states: ['popup-open', 'open', 'closed', 'highlighted', 'selected', 'disabled', 'invalid'],
  variants: {
    size: ['sm', 'md', 'lg'],
    disabled: ['true', 'false'],
    invalid: ['true', 'false'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'select',
  budgetKb: 25,
  migration: [
    {
      from: 'GlassSelect',
      props: {
        onChange: { to: 'onValueChange' },
        options: 'items',
        glassVariant: null,
        'size:xl': { to: 'size', values: { xl: 'lg' } },
      },
      selectors: {
        '.glass-select': '.ag-select',
        '.glass-select-option': "[data-ag-part='item']",
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassDropdown',
      props: {
        onSelect: { to: 'onValueChange' },
        menu: 'children',
      },
      selectors: { '.glass-dropdown': '.ag-select' }, automation: 'partial',
      compat: true,
    },
  ],
});

export default meta;
