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
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1.5,
  migration: [{ from: 'Typography', props: {}, selectors: { '.glass-typography': '.ag-text' },  automation: 'mostly', compat: true }, { from: 'GlassText', props: {}, selectors: { '.glass-text': '.ag-text' },  automation: 'mostly', compat: true }],
});
