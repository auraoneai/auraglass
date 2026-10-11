import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'SegmentedControl',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 4,
  rsc: 'client',
  parts: ['root', 'item', 'item-label', 'indicator'],
  states: ['checked', 'hover', 'focus-visible', 'disabled', 'animating'],
  variants: {
    size: ['sm', 'md', 'lg'],
    variant: ['regular', 'clear', 'identity'],
  },
  material: { layer: 'chrome', refractionEligible: true },
  apg: 'radio',
  budgetKb: 10,
  migration: [
    {
      from: 'GlassSegmentedControl',
      props: { value: 'value', onChange: 'onValueChange', options: null },
      automation: 'partial',
      compat: true,
    },
    { from: 'LiquidGlassSegmentedControl', automation: 'full', compat: true },
  ],
});
