import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Breadcrumbs',
  owner: 'SURF',
  entry: '.',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  budgetKb: 9,
  flagship: 27,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['breadcrumbs', 'current', 'ellipsis', 'glyph', 'hit-area', 'icon', 'item', 'label', 'link', 'list', 'popup', 'positioner', 'separator'],
  states: [],
  material: { layer: 'content', refractionEligible: false },
  variants: {},
  migration: [{ from: 'GlassBreadcrumbs', props: { items: null, separator: 'separator' }, selectors: { '.glass-breadcrumbs': '[data-ag-part="breadcrumbs"]' }, automation: 'mostly', compat: true }],
});
