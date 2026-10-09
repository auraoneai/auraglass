/* CMP-114 compat: LiquidGlassBadgeCluster (4.x) -> Badge (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';
import type { BadgeProps } from '../../../components/badge/Badge';

const DEP = 'DEP-C0227';

export type LiquidGlassBadgeClusterProps = BadgeProps;

export function LiquidGlassBadgeCluster(props: LiquidGlassBadgeClusterProps) {
  warnDeprecated(DEP);
  return <Badge {...props} />;
}
