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
  variants: {},
  migration: [{ from: 'GlassCommandPalette', props: { open: 'open', hotkey: 'hotkey' }, automation: 'mostly', compat: true }],
});
