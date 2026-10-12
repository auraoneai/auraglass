// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassChart, GlassDataChart, GlassChartContainer, KpiChart } from 'aura-glass';

export const Revenue = ({ data }) => (
  <GlassChartContainer>
    <GlassChart data={data} />
    <GlassDataChart data={data} />
    <KpiChart data={data} />
  </GlassChartContainer>
);
