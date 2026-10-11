import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'SearchField',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 10,
  rsc: 'client',
  parts: ['root', 'label', 'control-shell', 'icon', 'control', 'clear', 'shortcut', 'spinner', 'description', 'error'],
  states: ['focus-visible', 'disabled', 'invalid', 'loading'],
  variants: {
    loading: ['true', 'false'],
    variant: ['regular', 'clear', 'identity'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'chrome', refractionEligible: true },
  apg: 'searchbox',
  budgetKb: 6,
  migration: [
    {
      from: 'GlassSearchInput',
      props: {
        onChange: { to: 'onValueChange' },
        onSearch: { to: 'onValueChange + Enter submit' },
        clearable: null,
      },
      automation: 'mostly',
      compat: false,
    },
    { from: 'GlassIntelligentSearch', automation: 'partial', compat: true },
    { from: 'GlassSearchField', automation: 'full', compat: true },
    { from: 'GlassSearchInterface', automation: 'partial', compat: true },
    { from: 'LiquidGlassSearchField', automation: 'full', compat: true },
  ],
});

export default meta;
