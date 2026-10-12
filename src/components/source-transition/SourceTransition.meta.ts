import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'SourceTransition',
  owner: 'SURF',
  entry: '.',
  budgetKb: 3,
  flagship: 31,
  tier: 'T1',
  rsc: 'client',
  parts: ['destination', 'source', 'source-transition'],
  states: [],
  material: { layer: 'content', refractionEligible: false },
  // REQ-SURF-65: SURF owns focus — it follows the morph to the destination's
  // first focusable (APG keyboard-interface practice, managing focus).
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/',
  variants: {},
  migration: [],
});
