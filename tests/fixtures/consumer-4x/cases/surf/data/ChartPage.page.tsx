// @ts-nocheck — frozen 4.x consumer usage (codemod input).
// REQ-SURF-15: chart pages yield exactly one `removed` TODO each after
// `migrate 4to5` (the chart-adapter registry item preserves datasets).
import { GlassDataChart } from 'aura-glass';

export function ReportPage() {
  return (
    <GlassDataChart
      variant="line"
      datasets={[
        {
          label: 'Revenue',
          data: [
            { x: 'Jan', y: 3 },
            { x: 'Feb', y: 7 },
            { x: 'Mar', y: 5 },
          ],
        },
      ]}
      title="Monthly revenue"
    />
  );
}
