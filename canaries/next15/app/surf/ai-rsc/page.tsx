// SURF-361 — Next 16 + React 19.3 server page: the REQ-SURF-07 server modules
// render without 'use client' — Message compound, MessageParts (text/source/
// file/step-start), AgentSteps, UsageMeter with explicit locale+timeZone.
import { Message, AgentSteps, UsageMeter } from 'aura-glass/ai';
import type { AgMessage } from 'aura-glass/ai';

const msg: AgMessage = {
  id: 'srv-1', role: 'assistant',
  parts: [
    { type: 'text', text: 'Three sources back this claim.' },
    { type: 'source-url', sourceId: 's1', url: 'https://docs.internal/a', title: 'A' },
    { type: 'file', url: 'data:text/plain,x', mediaType: 'text/plain', filename: 'log.txt' },
    { type: 'step-start' },
    { type: 'text', text: 'Done.' },
  ],
};

export default function AiRscCanaryPage() {
  return (
    <main>
      <Message message={msg} locale="en-US" timeZone="UTC">
        <Message.Avatar>AI</Message.Avatar>
        <Message.Content />
        <Message.Footer>footer</Message.Footer>
      </Message>
      <AgentSteps steps={[{ id: '1', label: 'compile', state: 'succeeded' }]} />
      <UsageMeter usage={{ inputTokens: 100, outputTokens: 40, contextWindow: 4096 }} locale="en-US" />
    </main>
  );
}
