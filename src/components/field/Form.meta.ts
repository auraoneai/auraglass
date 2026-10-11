import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Form',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 9,
  rsc: 'client',
  parts: ['root'],
  states: ['invalid', 'disabled'],
  variants: {},
  material: { layer: 'content', refractionEligible: false },
  budgetKb: 4,
  migration: [
    {
      from: 'GlassForm',
      props: {
        onSubmit: { to: 'onSubmit(values, eventDetails)' },
        errors: 'errors',
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
