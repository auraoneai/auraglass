import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Text',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { type: ['body','callout','caption','label','mono'], size: ['xs','sm','md','lg'], intent: ['neutral','success','warning','danger'] },
  migration: [{ from: 'Typography', automation: 'mostly', compat: true }, { from: 'GlassText', automation: 'mostly', compat: false }],
});
