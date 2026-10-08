import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Command',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['command', 'input', 'list', 'item', 'group', 'group-heading', 'empty', 'loading', 'separator', 'shortcut'],
  states: ['active'],
  variants: {},
  migration: [{ from: 'GlassCommand', props: {}, automation: 'mostly', compat: true }],
});
