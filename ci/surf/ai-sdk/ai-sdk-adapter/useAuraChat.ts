/* ai-sdk-adapter (SURF-367, REQ-SURF-106/170): wraps @ai-sdk/react `useChat`
 * and returns ready-made props for ./ai — `{ threadProps: { messages },
 * composerProps: { onSubmit, stop }, status }`. Interim home: moves to
 * registry/items/ai-sdk-adapter once contract/ai-sdk-devdeps lands. */
'use client';
import { useChat, type ChatTransport } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import type { AgMessage } from '../../../src/ai/types';

export interface UseAuraChatOptions {
  /** Transport — e.g. `new DefaultChatTransport({ api: '/api/chat' })`. */
  transport?: ChatTransport<UIMessage>;
  messages?: UIMessage[];
}

export interface UseAuraChatResult {
  threadProps: { messages: AgMessage[] };
  composerProps: {
    onSubmit: (payload: { text: string; files: File[] }) => void;
    onStop?: () => void;
  };
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export function useAuraChat(options: UseAuraChatOptions = {}): UseAuraChatResult {
  const chat = useChat<UIMessage>({
    ...(options.transport ? { transport: options.transport } : {}),
    ...(options.messages ? { messages: options.messages } : {}),
  });
  const streaming = chat.status === 'streaming' || chat.status === 'submitted';
  return {
    threadProps: { messages: chat.messages as AgMessage[] },
    composerProps: {
      onSubmit: ({ text }) => {
        void chat.sendMessage({ text });
      },
      ...(streaming ? { onStop: () => { void chat.stop(); } } : {}),
    },
    status: chat.status,
  };
}
