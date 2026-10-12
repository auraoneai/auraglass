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
  budgetKb: 1500 / 1024,
  migration: [
    // compat:false: #313 has no DEP-C row for GlassIcon, so no compat adapter ships (REQ-CMP-131)
    { from: 'GlassIcon', props: { name: 'name' }, selectors: { '.glass-icon': '.ag-icon' }, automation: 'full', compat: false },
  ],
});
