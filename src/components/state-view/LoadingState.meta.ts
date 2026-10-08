import { defineMeta } from '../../foundation/index';

export const LoadingStateMeta = defineMeta({
  name: 'LoadingState',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'icon', 'description', 'status'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassLoadingState', automation: 'full', compat: true }],
});
