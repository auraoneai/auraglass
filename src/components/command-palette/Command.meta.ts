import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Command',
  owner: 'SURF',
  entry: '.',

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'listbox',
  budgetKb: 6,
  flagship: 29,
  tier: 'T1',
  rsc: 'client',
  parts: ['command', 'empty', 'group', 'group-heading', 'input', 'item', 'list', 'loading', 'separator', 'shortcut'],
  states: ['active'],
  variants: {},
  migration: [{ from: 'GlassCommand', props: {}, automation: 'mostly', compat: true }],
});
