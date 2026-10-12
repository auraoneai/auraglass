/* CMP-114 compat: GlassStatusDot (4.x) -> Badge dot (5.0), DEP-C0237.
   warnDeprecated fires at call time, once per page load per symbol; never
   throws. Mapping: status ok|warn|error|busy|offline -> Badge intent
   success|warning|danger|info|neutral; size (px) -> inline/block size of the
   dot; className passes through. `label` is a 5.0 addition (VisuallyHidden
   name for the dot); 4.x had none. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';
import type { BadgeProps } from '../../../components/badge/Badge';

const DEP = 'DEP-C0237';

export type GlassStatusDotStatus = 'ok' | 'warn' | 'error' | 'busy' | 'offline';

const STATUS_INTENT: Record<GlassStatusDotStatus, NonNullable<BadgeProps['intent']>> = {
  ok: 'success',
  warn: 'warning',
  error: 'danger',
  busy: 'info',
  offline: 'neutral',
};

export interface GlassStatusDotProps {
  status?: GlassStatusDotStatus | undefined;
  /** Dot diameter in px (4.x default 8). */
  size?: number | undefined;
  className?: string | undefined;
  label?: string | undefined;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Badge}. */
export function GlassStatusDot({ status = 'ok', size, className, label }: GlassStatusDotProps) {
  warnDeprecated(DEP);
  return (
    <Badge
      dot
      intent={STATUS_INTENT[status] ?? 'neutral'}
      {...(className !== undefined ? { className } : {})}
      {...(label !== undefined ? { label } : {})}
      {...(size !== undefined ? { style: { inlineSize: size, blockSize: size } } : {})}
    />
  );
}
