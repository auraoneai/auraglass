// @ts-nocheck — frozen 4.x consumer usage (codemod input).
// REQ-SURF-15: the StatCard family page (GlassStatCard + GlassKPICard, both
// absorbed into aura-glass/data StatCard). Split from the former
// Stats.page.tsx so the Sparkline family has its own page (Sparkline.page.tsx).
import { GlassStatCard, GlassKPICard } from 'aura-glass';

export function MetricsPage() {
  return (
    <section>
      <GlassStatCard title="Revenue" value={128430} trend={{ value: 10, label: 'vs last month', direction: 'up' }} />
      <GlassKPICard title="Churn" value={0.021} trend="down" trendPercentage={4} />
    </section>
  );
}
