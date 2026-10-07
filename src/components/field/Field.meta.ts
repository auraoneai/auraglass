import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Field',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 9,
  rsc: 'client',
  parts: ['root', 'label', 'control', 'description', 'error'],
  states: ['disabled', 'invalid', 'focus-visible'],
  variants: {
    invalid: ['true', 'false'],
    disabled: ['true', 'false'],
  },
  material: { layer: 'content', refractionEligible: false },
  budgetKb: 6,
  migration: [
    {
      from: 'GlassField',
      props: {
        label: { to: 'children', note: 'compose <Field.Label>' },
        description: { to: 'children', note: 'compose <Field.Description>' },
        error: { to: 'invalid + <Field.Error>', note: 'error text moves to Field.Error children; boolean becomes invalid' },
        hint: { to: 'children', note: 'compose <Field.Description>' },
        required: 'aria-required on the inner control',
      },
      notes: '4.x compound field collapses into the compose-parts Field; label/description/error become explicit parts.',
    },
  ],
});

export default meta;
