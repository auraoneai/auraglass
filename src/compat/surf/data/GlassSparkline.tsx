'use client';
import { warnDeprecated } from '../../../internal';
import { Sparkline } from '../../../data/sparkline/Sparkline';
import type { SparklineProps } from '../../../data/sparkline/Sparkline';

/** @deprecated GlassSparklineProps DEP-S0639 since 4.2.0, removed in 6.0.0. */
export type GlassSparklineProps = {
  values?: number[];
  data?: number[];
  color?: string;
  label?: string;
} & Omit<SparklineProps, 'data' | 'label'>;

export function GlassSparkline(props: GlassSparklineProps) {
  warnDeprecated('DEP-S0639');
  const { values, data, color, label, ...rest } = props;
  return <Sparkline {...rest} data={data ?? values ?? []} label={label ?? 'Sparkline'} intent={color !== undefined ? 'neutral' : rest.intent} />;
}
