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
  apg: 'listbox',
  variants: {},
  migration: [{ from: 'GlassCommandPalette', props: { open: 'open', hotkey: 'hotkey' }, automation: 'mostly', compat: true }],
});
