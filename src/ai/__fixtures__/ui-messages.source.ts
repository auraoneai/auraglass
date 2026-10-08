/* src/ai/__fixtures__/ui-messages.source.ts — authored fixture corpus
 * (SURF-282). Structural mirror of AI SDK `UIMessage`: pre-devdeps the
 * `satisfies` target is the shipped AgMessage model (purity bans an `ai`
 * import in src/); once contract/ai-sdk-devdeps lands the satisfies swaps
 * to UIMessage and ci/surf/ai-sdk/ai-sdk-compat.test-d.ts already proves
 * assignability both ways. Never hand-edit the generated
 * ui-messages.ai-sdk.json — regenerate via scripts/surf/gen-ai-fixtures.mjs.
 *
 * Coverage: every part type + all 7 tool states + approval both branches +
 * dynamic-tool + source-url + source-document + file (image + pdf) +
 * step-start + data-* + one deliberate unknown part (mystery-part,
 * __expectWarning) + streaming/done states.
 */
import type { AgMessage, AgPart, AgToolPart } from '../types';

export const SDK_PIN = 'ai@5.0.29' as const;
export const GENERATED = '2026-10-07' as const;

const toolStates = [
  'input-streaming',
  'input-available',
  'approval-requested',
  'approval-responded',
  'output-available',
  'output-error',
  'output-denied',
] as const;

export const MESSAGES: AgMessage[] = [
  { id: 'msg-01', role: 'user', parts: [{ type: 'text', text: 'How do I rotate the ingestion keys?' }] },
  {
    id: 'msg-02', role: 'assistant',
    parts: [
      { type: 'reasoning', text: 'Need current key policy.', state: 'done' },
      { type: 'text', text: 'Rotating a key invalidates the previous secret after overlap.', state: 'done' },
    ],
    metadata: { createdAt: '2026-05-12T09:14:03Z', model: 'kiro-prism-70', status: 'complete' },
  },
  { id: 'msg-03', role: 'assistant', parts: [{ type: 'reasoning', text: 'Streaming thought', state: 'streaming' }] },
  ...toolStates.map((state, i) => ({
    id: `msg-${String(4 + i).padStart(2, '0')}` as string,
    role: 'assistant' as const,
    parts: [{
      type: 'tool-runbook_lookup' as const,
      toolCallId: `tc-${state}`,
      state,
      input: { query: 'key rotation' },
      ...(state === 'output-available' ? { output: { rows: [{ step: 'revoke-then-issue' }] } } : {}),
      ...(state === 'output-error' ? { errorText: 'runbook service timeout' } : {}),
      ...(state === 'approval-requested' ? { approval: { id: `ap-${state}` } } : {}),
      ...(state === 'approval-responded' ? { approval: { id: `ap-${state}`, approved: true } } : {}),
      ...(state === 'output-denied' ? { approval: { id: `ap-${state}`, approved: false, reason: 'operator veto' } } : {}),
    }],
  })),
  {
    id: 'msg-11', role: 'assistant',
    parts: [{ type: 'dynamic-tool', toolName: 'ticket.create', toolCallId: 'tc-dyn', state: 'output-available', output: { id: 'SUP-1024' } }],
  },
  {
    id: 'msg-12', role: 'assistant',
    parts: [
      { type: 'text', text: 'See the key policy doc [1] and the runbook [2].' },
      { type: 'source-url', sourceId: 's-1', url: 'https://docs.internal/security/keys', title: 'Key policy' },
      { type: 'source-url', sourceId: 's-2', url: 'https://runbooks.internal/rotation', title: 'Rotation runbook' },
    ],
  },
  {
    id: 'msg-13', role: 'assistant',
    parts: [{ type: 'source-document', sourceId: 's-3', mediaType: 'application/pdf', title: 'Compliance annex', filename: 'annex.pdf' }],
  },
  {
    id: 'msg-14', role: 'user',
    parts: [
      { type: 'file', mediaType: 'image/png', url: 'blob:att-1', filename: 'dashboard.png' },
      { type: 'file', mediaType: 'application/pdf', url: 'blob:att-2', filename: 'report.pdf' },
      { type: 'text', text: 'This shows the spike.' },
    ],
  },
  { id: 'msg-15', role: 'assistant', parts: [{ type: 'step-start' }, { type: 'text', text: 'Second step of a two-step answer.' }] },
  { id: 'msg-16', role: 'assistant', parts: [{ type: 'data-progress', id: 'p1', data: { pct: 42 } }] },
  { id: 'msg-17', role: 'tool', parts: [{ type: 'text', text: 'tool envelope' }], metadata: { status: 'complete' } },
  { id: 'msg-18', role: 'assistant', parts: [{ type: 'text', text: 'Partial answer\u2026' }], metadata: { status: 'streaming' } },
  {
    id: 'msg-19', role: 'assistant',
    parts: [
      { type: 'text', text: 'Follow the runbook exactly.' },
      { type: 'mystery-part', payload: { note: 'unknown future part — expect exactly one dev warning' } } as unknown as AgPart, // deliberate unknown-type fixture (SURF-282)
    ],
    metadata: { status: 'complete' },
  },
  {
    id: 'msg-20', role: 'assistant',
    parts: [
      {
        type: 'tool-bulk_revoke', toolCallId: 'tc-denied', state: 'output-denied',
        input: { count: 4 },
        approval: { id: 'ap-denied', approved: false, reason: 'policy requires CSO sign-off' },
      },
    ],
  },
  {
    id: 'msg-21', role: 'assistant',
    parts: [{ type: 'text', text: '', state: 'streaming' }],
    metadata: { status: 'streaming', usage: { inputTokens: 1204, outputTokens: 88 } },
  },
];
