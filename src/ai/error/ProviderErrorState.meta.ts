import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ProviderErrorState',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'client',
  parts: ['error-detail', 'error-title', 'icon', 'provider-error', 'retry'],
  states: ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'],
  apg: 'alert',
  variants: {},
  budgetKb: 5,
  migration: [],
});
