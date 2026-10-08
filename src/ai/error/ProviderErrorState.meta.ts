import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ProviderErrorState',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['provider-error', 'error-title', 'error-detail', 'retry'],
  states: ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'],
  variants: {},
  budgetKb: 5,
  migration: [],
  selectors: [],
});
