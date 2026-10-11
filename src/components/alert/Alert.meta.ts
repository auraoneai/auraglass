import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Alert',
  owner: 'CMP',
  entry: '.',
  tier: 'T2',
  rsc: 'server',
  parts: ['root','icon','title','description','actions','action'],
  states: [],
  variants: { intent: ['info','success','warning','danger'], urgent: ['true','false'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 3,
  migration: [{ from: 'GlassAlert', props: {}, selectors: { '.glass-alert': '.ag-alert' },  automation: 'mostly', compat: true }],
});
