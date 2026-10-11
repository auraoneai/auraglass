/**
 * @jest-environment node
 */
/* ai-workspace fixtures + replay transport (REQ-SURF-172, AC-FIN-88).
 * The fixture is a support-engineering agent session with source-url
 * citations and an approval-gated tool call followed by its approval
 * response; the replay transport streams recorded replies as real AI SDK
 * UIMessageChunks that `readUIMessageStream` (the useChat reducer) turns back
 * into the recorded message. No network. */
import { describe, expect, it } from '@jest/globals';
import { readUIMessageStream, type UIMessage } from 'ai';
import {
  APPROVAL_RESPONDED,
  AWAITING_APPROVAL,
  COMPLETED,
  REPLAY_REPLY,
  SESSION_STEPS,
} from '../../../registry/blocks/ai-workspace/fixtures';
import { createReplayTransport, messageToChunks } from '../../../registry/blocks/ai-workspace/replay-transport';

type AnyPart = { type: string; [k: string]: unknown };
const toolPart = (messages: typeof AWAITING_APPROVAL, type: string) =>
  messages.flatMap((m) => m.parts as readonly AnyPart[]).find((p) => p.type === type) as AnyPart | undefined;

describe('ai-workspace fixtures: support-engineering session', () => {
  it('is a user request answered by an assistant turn that cites source-url parts', () => {
    expect(AWAITING_APPROVAL.map((m) => m.role)).toEqual(['user', 'assistant']);
    const sources = (AWAITING_APPROVAL[1]!.parts as readonly AnyPart[]).filter((p) => p.type === 'source-url');
    expect(sources.length).toBeGreaterThanOrEqual(2);
    for (const s of sources) expect(String(s.url)).toMatch(/^https:\/\//);
  });

  it('orders the approval flow: approval-requested → approval-responded (approved) → output-available', () => {
    expect(SESSION_STEPS).toEqual([AWAITING_APPROVAL, APPROVAL_RESPONDED, COMPLETED]);
    const requested = toolPart(AWAITING_APPROVAL, 'tool-rollback_deploy')!;
    const responded = toolPart(APPROVAL_RESPONDED, 'tool-rollback_deploy')!;
    const done = toolPart(COMPLETED, 'tool-rollback_deploy')!;
    expect(requested.state).toBe('approval-requested');
    expect(responded.state).toBe('approval-responded');
    expect(done.state).toBe('output-available');
    expect(responded.toolCallId).toBe(requested.toolCallId);
    expect((responded.approval as { id: string }).id).toBe((requested.approval as { id: string }).id);
    expect((responded.approval as { approved: boolean }).approved).toBe(true);
  });
});

describe('ai-workspace replay transport', () => {
  async function replay(transport: ReturnType<typeof createReplayTransport>): Promise<UIMessage> {
    const stream = await transport.sendMessages({
      trigger: 'submit-message', chatId: 'c', messageId: undefined, messages: [], abortSignal: undefined,
    });
    let last: UIMessage | undefined;
    for await (const m of readUIMessageStream({ stream })) last = m;
    expect(last).toBeDefined();
    return last!;
  }

  it('replays a recorded reply into the same UIMessage parts via the SDK reducer', async () => {
    const msg = await replay(createReplayTransport([REPLAY_REPLY]));
    expect(msg.id).toBe(REPLAY_REPLY.id);
    expect(msg.parts.map((p) => p.type)).toEqual(['step-start', 'text', 'source-url']);
    expect(msg.parts[1]).toMatchObject({ type: 'text', text: (REPLAY_REPLY.parts[1] as { text: string }).text });
    expect(msg.parts[2]).toMatchObject({ type: 'source-url', sourceId: 'src-deploy', url: 'https://deploys.example.com/checkout-api/r-4813' });
  });

  it('replays tool calls; SDK-5 has no approval chunk so approval parts arrive as input-available', async () => {
    const msg = await replay(createReplayTransport([COMPLETED[1]!, AWAITING_APPROVAL[1]!]));
    const metrics = msg.parts.find((p) => p.type === 'tool-query_metrics') as AnyPart;
    expect(metrics).toMatchObject({ state: 'output-available', toolCallId: 'call-metrics' });
    const rollbackDone = msg.parts.find((p) => p.type === 'tool-rollback_deploy') as AnyPart;
    expect(rollbackDone.state).toBe('output-available');
    expect(rollbackDone.output).toEqual({ revision: 'r-4812', status: 'healthy', p95Ms: 318 });
  });

  it('advances through replies per send, then repeats the last', async () => {
    const t = createReplayTransport([COMPLETED[1]!, AWAITING_APPROVAL[1]!]);
    await replay(t);
    const second = await replay(t);
    expect((second.parts.find((p) => p.type === 'tool-rollback_deploy') as AnyPart).state).toBe('input-available');
    const third = await replay(t);
    expect((third.parts.find((p) => p.type === 'tool-rollback_deploy') as AnyPart).state).toBe('input-available');
  });

  it('balances step chunks and frames the message with start/finish', () => {
    const types = messageToChunks(COMPLETED[1]!).map((c) => c.type);
    expect(types[0]).toBe('start');
    expect(types[types.length - 1]).toBe('finish');
    expect(types.filter((t) => t === 'start-step').length).toBe(types.filter((t) => t === 'finish-step').length);
  });

  it('rejects an empty script', () => {
    expect(() => createReplayTransport([])).toThrow(/at least one reply/);
  });
});
