// @ts-nocheck — frozen 4.x consumer usage (codemod input).
// REQ-SURF-15: chart pages yield exactly one `removed` TODO each after
// `migrate 4to5` (the chart-adapter registry item preserves datasets/labels).
import { GlassDataChart } from 'aura-glass';

export function ReportPage() {
  return (
    <GlassDataChart
      type="line"
      labels={['Jan', 'Feb', 'Mar']}
      datasets={[{ label: 'Revenue', data: [3, 7, 5] }]}
      title="Monthly revenue"
    />
  );
}
