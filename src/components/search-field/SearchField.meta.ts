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
  budgetKb: 13000 / 1024,
  migration: [
    {
      from: 'GlassSearchInput',
      props: {
        onChange: { to: 'onValueChange' },
        onSearch: { to: 'onValueChange + Enter submit' },
        clearable: null,
      },
      selectors: { '.glass-search-input': '.ag-search-field' }, automation: 'mostly',
      compat: false,
    },
    { from: 'GlassIntelligentSearch', props: {}, selectors: {}, automation: 'partial', compat: true },
    { from: 'GlassSearchField', props: {}, selectors: {}, automation: 'full', compat: true },
    { from: 'GlassSearchInterface', props: {}, selectors: {}, automation: 'partial', compat: true },
    { from: 'LiquidGlassSearchField', props: {}, selectors: {}, automation: 'full', compat: true },
  ],
});

export default meta;
