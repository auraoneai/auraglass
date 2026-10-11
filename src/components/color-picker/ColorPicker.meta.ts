import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'ColorPicker',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','trigger','swatch','positioner','popup','area','area-thumb','hue','hue-thumb'],
  states: ['open','closed'],
  variants: {},
  material: { layer: 'content' },
  apg: 'slider',
  budgetKb: 20,
  migration: [{ from: 'GlassColorPicker', props: {}, selectors: { '.glass-color-picker': '.ag-color-picker' },  automation: 'partial', compat: true }],
});
