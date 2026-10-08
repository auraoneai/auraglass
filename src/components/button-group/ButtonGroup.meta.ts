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
  budgetKb: 3,
  migration: [
    {
      from: 'GlassButtonGroup',
      props: { orientation: 'orientation', attached: 'attached' },
      automation: 'full',
      compat: true,
    },
  ],
});
