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
  parts: ['ellipsis', 'hit-area', 'item', 'next', 'page', 'pagination', 'pagination-list', 'previous', 'status'],
  states: ['current'],
  material: { layer: 'content', refractionEligible: false },
  variants: {},
  migration: [{ from: 'GlassPagination', props: { totalPages: 'pageCount', currentPage: 'page', onChange: 'onPageChange' }, selectors: { '.glass-pagination': '[data-ag-part="pagination"]' }, automation: 'mostly', compat: true }],
});
