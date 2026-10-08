import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Slider',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 6,
  rsc: 'client',
  parts: ['root', 'control', 'track', 'range', 'thumb', 'value', 'mark', 'mark-label'],
  states: ['dragging', 'disabled', 'readOnly', 'focus-visible'],
  variants: {
    orientation: ['horizontal', 'vertical'],
    range: ['true', 'false'],
    disabled: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'slider',
  budgetKb: 6,
  migration: [
    {
      from: 'GlassSlider',
      props: {
        onChange: { to: 'onValueChange' },
        onAfterChange: 'onValueCommitted',
        glassVariant: null,
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
