import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Inspector',
  owner: 'SURF',
  entry: './app-shell',
  tier: 'T1',
  rsc: 'server',
  parts: ['inspector', 'inspector-content', 'inspector-field', 'inspector-field-label', 'inspector-field-value', 'inspector-header', 'inspector-section', 'inspector-sheet', 'inspector-title'],
  states: ['open', 'closed'],

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  variants: {},
  migration: [{ from: 'GlassInspector', props: {}, automation: 'mostly', compat: true }],
});
