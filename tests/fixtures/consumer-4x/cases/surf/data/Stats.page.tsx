// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassStatCard, GlassKPICard, GlassSparkline } from 'aura-glass';

export function MetricsPage() {
  return (
    <section>
      <GlassStatCard title="Revenue" value={128430} trend="up" delta={0.1} />
      <GlassKPICard title="Churn" value={0.021} />
      <GlassSparkline values={[1, 4, 2, 8, 5]} color="#22c55e" />
    </section>
  );
}
