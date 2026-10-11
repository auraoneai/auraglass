import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Field',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 9,
  rsc: 'client',
  parts: ['root', 'label', 'control-shell', 'description', 'error'],
  states: ['disabled', 'invalid', 'focus-visible'],
  variants: {
    invalid: ['true', 'false'],
    disabled: ['true', 'false'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'none',
  budgetKb: 6000 / 1024,
  migration: [
    {
      from: 'GlassField',
      props: {
        label: { to: 'children' },
        description: { to: 'children' },
        error: { to: 'invalid + <Field.Error>' },
        hint: { to: 'children' },
        required: 'aria-required on the inner control',
      },
      selectors: { '.glass-field': '.ag-field' }, automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
