import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Fieldset',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 9,
  rsc: 'client',
  parts: ['root', 'legend'],
  states: ['disabled'],
  variants: {
    disabled: ['true', 'false'],
  },
  material: { layer: 'content', refractionEligible: false },
  budgetKb: 3,
  migration: [
    {
      from: 'GlassFieldGroup',
      props: {
        legend: 'legend',
        title: 'legend',
        description: { to: 'children' },
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
