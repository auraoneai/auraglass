import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'TopBar',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'server',
  parts: ['top-bar', 'top-bar-leading', 'top-bar-center', 'top-bar-trailing', 'top-bar-title'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassTopBar', props: {}, automation: 'mostly', compat: true }],
});
