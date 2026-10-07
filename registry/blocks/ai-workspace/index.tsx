/* ai-workspace (REQ-SURF-172): the AI chat page — Thread + Composer + StatusBar
 * usage + ProviderErrorState, wired to a consumer route (the interim route
 * lives at ci/surf/ai-sdk/ai-workspace/app/api/chat/route.ts until
 * contract/ai-sdk-devdeps lands). The library makes no model call itself. */
'use client';
import * as React from 'react';
import { Composer, ProviderErrorState, Thread, UsageMeter, type AgMessage } from 'aura-glass/ai';
import { MESSAGES } from './fixtures';

export interface AiWorkspaceProps {
  initialMessages?: AgMessage[];
  /** Consumer submit handler — e.g. app/api/chat via Kiro Prism. */
  onSubmit?: (payload: { text: string; files: File[] }) => void;
  status?: 'idle' | 'streaming' | 'error';
}

export function AiWorkspace({ initialMessages = MESSAGES, onSubmit, status = 'idle' }: AiWorkspaceProps) {
  const [messages, setMessages] = React.useState<AgMessage[]>(initialMessages);
  const [error, setError] = React.useState(false);
  return (
    <div data-ag-part="ai-workspace" className="ag-ai-workspace" style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', blockSize: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <strong>Assistant</strong>
        <UsageMeter usage={{ inputTokens: 1820, contextWindow: 4096 }} />
      </header>
      {error ? (
        <ProviderErrorState kind="rate-limit" onRetry={() => setError(false)} />
      ) : null}
      <Thread messages={messages} streaming={status === 'streaming'} />
      <Composer
        onSubmit={({ text, files }: { text: string; files: File[] }) => {
          setMessages((m) => [
            ...m,
            { id: `u-${m.length + 1}`, role: 'user', parts: [{ type: 'text', text }] },
          ]);
          onSubmit?.({ text, files });
        }}
      />
    </div>
  );
}
