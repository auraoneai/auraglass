import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Checkbox',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 7,
  rsc: 'client',
  parts: ['root', 'indicator', 'icon', 'hit-area'],
  states: ['checked', 'unchecked', 'indeterminate', 'disabled', 'readOnly', 'focus-visible', 'invalid'],
  variants: {
    checked: ['true', 'false', 'indeterminate'],
    disabled: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'checkbox',
  budgetKb: 4,
  migration: [
    {
      from: 'GlassCheckbox',
      props: {
        onChange: { to: 'onCheckedChange' },
        label: 'children',
        glassVariant: null,
        'size:xl': { to: 'size', values: { xl: 'lg' } },
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassCheckboxGroup',
      props: {
        onChange: { to: 'onValueChange' },
        options: { to: 'children' },
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
