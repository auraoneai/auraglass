/* CMP-114 compat: GlassConnectionStatus (4.x) -> Badge (5.0).
   warnDeprecated fires at call time, once per page load per symbol.
   status online|offline|degraded|idle maps onto Badge intents. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';
import type { BadgeProps } from '../../../components/badge/Badge';

const DEP = 'DEP-C0238';

const STATUS_INTENT: Record<string, NonNullable<BadgeProps['intent']>> = {
  online: 'success',
  degraded: 'warning',
  offline: 'danger',
  idle: 'neutral',
};

export interface GlassConnectionStatusProps extends Omit<BadgeProps, 'intent'> {
  status?: 'online' | 'offline' | 'degraded' | 'idle' | undefined;
}

export function GlassConnectionStatus({ status, ...rest }: GlassConnectionStatusProps) {
  warnDeprecated(DEP);
  return <Badge intent={STATUS_INTENT[status ?? 'idle'] ?? 'neutral'} {...rest} />;
}
