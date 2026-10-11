import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'CommandPalette',
  owner: 'SURF',
  entry: '.',
  flagship: 29,
  tier: 'T1',
  rsc: 'client',
  parts: ['command-palette'],
  states: ['open', 'closed'],

  material: { layer: 'overlay', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  variants: {},
  migration: [{ from: 'GlassCommandPalette', props: { open: 'open', hotkey: 'hotkey' }, automation: 'mostly', compat: true }],
});
