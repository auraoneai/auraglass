import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'CheckboxGroup',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 7,
  rsc: 'client',
  parts: ['root'],
  states: ['disabled'],
  variants: {
    disabled: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'group',
  budgetKb: 10,
  migration: [
    {
      from: 'GlassCheckboxGroup',
      props: {
        options: null,
        onChange: { to: 'onValueChange' },
      },
      selectors: { '.glass-checkbox-group': '.ag-checkbox-group' }, automation: 'partial',
      compat: true,
    },
  ],
});

export default meta;
