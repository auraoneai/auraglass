import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'RadioGroup',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 8,
  rsc: 'client',
  parts: ['root', 'item', 'indicator', 'label', 'hit-area'],
  states: ['checked', 'unchecked', 'disabled', 'readOnly', 'focus-visible'],
  variants: {
    orientation: ['horizontal', 'vertical'],
    disabled: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'radio',
  budgetKb: 10000 / 1024,
  migration: [
    {
      from: 'GlassRadioGroup',
      props: {
        onChange: { to: 'onValueChange' },
        options: { to: 'children' },
        direction: 'orientation',
        glassVariant: null,
      },
      selectors: { '.glass-radio-group': '.ag-radio-group' }, automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
