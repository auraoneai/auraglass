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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1.5,
  migration: [{ from: 'GlassEmptyState', props: {}, selectors: { '.glass-empty-state': '.ag-empty-state' },  automation: 'full', compat: true }],
});
