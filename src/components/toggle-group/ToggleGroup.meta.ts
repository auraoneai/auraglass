import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ToggleGroup',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 3,
  rsc: 'client',
  parts: ['root', 'item'],
  states: ['hover', 'pressed', 'focus-visible', 'disabled'],
  variants: {
    multiple: ['true', 'false'],
    orientation: ['horizontal', 'vertical'],
  },
  apg: 'button',
  budgetKb: 5,
  migration: [
    {
      from: 'GlassToggleGroup',
      props: { value: 'value', onChange: 'onValueChange', multiple: 'multiple' },
      automation: 'mostly',
      compat: true,
    },
  ],
});
