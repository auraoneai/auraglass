import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Breadcrumbs',
  owner: 'SURF',
  entry: '.',
  apg: 'breadcrumb',
  budgetKb: 5,
  flagship: 27,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['breadcrumbs', 'current', 'ellipsis', 'glyph', 'hit-area', 'icon', 'item', 'link', 'list', 'popup', 'positioner', 'separator'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassBreadcrumbs', props: { items: null, separator: 'separator' }, automation: 'mostly', compat: true }],
});
