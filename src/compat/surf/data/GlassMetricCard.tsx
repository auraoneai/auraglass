'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

/** @deprecated GlassMetricCard DEP-S0648 since 4.2.0, removed in 6.0.0. */
export function GlassMetricCard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0648');
  return <GlassStatCard {...props} />;
}
