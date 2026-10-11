import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Container',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { size: ['sm','md','lg','xl','full'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassContainer', props: {}, selectors: { '.glass-container': '.ag-container' },  automation: 'full', compat: true }],
});
