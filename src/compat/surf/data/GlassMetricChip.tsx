/* GlassMetricChip — 4.x compat adapter (REQ-SURF-88 / REQ-SURF-13,
   DEP-S0213) → static Chip. label + value (+ delta, icon) render as the chip
   content; intent default → neutral, success/warning/danger pass through.
   The 4.x value aria-label ("{value}, {intent}") is kept. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Chip } from '../../../data/chip';

export interface GlassMetricChipProps {
  label: string;
  value: string | number;
  delta?: string;
  intent?: 'default' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * 4.x `GlassMetricChip` compat adapter (DEP-S0213).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Chip from aura-glass/data}.
 */
export function GlassMetricChip({ label = 'Metric', value = '--', delta, intent = 'default', icon, className }: GlassMetricChipProps) {
  warnDeprecated('DEP-S0213');
  const intentLabel = intent === 'default' ? undefined : intent;
  return (
    <Chip label={label} intent={intent === 'default' ? 'neutral' : intent} {...(className ? { className } : {})}>
      {icon !== undefined && icon !== null ? <span aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
      <strong aria-label={intentLabel ? `${value}, ${intentLabel}` : undefined}>{value}</strong>
      {delta ? <span>{delta}</span> : null}
    </Chip>
  );
}
