/* src/ai/__fixtures__/ui-messages.source.ts — authored fixture corpus
 * (SURF-282, REQ-SURF-106). Never hand-edit the generated
 * ui-messages.ai-sdk.json — regenerate via scripts/surf/gen-ai-fixtures.mjs.
 *
 * The corpus is split by what the pinned AI SDK can express:
 * - SDK_MESSAGES: envelopes the pinned SDK (SDK_PIN) itself produces.
 *   gen-ai-fixtures.mjs typechecks `SDK_MESSAGES satisfies
 *   UIMessage<AgMessageMetadata>[]` against the installed `ai` types and
 *   fails (also under --check) when one stops satisfying UIMessage. The
 *   `ai` import cannot live here: purity bans it in src/.
 * - AG_EXTENSION_MESSAGES: AgMessage-only envelopes SDK v5 cannot express —
 *   the 'tool' role, approval-requested / approval-responded / output-denied
 *   tool states (SDK v6, OD-16) and the deliberate unknown part. The generator
 *   rejects an entry here that has no such extension, so SDK-native messages
 *   cannot bypass the UIMessage check.
 * MESSAGES is both sets ordered by id (the order the fixture has always had).
 *
 * Coverage: every part type + all 7 tool states + approval both branches +
 * dynamic-tool + source-url + source-document + file (image + pdf) +
 * step-start + data-* + one deliberate unknown part (mystery-part,
 * __expectWarning) + streaming/done states.
 */
import type { AgMessage, AgPart } from '../types';

/** Exact `ai` devDependency the fixture is typechecked against (OD-16 decides a v6 move). */
export const SDK_PIN = 'ai@5.0.29' as const;
export const GENERATED = '2026-10-07' as const;

const toolQuery = { query: 'key rotation' };

export const SDK_MESSAGES = [
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
  {
    id: 'msg-04', role: 'assistant',
    parts: [{ type: 'tool-runbook_lookup', toolCallId: 'tc-input-streaming', state: 'input-streaming', input: toolQuery }],
  },
  {
    id: 'msg-05', role: 'assistant',
    parts: [{ type: 'tool-runbook_lookup', toolCallId: 'tc-input-available', state: 'input-available', input: toolQuery }],
  },
  {
    id: 'msg-08', role: 'assistant',
    parts: [{
      type: 'tool-runbook_lookup', toolCallId: 'tc-output-available', state: 'output-available', input: toolQuery,
      output: { rows: [{ step: 'revoke-then-issue' }] },
    }],
  },
  {
    id: 'msg-09', role: 'assistant',
    parts: [{
      type: 'tool-runbook_lookup', toolCallId: 'tc-output-error', state: 'output-error', input: toolQuery,
      errorText: 'runbook service timeout',
    }],
  },
  {
    id: 'msg-11', role: 'assistant',
    parts: [{
      type: 'dynamic-tool', toolName: 'ticket.create', toolCallId: 'tc-dyn', state: 'output-available',
      input: { title: 'Rotate ingestion keys' }, output: { id: 'SUP-1024' },
    }],
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
  { id: 'msg-18', role: 'assistant', parts: [{ type: 'text', text: 'Partial answer…' }], metadata: { status: 'streaming' } },
  {
    id: 'msg-21', role: 'assistant',
    parts: [{ type: 'text', text: '', state: 'streaming' }],
    metadata: { status: 'streaming', usage: { inputTokens: 1204, outputTokens: 88 } },
  },
] satisfies AgMessage[];

export const AG_EXTENSION_MESSAGES = [
  {
    id: 'msg-06', role: 'assistant',
    parts: [{
      type: 'tool-runbook_lookup', toolCallId: 'tc-approval-requested', state: 'approval-requested', input: toolQuery,
      approval: { id: 'ap-approval-requested' },
    }],
  },
  {
    id: 'msg-07', role: 'assistant',
    parts: [{
      type: 'tool-runbook_lookup', toolCallId: 'tc-approval-responded', state: 'approval-responded', input: toolQuery,
      approval: { id: 'ap-approval-responded', approved: true },
    }],
  },
  {
    id: 'msg-10', role: 'assistant',
    parts: [{
      type: 'tool-runbook_lookup', toolCallId: 'tc-output-denied', state: 'output-denied', input: toolQuery,
      approval: { id: 'ap-output-denied', approved: false, reason: 'operator veto' },
    }],
  },
  { id: 'msg-17', role: 'tool', parts: [{ type: 'text', text: 'tool envelope' }], metadata: { status: 'complete' } },
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
] satisfies AgMessage[];

export const MESSAGES: AgMessage[] = [...SDK_MESSAGES, ...AG_EXTENSION_MESSAGES].sort((a, b) =>
  a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
);
