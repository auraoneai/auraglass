import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Avatar',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','image','fallback'],
  states: [],
  variants: { size: ['sm','md','lg'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 3,
  migration: [{ from: 'GlassAvatar', props: {}, selectors: { '.glass-avatar': '.ag-avatar' },  automation: 'mostly', compat: true }],
});
