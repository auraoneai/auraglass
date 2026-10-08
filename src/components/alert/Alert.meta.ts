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
  migration: [{ from: 'GlassAlert', automation: 'mostly', compat: true }],
});
