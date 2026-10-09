/* CMP-114 compat: GlassStatusDot (4.x) -> Badge dot (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';
import type { BadgeProps } from '../../../components/badge/Badge';

const DEP = 'DEP-C0228';

export type GlassStatusDotProps = Omit<BadgeProps, 'dot'>;

export function GlassStatusDot(props: GlassStatusDotProps) {
  warnDeprecated(DEP);
  return <Badge dot {...props} />;
}
