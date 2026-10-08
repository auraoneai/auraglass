'use client';
// SURF-361 — Next 16 + React 19.3 client page: imports every ./ai export so
// the QUAL harness can assert client-manifest membership and hydration-clean
// rendering in-browser.
import {
  Thread, Message, StreamingText, Composer, ToolCall, SourceList, Citation,
  Reasoning, AgentSteps, UsageMeter, ProviderErrorState,
} from 'aura-glass/ai';
import type { AgMessage } from 'aura-glass/ai';

const messages: AgMessage[] = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Summarise the deploy.' }] },
  { id: 'a1', role: 'assistant', parts: [{ type: 'text', text: 'Deploy is healthy.' }] },
];

export default function AiClientCanaryPage() {
  return (
    <main>
      <Thread messages={messages} />
      <Composer />
      <StreamingText text="partial" streaming />
      <ToolCall part={{ type: 'tool-x', toolCallId: 't', state: 'output-available', input: {}, output: 'ok' } as never} />
      <SourceList messageId="a1" sources={[{ type: 'source-url', sourceId: 's', url: 'https://x', title: 'x' }] as never} />
      <Citation messageId="a1" source={{ type: 'source-url', sourceId: 's', url: 'https://x', title: 'x' } as never} index={1} />
      <Reasoning text="thought" state="done" durationMs={1000} />
      <AgentSteps steps={[{ id: 's', label: 'step', state: 'succeeded' }]} />
      <UsageMeter usage={{ inputTokens: 10, contextWindow: 100 }} />
      <ProviderErrorState kind="network" />
    </main>
  );
}
