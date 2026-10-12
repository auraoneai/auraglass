import { Message } from 'aura-glass/ai';

export default function MessageMinimal() {
  return (
    <Message
      author="Assistant"
      message={{ id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'The deploy finished in 3 minutes.' }] }}
    />
  );
}
