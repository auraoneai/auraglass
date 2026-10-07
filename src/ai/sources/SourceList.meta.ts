import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'SourceList',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'client',
  parts: ['source-list', 'trigger', 'sources', 'source', 'source-link', 'source-text', 'source-host', 'source-file'],
  states: [],
  variants: {},
  budgetKb: 5,
  migration: [],
  selectors: [],
});
