import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'ScrollArea',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','viewport','scrollbar','thumb'],
  states: [],
  variants: {},
  apg: 'region',
  migration: [{ from: 'GlassScrollArea', automation: 'mostly', compat: true }],
});
