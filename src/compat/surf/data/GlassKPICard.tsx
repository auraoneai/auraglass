'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

export function GlassKPICard(props: GlassStatCardProps) {
  warnDeprecated('GlassKPICard');
  return <GlassStatCard {...props} />;
}
