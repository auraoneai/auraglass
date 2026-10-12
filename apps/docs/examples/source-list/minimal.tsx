import { SourceList } from 'aura-glass/ai';

export default function SourceListMinimal() {
  return (
    <SourceList
      messageId="m1"
      sources={[
        { type: 'source-url', sourceId: 's1', url: 'https://example.com/report', title: 'Q3 latency report' },
        { type: 'source-url', sourceId: 's2', url: 'https://example.com/runbook', title: 'Cache runbook' },
      ]}
    />
  );
}
