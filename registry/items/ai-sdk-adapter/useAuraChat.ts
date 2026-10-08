/* ai-sdk-adapter (SURF-390, REQ-SURF-106/170): wraps @ai-sdk/react `useChat`
 * and returns ready-made props for ./ai — `{ threadProps: { messages },
 * composerProps: { onSubmit, onStop }, status }`. Requires the consumer's
 * `ai` + `@ai-sdk/react` dependencies (declared in registry-item.json). */
'use client';
import { useChat, type ChatTransport } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import type { AgMessage } from 'aura-glass/ai';

export interface UseAuraChatOptions {
  /** Transport — e.g. `new DefaultChatTransport({ api: '/api/chat' })`. */
  transport?: ChatTransport<UIMessage>;
  messages?: UIMessage[];
}

export interface UseAuraChatResult {
  threadProps: { messages: AgMessage[] };
  composerProps: {
    onSubmit: (payload: { text: string; files: File[] }) => void;
    onStop?: (() => void) | undefined;
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
