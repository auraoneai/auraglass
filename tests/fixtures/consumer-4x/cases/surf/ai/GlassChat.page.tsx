// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — SURF/ai case (do not "fix"; it is the test).
import { GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator } from 'aura-glass';
import type { ChatMessage } from 'aura-glass';

const messages: ChatMessage[] = [
  { id: 'm1', type: 'text', sender: { id: 'u2' }, content: 'hi', timestamp: 1_700_000_000_000 } as ChatMessage,
];

export function SupportPanel() {
  return (
    <>
      <GlassChat
        messages={messages}
        currentUserId="u1"
        onSendMessage={(content: string, attachments?: File[]) => console.log(content, attachments)}
      />
      <GlassMessageList messages={messages} />
      <GlassChatInput placeholder="Ask support" />
      <GlassTypingIndicator />
    </>
  );
}
