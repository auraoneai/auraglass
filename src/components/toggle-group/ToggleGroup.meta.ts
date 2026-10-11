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
  material: { layer: 'content' },
  apg: 'button',
  budgetKb: 11000 / 1024,
  migration: [
    {
      from: 'GlassToggleGroup',
      props: { value: 'value', onChange: 'onValueChange', multiple: 'multiple' },
      selectors: { '.glass-toggle-group': '.ag-toggle-group' }, automation: 'mostly',
      compat: true,
    },
  ],
});
