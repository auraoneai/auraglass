import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ProviderErrorState',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['error-detail', 'error-title', 'hit-area', 'icon', 'provider-error', 'retry'],
  states: ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  variants: { appearance: ['compact', 'panel'] },
  budgetKb: 5,
  migration: [],
});
