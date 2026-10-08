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
  migration: [{ from: 'GlassAvatarGroup', automation: 'full', compat: true }],
});
