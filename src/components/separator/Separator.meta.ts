import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Separator',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { orientation: ['horizontal','vertical'] },
  migration: [{ from: 'GlassSeparator', automation: 'full', compat: true }, { from: 'GlassDivider', automation: 'full', compat: true }],
});
