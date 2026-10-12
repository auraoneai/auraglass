import { UsageMeter } from 'aura-glass/ai';

export default function UsageMeterMinimal() {
  return <UsageMeter usage={{ inputTokens: 1200, outputTokens: 400, contextWindow: 128000 }} />;
}
