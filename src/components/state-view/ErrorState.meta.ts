import { defineMeta } from '../../foundation/index';

export const ErrorStateMeta = defineMeta({
  name: 'ErrorState',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root', 'icon', 'title', 'description', 'actions'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassErrorState', props: {}, selectors: { '.glass-error-state': '.ag-error-state' },  automation: 'full', compat: true }],
});
