import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Progress',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','track','indicator','label','value'],
  states: ['loading','idle'],
  variants: {},
  migration: [{ from: 'GlassProgress', automation: 'mostly', compat: true }, { from: 'CircularProgress', automation: 'mostly', compat: true }],
});
