// TODO(aura-glass 5): removed in 5.0 (docs/auraglass-5/migration/chart-adapter.md), see docs/auraglass-5/migration/chart-adapter.md
// TODO(aura-glass 5): removed in 5.0 (npx aura-glass-cli add chart-adapter), see docs/auraglass-5/migration/chart-adapter.md
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassChart, GlassDataChart, GlassChartContainer, KpiChart } from 'aura-glass';

export const Revenue = ({ data }) => (
  <GlassChartContainer>
    <GlassChart data={data} />
    <GlassDataChart data={data} />
    <KpiChart data={data} />
  </GlassChartContainer>
);
