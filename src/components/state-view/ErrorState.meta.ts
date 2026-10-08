import { defineMeta } from '../../foundation/index';

export const ErrorStateMeta = defineMeta({
  name: 'ErrorState',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'icon', 'title', 'description', 'actions', 'action'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassErrorState', automation: 'full', compat: true }],
});
