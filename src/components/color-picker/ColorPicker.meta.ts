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
  apg: 'slider',
  migration: [{ from: 'GlassColorPicker', automation: 'partial', compat: true }, { from: 'GlassColorWheel', automation: 'full', compat: true }, { from: 'GlassGradientPicker', automation: 'full', compat: true }],
});
