import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'DescriptionList',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root','item','label','value'],
  states: [],
  variants: { layout: ['stacked','inline'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1.5,
  migration: [{ from: 'GlassDescriptionList', props: {}, selectors: { '.glass-description-list': '.ag-description-list' },  automation: 'full', compat: true }],
});
