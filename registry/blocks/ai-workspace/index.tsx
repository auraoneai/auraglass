/* ai-workspace (REQ-SURF-172): the AI chat page — Thread + Composer + usage +
 * ProviderErrorState, driven by `useAuraChat` (registry item ai-sdk-adapter).
 * Live: `DefaultChatTransport({ api: '/api/chat' })` → app/api/chat/route.ts →
 * Kiro Prism. Stories and tests pass `createReplayTransport(...)` instead. The
 * library itself makes no model call. */
'use client';
import * as React from 'react';
import { DefaultChatTransport, type ChatTransport } from 'ai';
import { Composer, ProviderErrorState, Thread, UsageMeter, type AgMessage, type AgPart, type AgUsage } from 'aura-glass/ai';
import { useAuraChat, type AuraUIMessage } from '@/registry/items/ai-sdk-adapter/useAuraChat';
import { MESSAGES } from './fixtures';

export interface AiWorkspaceProps {
  /** Seed conversation; defaults to the support-engineering fixture session. */
  initialMessages?: AgMessage[];
  /** Chat transport; defaults to `new DefaultChatTransport({ api: '/api/chat' })`. */
  transport?: ChatTransport<AuraUIMessage>;
}

function latestUsage(messages: readonly AgMessage[]): AgUsage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]!;
    if (m.role === 'assistant' && m.metadata?.usage) return m.metadata.usage;
  }
  return undefined;
}

/** Normalize the library's wider envelope to the installed SDK contract.
 * v5 has no tool-role messages or approval states; preserve those decisions
 * as tool outputs and keep pending approvals in their input-available state. */
function sdkPart(part: AgPart): AuraUIMessage['parts'][number] {
  if (!('toolCallId' in part)) return part;
  const base = part.type === 'dynamic-tool'
    ? { type: part.type, toolName: part.toolName, toolCallId: part.toolCallId } as const
    : { type: part.type, toolCallId: part.toolCallId } as const;
  switch (part.state) {
    case 'input-streaming':
      return { ...base, state: 'input-streaming', input: part.input };
    case 'input-available':
    case 'approval-requested':
      return { ...base, state: 'input-available', input: part.input };
    case 'approval-responded':
      return { ...base, state: 'output-available', input: part.input,
        output: { approved: part.approval?.approved ?? false,
          approvalId: part.approval?.id ?? part.toolCallId,
          ...(part.approval?.reason !== undefined ? { reason: part.approval.reason } : {}) } };
    case 'output-available':
      return { ...base, state: 'output-available', input: part.input, output: part.output };
    case 'output-error':
    case 'output-denied':
      return { ...base, state: 'output-error', input: part.input,
        errorText: part.errorText ?? (part.state === 'output-denied' ? 'denied' : 'Tool failed') };
  }
}

function sdkMessage(message: AgMessage): AuraUIMessage {
  return { id: message.id, role: message.role === 'tool' ? 'assistant' : message.role,
    parts: message.parts.map(sdkPart),
    ...(message.metadata !== undefined ? { metadata: message.metadata } : {}) };
}

export function AiWorkspace({ initialMessages = MESSAGES, transport }: AiWorkspaceProps) {
  const [chatTransport] = React.useState<ChatTransport<AuraUIMessage>>(
    () => transport ?? new DefaultChatTransport<AuraUIMessage>({ api: '/api/chat' }),
  );
  const seedMessages = React.useMemo(() => initialMessages.map(sdkMessage), [initialMessages]);
  const { threadProps, composerProps, status } = useAuraChat({
    transport: chatTransport,
    messages: seedMessages,
  });
  // Retain the library's richer fixture states while their normalized SDK
  // parts are unchanged. A new output/decision from the SDK takes precedence.
  const messages = threadProps.messages.map((message) => {
    const initial = initialMessages.find((seed) => seed.id === message.id);
    const normalized = seedMessages.find((seed) => seed.id === message.id);
    if (!initial || !normalized) return message;
    return { ...message, parts: message.parts.map((part) => {
      if (!('toolCallId' in part)) return part;
      const index = initial.parts.findIndex((seed) => 'toolCallId' in seed && seed.toolCallId === part.toolCallId);
      const sdk = normalized.parts[index];
      const original = initial.parts[index];
      if (!sdk || !original || !('toolCallId' in sdk)) return part;
      return part.state === sdk.state && part.input === sdk.input &&
        part.output === ('output' in sdk ? sdk.output : undefined) &&
        part.errorText === ('errorText' in sdk ? sdk.errorText : undefined) ? original : part;
    }) };
  });
  const usage = latestUsage(messages);
  return (
    <div data-ag-part="ai-workspace" className="ag-ai-workspace" style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto', blockSize: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <strong>Assistant</strong>
        {usage ? <UsageMeter usage={usage} /> : null}
      </header>
      {status === 'error' ? <ProviderErrorState kind="unknown" /> : <div />}
      <Thread messages={messages} label="Assistant" />
      <Composer
        status={status}
        onSubmit={composerProps.onSubmit}
        {...(composerProps.onStop ? { onStop: composerProps.onStop } : {})}
      />
    </div>
  );
}
