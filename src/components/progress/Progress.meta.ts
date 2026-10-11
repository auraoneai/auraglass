import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'Progress',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','track','indicator','label','value'],
  states: ['loading','idle'],
  variants: {},
  material: { layer: 'content' },
  apg: 'none',
  budgetKb: 5,
  migration: [{ from: 'GlassProgress', props: {}, selectors: { '.glass-progress': '.ag-progress' },  automation: 'mostly', compat: true }, { from: 'CircularProgress', props: {}, selectors: { '.glass-circular-progress': '.ag-progress' },  automation: 'mostly', compat: true }],
});
