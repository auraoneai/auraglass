import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Container',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { size: ['sm','md','lg','xl','full'] },
  migration: [{ from: 'GlassContainer', automation: 'full', compat: true }],
});
