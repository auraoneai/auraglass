import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Inspector',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'server',
  parts: ['inspector', 'inspector-header', 'inspector-content', 'inspector-field', 'inspector-field-label', 'inspector-field-value'],
  states: ['open', 'closed'],
  variants: {},
  migration: [{ from: 'GlassInspector', props: {}, automation: 'mostly', compat: true }],
});
