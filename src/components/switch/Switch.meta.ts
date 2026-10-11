import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Switch',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 5,
  rsc: 'client',
  parts: ['root', 'thumb', 'hit-area'],
  states: ['checked', 'unchecked', 'disabled', 'readOnly', 'focus-visible'],
  variants: {
    checked: ['true', 'false'],
    disabled: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'switch',
  budgetKb: 8000 / 1024,
  migration: [
    {
      from: 'GlassSwitch',
      props: {
        onChange: { to: 'onCheckedChange' },
        label: 'children',
        glassVariant: null,
        'size:xl': { to: 'size', values: { xl: 'lg' } },
      },
      selectors: { '.glass-switch': '.ag-switch' }, automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
