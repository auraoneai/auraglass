import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Breadcrumbs',
  owner: 'SURF',
  entry: '.',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  budgetKb: 5,
  flagship: 27,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['breadcrumbs', 'current', 'ellipsis', 'glyph', 'item', 'link', 'list', 'overflow-menu', 'separator'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassBreadcrumbs', props: { items: null, separator: 'separator' }, automation: 'mostly', compat: true }],
});
