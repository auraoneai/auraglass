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
  migration: [{ from: 'GlassDescriptionList', automation: 'full', compat: false }],
});
