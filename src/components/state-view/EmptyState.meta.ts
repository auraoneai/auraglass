import { defineMeta } from '../../foundation/index';

export const EmptyStateMeta = defineMeta({
  name: 'EmptyState',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'icon', 'title', 'description', 'actions', 'action'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassEmptyState', automation: 'full', compat: true }],
});
