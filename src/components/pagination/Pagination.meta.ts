import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Pagination',
  owner: 'SURF',
  entry: '.',
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  budgetKb: 4,
  flagship: 28,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['ellipsis', 'item', 'next', 'page', 'pagination', 'pagination-list', 'previous', 'status'],
  states: ['current'],
  variants: {},
  migration: [{ from: 'GlassPagination', props: { totalPages: 'pageCount', currentPage: 'page', onChange: 'onPageChange' }, automation: 'mostly', compat: true }],
});
