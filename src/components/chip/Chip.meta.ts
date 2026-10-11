import { defineMeta } from '../../foundation/index';

export const ChipMeta = defineMeta({
  name: 'Chip',
  owner: 'CMP',
  entry: './data',
  tier: 'T2',
  rsc: 'client',
  parts: ['root', 'leading-icon', 'label', 'trailing-icon', 'close'],
  states: ['pressed', 'disabled'],
  variants: {},
  material: { layer: 'content' },
  apg: 'button',
  budgetKb: 3000 / 1024,
  migration: [{ from: 'GlassChip', props: {}, selectors: { '.glass-chip': '.ag-chip' },  automation: 'full', compat: true }],
});
