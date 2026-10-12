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
  budgetKb: 1500 / 1024,
  migration: [{ from: 'Typography', props: { variant: { to: 'type', values: { body: 'body', body1: 'body', body2: 'callout', caption: 'caption', callout: 'callout', label: 'label', overline: 'label', mono: 'mono', code: 'mono' } }, 'variant:h1': null, 'variant:h2': null, 'variant:h3': null, 'variant:h4': null, 'variant:h5': null, 'variant:h6': null }, selectors: { '.glass-typography': '.ag-text' },  automation: 'mostly', compat: true }, { from: 'GlassText', props: {}, selectors: { '.glass-text': '.ag-text' },  automation: 'mostly', compat: false }],
});
