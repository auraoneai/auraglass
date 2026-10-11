import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'ImageList',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root','item','item-bar','item-bar-text','item-bar-title','item-bar-subtitle','item-bar-action'],
  states: [],
  variants: { variant: ['standard','quilted','masonry'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 10,
  migration: [{ from: 'GlassImageList', props: {}, selectors: { '.glass-image-list': '.ag-image-list' },  automation: 'mostly', compat: true }],
});
