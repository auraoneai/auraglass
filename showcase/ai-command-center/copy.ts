/* ai-command-center copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59).
   Every timestamp derives from the fixed showcase epoch; nothing reads the wall clock. */
import type { AgMessage, AgSourcePart, AgStep, AgToolPart } from 'aura-glass/ai';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z (matches the certification determinism fixture). */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

const at = (minutes: number) => new Date(SHOWCASE_EPOCH + minutes * 60_000).toISOString();

export const COPY = {
  product: 'Northwind Operations',
  skip: 'Skip to conversation',
  pageTitle: 'Incident 4821 — checkout latency',
  pageDescription: 'Assistant-led triage for the EU-West checkout regression reported at 09:12 UTC.',
  commandHint: 'Search commands',
  commandShortcut: '⌘K',
  newChat: 'New conversation',
  settings: 'Assistant settings',
  share: 'Share transcript',
  navLabel: 'Conversations',
  toolActivity: 'Tool activity',
  reasoning: 'How the assistant reached this answer',
  sources: 'Sources',
  runbook: 'Run inspector',
  draftReply: 'Rollback summary for the on-call channel',
  toastTitle: 'Runbook step approved',
  toastBody: 'Canary rollback for checkout-api was queued by Priya Raman.',
  composerPlaceholder: 'Ask about incident 4821…',
} as const;

export const CONVERSATIONS = [
  { id: 'inc-4821', label: 'Incident 4821 — checkout latency', current: true },
  { id: 'inc-4817', label: 'Incident 4817 — search 502s', current: false },
  { id: 'rel-2026-09', label: 'Release notes: September train', current: false },
  { id: 'cap-q4', label: 'Capacity plan for Q4 peak', current: false },
  { id: 'aud-soc2', label: 'SOC 2 evidence request', current: false },
  { id: 'onb-eu', label: 'EU payments onboarding', current: false },
] as const;

export const COMMANDS = [
  { value: 'open-incident', label: 'Open incident timeline' },
  { value: 'page-oncall', label: 'Page the payments on-call' },
  { value: 'export-transcript', label: 'Export transcript as Markdown' },
  { value: 'switch-model', label: 'Switch assistant model' },
  { value: 'attach-dashboard', label: 'Attach latency dashboard' },
] as const;

export const SOURCES: AgSourcePart[] = [
  { type: 'source-url', sourceId: 'src-grafana', url: 'https://grafana.northwind.example/d/checkout-p99', title: 'Checkout p99 latency dashboard' },
  { type: 'source-url', sourceId: 'src-deploy', url: 'https://deploy.northwind.example/releases/checkout-api/7.14.2', title: 'checkout-api 7.14.2 release record' },
  { type: 'source-url', sourceId: 'src-runbook', url: 'https://wiki.northwind.example/runbooks/checkout-rollback', title: 'Runbook: checkout canary rollback' },
] as AgSourcePart[];

const tool = (name: string, id: string, state: AgToolPart['state'], extra: Partial<AgToolPart> = {}): AgToolPart => ({
  type: `tool-${name}`,
  toolCallId: id,
  state,
  input: { service: 'checkout-api', region: 'eu-west-1' },
  ...extra,
});

/** One tool call per display state: queued, running, needs approval, succeeded, failed. */
export const TOOL_CALLS: AgToolPart[] = [
  tool('query_traces', 'tc-queued', 'input-streaming'),
  tool('fetch_error_budget', 'tc-running', 'input-available'),
  tool('rollback_canary', 'tc-approval', 'approval-requested', { approval: { id: 'ap-4821' } }),
  tool('compare_releases', 'tc-succeeded', 'output-available', {
    output: { regressedIn: '7.14.2', p99BeforeMs: 182, p99AfterMs: 941, affectedRequests: 12840 },
  }),
  tool('notify_statuspage', 'tc-failed', 'output-error', { errorText: 'Statuspage API returned 429 — retry after 30 s' }),
];

export const REASONING_TEXT =
  'Latency rose only in eu-west-1 and only for requests served by checkout-api 7.14.2. ' +
  'The previous release on the same nodes held p99 near 180 ms, so the regression tracks the deploy, not traffic.';

export const STEPS: AgStep[] = [
  { id: 'scope', label: 'Scope affected regions', state: 'succeeded', startedAt: 0, endedAt: 1400 },
  { id: 'compare', label: 'Compare releases 7.14.1 and 7.14.2', state: 'succeeded', startedAt: 1400, endedAt: 5200 },
  { id: 'rollback', label: 'Request canary rollback approval', state: 'running', startedAt: 5200 },
  { id: 'notify', label: 'Post customer status update', state: 'queued' },
];

export const MESSAGES: AgMessage[] = [
  {
    id: 'm-1',
    role: 'user',
    parts: [{ type: 'text', text: 'Checkout p99 jumped to 940 ms in EU-West after 09:05. What changed?' }],
    metadata: { createdAt: at(-25) },
  },
  {
    id: 'm-2',
    role: 'assistant',
    parts: [
      { type: 'reasoning', text: REASONING_TEXT, state: 'done' },
      tool('compare_releases', 'tc-thread-compare', 'output-available', {
        output: { regressedIn: '7.14.2', p99BeforeMs: 182, p99AfterMs: 941 },
      }),
      { type: 'text', text: 'checkout-api 7.14.2 rolled out to eu-west-1 at 09:04. Its connection-pool change halved the pool size, and p99 climbed within two minutes of the rollout.' },
      ...SOURCES,
    ],
    metadata: { createdAt: at(-24), model: 'northwind-assist-large', status: 'complete' },
  },
  {
    id: 'm-3',
    role: 'user',
    parts: [{ type: 'text', text: 'Roll the canary back and draft the on-call summary.' }],
    metadata: { createdAt: at(-20) },
  },
  {
    id: 'm-4',
    role: 'assistant',
    parts: [
      tool('rollback_canary', 'tc-thread-rollback', 'approval-requested', { approval: { id: 'ap-thread' } }),
      { type: 'text', text: 'The rollback needs approval from the payments on-call before it runs.' },
    ],
    metadata: { createdAt: at(-19), model: 'northwind-assist-large', status: 'complete' },
  },
];

export const STREAMING_SUMMARY =
  'Summary for #payments-oncall: checkout-api 7.14.2 reduced the database connection pool from 64 to 32. ' +
  'EU-West p99 rose from 182 ms to 941 ms between 09:05 and 09:12 UTC, affecting 12,840 requests. ' +
  'Canary rollback to 7.14.1 is awaiting approval';

export const INSPECTOR_FIELDS = [
  { label: 'Severity', value: 'SEV-2' },
  { label: 'Commander', value: 'Priya Raman' },
  { label: 'Opened', value: '09:12 UTC' },
  { label: 'Region', value: 'eu-west-1' },
  { label: 'Service', value: 'checkout-api' },
  { label: 'Customers notified', value: 'Pending' },
] as const;
