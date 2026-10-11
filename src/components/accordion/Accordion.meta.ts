import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Accordion',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','item','header','trigger','content','hit-area'],
  states: ['expanded','collapsed'],
  variants: { multiple: ['true','false'] },
  apg: 'accordion',
  migration: [{ from: 'GlassAccordion', automation: 'mostly', compat: true }],
});
