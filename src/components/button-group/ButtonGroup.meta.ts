import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ButtonGroup',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'item'],
  states: [],
  variants: {
    orientation: ['horizontal', 'vertical'],
    attached: ['true', 'false'],
  },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 10000 / 1024,
  migration: [
    {
      from: 'GlassButtonGroup',
      props: { orientation: 'orientation', attached: 'attached' },
      selectors: { '.glass-button-group': '.ag-button-group' }, automation: 'full',
      compat: true,
    },
  ],
});
