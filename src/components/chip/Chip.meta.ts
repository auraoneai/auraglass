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
  migration: [{ from: 'GlassChip', automation: 'full', compat: true }],
});
