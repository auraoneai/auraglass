import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'NumberField',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 13,
  rsc: 'client',
  parts: ['root', 'group', 'input', 'increment', 'decrement', 'scrub-area', 'label', 'description', 'error', 'hit-area'],
  states: ['focus-visible', 'disabled', 'invalid', 'scrubbing'],
  variants: {
    disabled: ['true', 'false'],
    variant: ['regular', 'clear', 'identity'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: true },
  apg: 'spinbutton',
  budgetKb: 14,
  migration: [
    {
      from: 'GlassNumberInput',
      props: {
        onChange: { to: 'onValueChange' },
        formatter: { to: 'format' },
        parser: { to: 'locale/format' },
      },
      selectors: { '.glass-number-input': '.ag-number-field' }, automation: 'partial',
      compat: true,
    },
  ],
});

export default meta;
