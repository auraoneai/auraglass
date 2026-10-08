// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Expected codemod output for the SURF/ai case. The `ai-chat` area transform
// rewrites the four chat imports to aura-glass/compat and inserts the TODO
// marker — it does not touch JSX structure (REQ-SURF-14). Compat adapters
// keep the 4.x names and warn once via warnDeprecated(id) (REQ-SURF-13).
import { GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator } from 'aura-glass/compat';
import type { ChatMessage } from 'aura-glass/compat';
// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer, see <doc>

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
