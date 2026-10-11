import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'AgentSteps',
  owner: 'SURF',
  entry: './ai',
  tier: 'T2',
  rsc: 'server',
  parts: ['agent-steps', 'step', 'step-detail', 'step-duration', 'step-icon', 'step-label', 'step-state'],
  states: ['queued', 'running', 'needs-approval', 'succeeded', 'failed', 'denied', 'skipped'],
  apg: 'feed',
  variants: {},
  budgetKb: 5,
  migration: [],
});
