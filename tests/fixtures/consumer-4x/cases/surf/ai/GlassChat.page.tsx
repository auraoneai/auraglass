// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — SURF/ai case (do not "fix"; it is the test).
// Typed against the published aura-glass@4.1.0 API: `ChatMessage` is not a
// root export there, so a 4.x consumer derives it from the component props.
import type { ComponentProps } from 'react';
import { GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator } from 'aura-glass';

type ChatMessage = ComponentProps<typeof GlassChat>['messages'][number];

const messages: ChatMessage[] = [
  {
    id: 'm1',
    type: 'text',
    sender: { id: 'u2', name: 'Support' },
    content: 'hi',
    timestamp: new Date(1_700_000_000_000),
  },
];

export function SupportPanel() {
  return (
    <>
      <GlassChat
        messages={messages}
        currentUser={{ id: 'u1', name: 'Customer' }}
        onSendMessage={(content: string, attachments?: File[]) => console.log(content, attachments)}
      />
      <GlassMessageList messages={messages} currentUserId="u1" />
      <GlassChatInput placeholder="Ask support" />
      <GlassTypingIndicator />
    </>
  );
}
