import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Link',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { intent: ['neutral','danger'], underline: ['always','hover','none'] },
  migration: [{ from: 'GlassLink', automation: 'full', compat: false }],
});
