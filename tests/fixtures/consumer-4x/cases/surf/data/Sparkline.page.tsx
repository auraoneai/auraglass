// @ts-nocheck — frozen 4.x consumer usage (codemod input).
// REQ-SURF-15: the Sparkline family page (GlassSparkline → aura-glass/data
// Sparkline). Split from the former Stats.page.tsx.
import { GlassSparkline } from 'aura-glass';

export function TrendPage() {
  return <GlassSparkline data={[1, 4, 2, 8, 5]} stroke="#22c55e" aria-label="Weekly signups" />;
}
