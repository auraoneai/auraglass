import { defineMeta } from '../foundation/index';

export const IconMeta = defineMeta({
  name: 'Icon',
  owner: 'CMP',
  entry: './icons',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1,
  migration: [
    { from: 'GlassIcon', props: { name: 'name' }, selectors: { '.glass-icon': '.ag-icon' }, automation: 'full', compat: true },
  ],
});
