import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'StatusBar',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'server',
  parts: ['status-bar', 'status-bar-item', 'status-bar-live'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassStatusBar', props: {}, automation: 'mostly', compat: true }],
});
