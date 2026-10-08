import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'ImageList',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'client',
  parts: ['root','item','item-bar','item-bar-text','item-bar-title','item-bar-subtitle','item-bar-action'],
  states: [],
  variants: { variant: ['standard','quilted','masonry'] },
  migration: [{ from: 'GlassImageList', automation: 'mostly', compat: true }],
});
