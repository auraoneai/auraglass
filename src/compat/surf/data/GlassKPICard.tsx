'use client';
import { warnDeprecated } from '../../../internal';
import { GlassStatCard, type GlassStatCardProps } from './GlassStatCard';

export function GlassKPICard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0635');
  return <GlassStatCard {...props} />;
}
