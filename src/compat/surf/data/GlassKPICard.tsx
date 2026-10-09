'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

/** @deprecated GlassKPICard DEP-S0635 since 4.2.0, removed in 6.0.0. */
export function GlassKPICard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0635');
  return <GlassStatCard {...props} />;
}
