import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Breadcrumbs',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'mixed',
  parts: ['breadcrumbs', 'list', 'item', 'link', 'current', 'separator', 'ellipsis', 'overflow-menu'],
  states: [],
  variants: {},
  migration: [{ from: 'GlassBreadcrumbs', props: { items: null, separator: 'separator' }, automation: 'mostly', compat: true }],
});
