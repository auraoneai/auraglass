import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'InlineEdit',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','trigger','input'],
  states: ['active','idle'],
  variants: {},
  material: { layer: 'content' },
  apg: 'textbox',
  budgetKb: 10,
  migration: [{ from: 'GlassInlineEdit', props: {}, selectors: { '.glass-inline-edit': '.ag-inline-edit' },  automation: 'mostly', compat: true }],
});
