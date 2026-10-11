/* GlassStatCard — 4.x compat adapter (REQ-SURF-13, DEP-S0210) → StatCard.
   Mapping in ./_stat.tsx (title → label, value + unit, description,
   trend → delta, sparklineData → sparkline, loading). */
import { warnDeprecated } from '../../../internal';
import { renderLegacyStat, type LegacyStatProps } from './_stat';

export type GlassStatCardProps = LegacyStatProps;

/**
 * 4.x `GlassStatCard` compat adapter (DEP-S0210).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link StatCard from aura-glass/data}.
 */
export function GlassStatCard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0210');
  return renderLegacyStat(props);
}
