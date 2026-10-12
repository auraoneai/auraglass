import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Card',
  owner: 'CMP',
  entry: '.',
  tier: 'T0',
  rsc: 'server',
  parts: ['root','header','title','description','body','footer'],
  states: [],
  variants: { interactive: ['true','false'] },
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 1500 / 1024,
  migration: [{ from: 'GlassCard', props: {}, selectors: { '.glass-card': '.ag-card' },  automation: 'mostly', compat: true }, { from: 'GlowingCard', props: {}, selectors: {}, automation: 'full', compat: true }, { from: 'WidgetGlass', props: {}, selectors: {}, automation: 'full', compat: true }, { from: 'GlassWorkspacePanel', props: {}, selectors: {}, automation: 'full', compat: true }],
});
