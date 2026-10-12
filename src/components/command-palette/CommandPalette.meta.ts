import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'CommandPalette',
  owner: 'SURF',
  entry: '.',
  flagship: 29,
  tier: 'T1',
  rsc: 'client',
  parts: ['command', 'command-palette', 'empty', 'group', 'group-heading', 'input', 'item', 'list', 'loading', 'portal', 'scrim', 'separator', 'shortcut'],
  states: ['open', 'closed'],

  material: { layer: 'overlay', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  budgetKb: 10,
  variants: {},
  migration: [{ from: 'GlassCommandPalette', props: { open: 'open', hotkey: 'hotkey' }, selectors: { '.glass-command-palette': '[data-ag-part="command-palette"]' }, automation: 'mostly', compat: true }],
});
