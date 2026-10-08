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
  apg: 'textbox',
  migration: [{ from: 'GlassInlineEdit', automation: 'mostly', compat: true }],
});
