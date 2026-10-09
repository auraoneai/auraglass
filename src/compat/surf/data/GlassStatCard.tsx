'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { StatCard } from '../../../data/stat-card/StatCard';
import type { StatCardProps } from '../../../data/stat-card/StatCard';

export type GlassStatCardProps = {
  title?: string;
  label?: string;
  value?: number | string;
  suffix?: string;
  delta?: number;
  trend?: 'up' | 'down' | 'flat';
  format?: (v: number) => string;
} & Omit<StatCardProps, 'label' | 'value' | 'delta' | 'trendDirection'>;

export function GlassStatCard(props: GlassStatCardProps) {
  warnDeprecated('DEP-S0645');
  const { title, label, value = 0, suffix, delta, trend, format, ...rest } = props;
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value)) || 0;
  const shown = suffix !== undefined ? <>{num}{suffix}</> : format && typeof value === 'number' ? value : num;
  return (
    <StatCard
      {...rest}
      label={label ?? title ?? ''}
      value={shown}
      delta={delta}
      {...(trend !== undefined ? { trendDirection: 'up-is-good' as const } : {})}
    />
  );
}
