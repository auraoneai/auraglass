import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'IconButton',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 2,
  rsc: 'client',
  parts: ['root', 'icon', 'hit-area'],
  states: ['hover', 'active', 'focus-visible', 'pressed', 'disabled'],
  variants: {
    variant: ['regular', 'clear', 'identity'],
    prominent: ['true', 'false'],
    intent: ['neutral', 'danger'],
    size: ['sm', 'md', 'lg'],
    shape: ['capsule', 'fixed'],
  },
  material: { layer: 'chrome', refractionEligible: true },
  apg: 'button',
  budgetKb: 10,
  migration: [
    {
      from: 'GlassIconButton',
      props: { 'aria-label': 'label', children: 'icon', variant: 'prominent', size: 'size' },
      selectors: { '.glass-icon-button': '.ag-icon-button' }, automation: 'mostly',
      compat: true,
    },
  ],
});
