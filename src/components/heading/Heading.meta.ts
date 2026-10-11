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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1.5,
  migration: [{ from: 'DisplayText', props: {}, selectors: { '.glass-display-text': '.ag-heading' },  automation: 'mostly', compat: true }, { from: 'GlassHeading', props: {}, selectors: { '.glass-heading': '.ag-heading' },  automation: 'full', compat: true }],
});
