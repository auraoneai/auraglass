/* ai-workspace (REQ-SURF-172): the AI chat page — Thread + Composer + usage +
 * ProviderErrorState, driven by `useAuraChat` (registry item ai-sdk-adapter).
 * Live: `DefaultChatTransport({ api: '/api/chat' })` → app/api/chat/route.ts →
 * Kiro Prism. Stories and tests pass `createReplayTransport(...)` instead. The
 * library itself makes no model call. */
'use client';
import * as React from 'react';
import { DefaultChatTransport, type ChatTransport, type UIMessage } from 'ai';
import { Composer, ProviderErrorState, Thread, UsageMeter, type AgMessage, type AgUsage } from 'aura-glass/ai';
import { useAuraChat } from '@/registry/items/ai-sdk-adapter/useAuraChat';
import { MESSAGES } from './fixtures';

export interface AiWorkspaceProps {
  /** Seed conversation; defaults to the support-engineering fixture session. */
  initialMessages?: AgMessage[];
  /** Chat transport; defaults to `new DefaultChatTransport({ api: '/api/chat' })`. */
  transport?: ChatTransport<UIMessage>;
}

function latestUsage(messages: readonly AgMessage[]): AgUsage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]!;
    if (m.role === 'assistant' && m.metadata?.usage) return m.metadata.usage;
  }
  return undefined;
}

export function AiWorkspace({ initialMessages = MESSAGES, transport }: AiWorkspaceProps) {
  const [chatTransport] = React.useState<ChatTransport<UIMessage>>(
    () => transport ?? new DefaultChatTransport<UIMessage>({ api: '/api/chat' }),
  );
  const { threadProps, composerProps, status } = useAuraChat({
    transport: chatTransport,
    // AgMessage is the structural mirror of UIMessage plus the SDK-6 approval
    // tool states; useChat only stores and returns the seed messages.
    messages: initialMessages as unknown as UIMessage[],
  });
  const usage = latestUsage(threadProps.messages);
  return (
    <div data-ag-part="ai-workspace" className="ag-ai-workspace" style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto', blockSize: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <strong>Assistant</strong>
        {usage ? <UsageMeter usage={usage} /> : null}
      </header>
      {status === 'error' ? <ProviderErrorState kind="unknown" /> : <div />}
      <Thread messages={threadProps.messages} label="Assistant" />
      <Composer
        status={status}
        onSubmit={composerProps.onSubmit}
        {...(composerProps.onStop ? { onStop: composerProps.onStop } : {})}
      />
    </div>
  );
}
