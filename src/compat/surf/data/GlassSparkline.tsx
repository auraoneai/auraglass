'use client';
import { warnDeprecated } from '../../../internal';
import { Sparkline } from '../../../data/sparkline/Sparkline';
import type { SparklineProps } from '../../../data/sparkline/Sparkline';

export type GlassSparklineProps = {
  values?: number[];
  data?: number[];
  color?: string;
  label?: string;
} & Omit<SparklineProps, 'data' | 'label'>;

export function GlassSparkline(props: GlassSparklineProps) {
  warnDeprecated('GlassSparkline');
  const { values, data, color, label, ...rest } = props;
  return <Sparkline {...rest} data={data ?? values ?? []} label={label ?? 'Sparkline'} intent={color !== undefined ? 'neutral' : rest.intent} />;
}
