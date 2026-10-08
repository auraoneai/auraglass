import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Heading',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { size: ['display','title-1','title-2','title-3','sm','md','lg','xl'] },
  migration: [{ from: 'DisplayText', automation: 'mostly', compat: true }, { from: 'GlassHeading', automation: 'full', compat: true }],
});
