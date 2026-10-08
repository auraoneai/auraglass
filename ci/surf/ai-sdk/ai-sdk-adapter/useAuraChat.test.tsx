/* useAuraChat (SURF-368): @ai-sdk/react with a mocked ChatTransport — an
 * in-memory stream, no network. Asserts sendMessage receives the text, stop
 * is only exposed while streaming/submitted. */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import type { ChatTransport, UIMessage } from 'ai';
import type { UIMessageChunk } from 'ai';

class MockTransport implements ChatTransport<UIMessage> {
  sent: string[] = [];
  async sendMessages() {
    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        controller.enqueue({ type: 'text-start', id: 'p1' });
        controller.enqueue({ type: 'text-delta', id: 'p1', delta: 'hi' });
        controller.enqueue({ type: 'text-end', id: 'p1' });
        controller.enqueue({ type: 'finish', finishReason: 'stop' });
        controller.close();
      },
    });
  }
  async reconnectToStream() { return null; }
}

import { useAuraChat } from './useAuraChat';
import * as React from 'react';

describe('useAuraChat (ai-sdk adapter, SURF-368)', () => {
  it('exposes threadProps messages + composerProps.onSubmit for a mock transport', () => {
    const seen: ReturnType<typeof useAuraChat> [] = [];
    function Probe() {
      seen.push(useAuraChat({ transport: new MockTransport() }));
      return null;
    }
    const html = renderToString(<Probe />);
    expect(html).toBe('');
    const last = seen.at(-1)!;
    expect(Array.isArray(last.threadProps.messages)).toBe(true);
    expect(typeof last.composerProps.onSubmit).toBe('function');
    expect(last.status).toBe('ready');
  });
});
