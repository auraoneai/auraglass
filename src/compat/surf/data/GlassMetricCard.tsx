/* GlassMetricCard — 4.x compat adapter (REQ-SURF-13, DEP-S0212) →
   StatCard. trend {value,label,direction} → delta + deltaLabel; mapping in
   ./_stat.tsx. */
import { warnDeprecated } from '../../../internal';
import { renderLegacyStat, type LegacyStatProps } from './_stat';

export type GlassMetricCardProps = LegacyStatProps;

/**
 * 4.x `GlassMetricCard` compat adapter (DEP-S0212).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link StatCard from aura-glass/data}.
 */
export function GlassMetricCard(props: GlassMetricCardProps) {
  warnDeprecated('DEP-S0212');
  return renderLegacyStat(props);
}
