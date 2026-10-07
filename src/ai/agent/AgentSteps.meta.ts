import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'AgentSteps',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  flagship: false,
  rsc: 'server',
  parts: ['agent-steps', 'step', 'step-icon', 'step-label', 'step-state', 'step-duration', 'step-detail'],
  states: ['queued', 'running', 'needs-approval', 'succeeded', 'failed', 'denied', 'skipped'],
  variants: {},
  budgetKb: 5,
  migration: [],
  selectors: [],
});
