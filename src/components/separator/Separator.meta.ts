import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Separator',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root'],
  states: [],
  variants: { orientation: ['horizontal','vertical'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassSeparator', props: {}, selectors: { '.glass-separator': '.ag-separator' },  automation: 'full', compat: true }, { from: 'GlassDivider', props: {}, selectors: { '.glass-divider': '.ag-separator' },  automation: 'full', compat: true }],
});
