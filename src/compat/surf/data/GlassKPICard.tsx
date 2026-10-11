/* GlassKPICard — 4.x compat adapter (REQ-SURF-13, DEP-S0211) → StatCard.
   trend 'up'|'down'|'neutral' + trendPercentage → delta; mapping in
   ./_stat.tsx. */
import { warnDeprecated } from '../../../internal';
import { renderLegacyStat, type LegacyStatProps } from './_stat';

export type GlassKPICardProps = LegacyStatProps;

/**
 * 4.x `GlassKPICard` compat adapter (DEP-S0211).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link StatCard from aura-glass/data}.
 */
export function GlassKPICard(props: GlassKPICardProps) {
  warnDeprecated('DEP-S0211');
  return renderLegacyStat(props);
}
