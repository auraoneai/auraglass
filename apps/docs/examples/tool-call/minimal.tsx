import { ToolCall } from 'aura-glass/ai';

export default function ToolCallMinimal() {
  return (
    <ToolCall
      part={{ type: 'tool-search', toolCallId: 't1', state: 'output-available', input: { q: 'deploy' }, output: '3 results' }}
    />
  );
}
