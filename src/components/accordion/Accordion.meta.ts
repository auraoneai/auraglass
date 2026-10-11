import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Accordion',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 18,
  rsc: 'client',
  parts: ['root','item','header','trigger','content','hit-area'],
  states: ['expanded','collapsed'],
  variants: { multiple: ['true','false'] },
  material: { layer: 'content' },
  apg: 'accordion',
  budgetKb: 10,
  migration: [{ from: 'GlassAccordion', props: {}, selectors: { '.glass-accordion': '.ag-accordion' },  automation: 'mostly', compat: true }],
});
