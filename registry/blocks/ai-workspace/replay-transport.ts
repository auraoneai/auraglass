/* ai-workspace replay transport (REQ-SURF-172): a ChatTransport that streams
 * pre-recorded AgMessage replies as AI SDK UIMessageChunks, so stories and
 * tests drive the real `useAuraChat` → `useChat` path without a server or a
 * model call. Each `sendMessages` call replays the next reply in order and
 * then repeats the last one.
 *
 * AI SDK 5 has no approval chunk, so a recorded `approval-requested` or
 * `approval-responded` tool part replays as `tool-input-available` (the call
 * is shown as running); seed `initialMessages` with the fixture snapshot to
 * show the approval state itself. */
import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai';
import type { AgMessage } from 'aura-glass/ai';

export interface ReplayTransportOptions {
  /** Chunk delay in ms; 0 (default) emits synchronously for stable captures. */
  delayMs?: number;
}

export function messageToChunks(message: AgMessage): UIMessageChunk[] {
  const chunks: UIMessageChunk[] = [{ type: 'start', messageId: message.id }];
  let inStep = false;
  message.parts.forEach((part, i) => {
    const id = `${message.id}-${i}`;
    switch (part.type) {
      case 'step-start':
        if (inStep) chunks.push({ type: 'finish-step' });
        chunks.push({ type: 'start-step' });
        inStep = true;
        return;
      case 'text':
        chunks.push({ type: 'text-start', id }, { type: 'text-delta', id, delta: part.text }, { type: 'text-end', id });
        return;
      case 'reasoning':
        chunks.push(
          { type: 'reasoning-start', id },
          { type: 'reasoning-delta', id, delta: part.text },
          { type: 'reasoning-end', id },
        );
        return;
      case 'source-url':
        chunks.push({
          type: 'source-url',
          sourceId: part.sourceId,
          url: part.url,
          ...(part.title !== undefined ? { title: part.title } : {}),
        });
        return;
      case 'source-document':
        chunks.push({
          type: 'source-document',
          sourceId: part.sourceId,
          mediaType: part.mediaType,
          title: part.title,
          ...(part.filename !== undefined ? { filename: part.filename } : {}),
        });
        return;
      case 'file':
        chunks.push({ type: 'file', url: part.url, mediaType: part.mediaType });
        return;
      default:
        break;
    }
    if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
      const tool = part as { type: string; toolCallId: string; state: string; input?: unknown; output?: unknown; errorText?: string; toolName?: string };
      const dynamic = tool.type === 'dynamic-tool';
      const toolName = dynamic ? (tool.toolName ?? 'tool') : tool.type.slice('tool-'.length);
      chunks.push({ type: 'tool-input-available', toolCallId: tool.toolCallId, toolName, input: tool.input ?? {}, ...(dynamic ? { dynamic } : {}) });
      if (tool.state === 'output-available') {
        chunks.push({ type: 'tool-output-available', toolCallId: tool.toolCallId, output: tool.output, ...(dynamic ? { dynamic } : {}) });
      } else if (tool.state === 'output-error' || tool.state === 'output-denied') {
        chunks.push({
          type: 'tool-output-error',
          toolCallId: tool.toolCallId,
          errorText: tool.errorText ?? (tool.state === 'output-denied' ? 'denied' : 'error'),
          ...(dynamic ? { dynamic } : {}),
        });
      }
    }
  });
  if (inStep) chunks.push({ type: 'finish-step' });
  chunks.push({ type: 'finish' });
  return chunks;
}

export function createReplayTransport(
  replies: readonly AgMessage[],
  { delayMs = 0 }: ReplayTransportOptions = {},
): ChatTransport<UIMessage> {
  if (replies.length === 0) throw new Error('createReplayTransport: at least one reply is required');
  let turn = 0;
  return {
    async sendMessages({ abortSignal }) {
      const reply = replies[Math.min(turn, replies.length - 1)]!;
      turn += 1;
      const chunks = messageToChunks(reply);
      let i = 0;
      return new ReadableStream<UIMessageChunk>({
        async pull(controller) {
          if (abortSignal?.aborted) {
            controller.enqueue({ type: 'abort' });
            controller.close();
            return;
          }
          if (i >= chunks.length) {
            controller.close();
            return;
          }
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
          controller.enqueue(chunks[i]!);
          i += 1;
        },
      });
    },
    async reconnectToStream() {
      return null;
    },
  };
}
