import { AgentSteps } from 'aura-glass/ai';

export default function AgentStepsMinimal() {
  return (
    <AgentSteps
      steps={[
        { id: '1', label: 'Parse request', state: 'succeeded' },
        { id: '2', label: 'Query metrics', state: 'running' },
        { id: '3', label: 'Compose reply', state: 'queued' },
      ]}
    />
  );
}
