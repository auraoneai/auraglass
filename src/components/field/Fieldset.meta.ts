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
  apg: 'none',
  budgetKb: 3000 / 1024,
  migration: [
    {
      from: 'GlassFieldGroup',
      props: {
        legend: 'legend',
        title: 'legend',
        description: { to: 'children' },
      },
      selectors: { '.glass-field-group': '.ag-fieldset' }, automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
