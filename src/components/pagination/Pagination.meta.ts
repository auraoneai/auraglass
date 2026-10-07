import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Pagination',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'mixed',
  parts: ['pagination', 'pagination-list', 'item', 'page', 'previous', 'next', 'ellipsis'],
  states: ['current'],
  variants: {},
  migration: [{ from: 'GlassPagination', props: { totalPages: 'pageCount', currentPage: 'page', onChange: 'onPageChange' }, automation: 'mostly', compat: true }],
});
