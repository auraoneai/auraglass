/* ai-workspace fixtures (REQ-SURF-172): a deterministic support-engineering
 * agent session over the AgMessage model (structural mirror of the AI SDK
 * UIMessage). An on-call engineer asks the agent to investigate a latency
 * regression; the agent searches runbooks, queries metrics, cites its sources
 * (`source-url` parts) and asks for approval before a rollback. The session is
 * exported as three snapshots of the same conversation so stories, tests and
 * the replay transport can show each step of the approval flow:
 *
 *   AWAITING_APPROVAL  the rollback tool part is `approval-requested`
 *   APPROVAL_RESPONDED the user approved: same part, `approval-responded`
 *   COMPLETED          the approved tool ran (`output-available`) and the
 *                      agent reported back
 *
 * No clocks, randomness or network: timestamps and ids are literals. */
import type { AgMessage, AgPart, AgToolPart } from 'aura-glass/ai';

const USER_PROMPT: AgMessage = {
  id: 'sup-u1',
  role: 'user',
  parts: [
    {
      type: 'text',
      text: 'checkout-api p95 latency jumped from 310 ms to 2.4 s right after the 09:05 deploy (INC-2207). Find the cause and roll back if that is the fix.',
    },
  ],
  metadata: { createdAt: '2026-10-05T09:14:00Z' },
};

const INVESTIGATION: readonly AgPart[] = [
  { type: 'step-start' },
  {
    type: 'reasoning',
    text: 'The regression lines up with deploy r-4813. Check the runbook for checkout latency, then compare database pool metrics before and after the deploy.',
  },
  {
    type: 'tool-search_runbooks',
    toolCallId: 'call-runbooks',
    state: 'output-available',
    input: { query: 'checkout-api latency regression after deploy' },
    output: {
      hits: [
        { id: 'RB-112', title: 'checkout-api: connection pool exhaustion', url: 'https://runbooks.example.com/checkout-api/pool-exhaustion' },
      ],
    },
  },
  { type: 'step-start' },
  {
    type: 'tool-query_metrics',
    toolCallId: 'call-metrics',
    state: 'output-available',
    input: { service: 'checkout-api', metric: 'db.pool.wait_ms.p95', window: '08:45-09:15' },
    output: { before: { p95: 4 }, after: { p95: 1870 }, poolSize: { before: 50, after: 10 } },
  },
  { type: 'step-start' },
  {
    type: 'text',
    text:
      'Deploy r-4813 lowered the database pool from 50 to 10 connections. Pool wait p95 went from 4 ms to 1,870 ms, which accounts for almost all of the added latency. ' +
      'The runbook says to roll back to the last good revision first and fix the config afterwards. I can roll checkout-api back to r-4812.',
  },
  {
    type: 'source-url',
    sourceId: 'src-runbook',
    url: 'https://runbooks.example.com/checkout-api/pool-exhaustion',
    title: 'RB-112 · checkout-api connection pool exhaustion',
  },
  {
    type: 'source-url',
    sourceId: 'src-deploy',
    url: 'https://deploys.example.com/checkout-api/r-4813',
    title: 'Deploy r-4813 · config diff',
  },
  {
    type: 'source-url',
    sourceId: 'src-dashboard',
    url: 'https://metrics.example.com/d/checkout-api-db?from=0845&to=0915',
    title: 'checkout-api database dashboard',
  },
];

const ROLLBACK_INPUT = { service: 'checkout-api', toRevision: 'r-4812', reason: 'INC-2207 pool exhaustion' };

const ROLLBACK_REQUESTED: AgToolPart = {
  type: 'tool-rollback_deploy',
  toolCallId: 'call-rollback',
  state: 'approval-requested',
  input: ROLLBACK_INPUT,
  approval: { id: 'approval-rollback' },
};

const ROLLBACK_RESPONDED: AgToolPart = {
  ...ROLLBACK_REQUESTED,
  state: 'approval-responded',
  approval: { id: 'approval-rollback', approved: true, reason: 'Approved by on-call. Roll back now.' },
};

const ROLLBACK_DONE: AgToolPart = {
  ...ROLLBACK_RESPONDED,
  state: 'output-available',
  output: { revision: 'r-4812', status: 'healthy', p95Ms: 318 },
};

function agentTurn(rollback: AgToolPart, tail: readonly AgPart[] = []): AgMessage {
  return {
    id: 'sup-a1',
    role: 'assistant',
    parts: [...INVESTIGATION, rollback, ...tail],
    metadata: {
      createdAt: '2026-10-05T09:14:06Z',
      model: 'kiro-prism',
      status: tail.length > 0 ? 'complete' : 'pending',
      usage: { inputTokens: 6240, outputTokens: 412, reasoningTokens: 96, contextWindow: 200000 },
    },
  };
}

/** Step 1: the agent asks before the rollback runs. */
export const AWAITING_APPROVAL: AgMessage[] = [USER_PROMPT, agentTurn(ROLLBACK_REQUESTED)];

/** Step 2: the approval response, recorded on the same tool part. */
export const APPROVAL_RESPONDED: AgMessage[] = [USER_PROMPT, agentTurn(ROLLBACK_RESPONDED)];

/** Step 3: the approved rollback ran and the agent reported the result. */
export const COMPLETED: AgMessage[] = [
  USER_PROMPT,
  agentTurn(ROLLBACK_DONE, [
    { type: 'step-start' },
    {
      type: 'text',
      text: 'Rolled checkout-api back to r-4812. p95 is back to 318 ms. Next, restore the pool size to 50 in the r-4813 config before redeploying.',
    },
  ]),
];

/** The approval flow in order, for replay and step-through stories. */
export const SESSION_STEPS: readonly AgMessage[][] = [AWAITING_APPROVAL, APPROVAL_RESPONDED, COMPLETED];

/** Default block content: the session waiting on the approval decision. */
export const MESSAGES: AgMessage[] = AWAITING_APPROVAL;

/** Mid-stream snapshot: the agent's text part is still streaming. */
export const STREAMING_MESSAGES: AgMessage[] = [
  USER_PROMPT,
  {
    id: 'sup-a1',
    role: 'assistant',
    parts: [
      { type: 'step-start' },
      { type: 'text', text: 'Checking the deploy timeline for checkout-api', state: 'streaming' },
    ],
    metadata: { createdAt: '2026-10-05T09:14:06Z', model: 'kiro-prism', status: 'streaming' },
  },
];

/** Reply streamed by the story replay transport for a follow-up question. */
export const REPLAY_REPLY: AgMessage = {
  id: 'sup-a2',
  role: 'assistant',
  parts: [
    { type: 'step-start' },
    {
      type: 'text',
      text: 'The pool size was changed in config/checkout-api.yaml in r-4813. Set db.pool.max back to 50 and redeploy once the rollback has been stable for 30 minutes.',
    },
    {
      type: 'source-url',
      sourceId: 'src-deploy',
      url: 'https://deploys.example.com/checkout-api/r-4813',
      title: 'Deploy r-4813 · config diff',
    },
  ],
  metadata: { createdAt: '2026-10-05T09:31:00Z', model: 'kiro-prism', status: 'complete' },
};
