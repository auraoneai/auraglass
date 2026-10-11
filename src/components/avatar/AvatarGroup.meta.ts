import { defineMeta } from '../../foundation/index';

export const AvatarGroupMeta = defineMeta({
  name: 'AvatarGroup',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'item', 'value'],
  states: [],
  variants: { size: ['sm', 'md', 'lg'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 3000 / 1024,
  migration: [{ from: 'GlassAvatarGroup', props: {}, selectors: { '.glass-avatar-group': '.ag-avatar-group' },  automation: 'full', compat: true }],
});
