'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

export function GlassMetricCard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0648');
  return <GlassStatCard {...props} />;
}
