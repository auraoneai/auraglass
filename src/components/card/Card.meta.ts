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
  migration: [{ from: 'GlassCard', automation: 'mostly', compat: true }, { from: 'GlowingCard', automation: 'full', compat: true }, { from: 'WidgetGlass', automation: 'full', compat: true }, { from: 'GlassWorkspacePanel', automation: 'full', compat: true }],
});
