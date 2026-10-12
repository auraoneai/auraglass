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
  // Absorbed 4.x names (codemod renames in fragments/codemods/surf.ts;
  // compat adapters in src/compat/surf/navigation/, DEP-S0024/S0025).
  migration: [
    { from: 'LiquidGlassTransitionProvider', props: {}, selectors: { '.glass-transition-provider': '[data-ag-part="source-transition"]' }, automation: 'mostly', compat: true },
    { from: 'LiquidGlassSource', props: {}, selectors: { '.glass-source': '[data-ag-part="source"]' }, automation: 'mostly', compat: true },
    { from: 'LiquidGlassDestination', props: {}, selectors: { '.glass-destination': '[data-ag-part="destination"]' }, automation: 'mostly', compat: true },
  ],
});
