import { Thread } from 'aura-glass/ai';

export default function ThreadMinimal() {
  return (
    <Thread
      messages={[
        { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'How long did the deploy take?' }] },
        { id: 'm2', role: 'assistant', parts: [{ type: 'text', text: 'About 3 minutes.' }] },
      ]}
    />
  );
}
