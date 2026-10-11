import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Toolbar',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 3,
  rsc: 'client',
  parts: ['root', 'button', 'icon', 'label', 'group', 'separator', 'link', 'hit-area'],
  states: ['hover', 'active', 'focus-visible', 'pressed', 'disabled'],
  variants: {
    orientation: ['horizontal', 'vertical'],
    variant: ['regular', 'clear', 'identity'],
  },
  material: { layer: 'chrome', refractionEligible: true },
  apg: 'toolbar',
  budgetKb: 13,
  migration: [
    {
      from: 'GlassToolbar',
      props: { orientation: 'orientation', items: null },
      selectors: { '.glass-toolbar': '.ag-toolbar' }, automation: 'partial',
      compat: true,
    },
  ],
});
