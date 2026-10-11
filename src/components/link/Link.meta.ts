import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Link',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root', 'hit-area'],
  states: [],
  variants: { intent: ['neutral','danger'], underline: ['always','hover','none'] },
  material: { layer: 'content' },
  apg: 'link',
  budgetKb: 3,
  migration: [{ from: 'GlassLink', props: {}, selectors: { '.glass-link': '.ag-link' },  automation: 'full', compat: true }],
});
