import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Inspector',
  owner: 'SURF',
  entry: './app-shell',
  tier: 'T1',
  rsc: 'server',
  parts: ['content', 'hit-area', 'icon', 'inspector', 'inspector-content', 'inspector-field', 'inspector-field-label', 'inspector-field-value', 'inspector-header', 'inspector-section', 'inspector-title', 'root', 'trigger'],
  states: ['open', 'closed'],

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'landmarks',
  variants: {},
  migration: [{ from: 'GlassInspector', props: {}, automation: 'mostly', compat: true }],
});
