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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassLoadingState', props: {}, selectors: { '.glass-loading-state': '.ag-loading-state' },  automation: 'full', compat: true }],
});
