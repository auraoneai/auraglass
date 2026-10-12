import { Citation } from 'aura-glass/ai';

export default function CitationMinimal() {
  return (
    <p>
      Latency dropped after the cache change{' '}
      <Citation messageId="m1" index={1} source={{ type: 'source-url', sourceId: 's1', url: 'https://example.com/report', title: 'Q3 latency report' }} />.
    </p>
  );
}
