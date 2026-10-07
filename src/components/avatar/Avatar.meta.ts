import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Avatar',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','image','fallback'],
  states: [],
  variants: { size: ['sm','md','lg'] },
  migration: [{ from: 'GlassAvatar', automation: 'mostly', compat: true }],
});
