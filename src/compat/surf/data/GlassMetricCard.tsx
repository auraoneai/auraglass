'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

export function GlassMetricCard(props: GlassStatCardProps) {
  warnDeprecated('GlassMetricCard');
  return <GlassStatCard {...props} />;
}
