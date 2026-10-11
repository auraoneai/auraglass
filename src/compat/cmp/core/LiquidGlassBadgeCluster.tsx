/* CMP-131 compat: LiquidGlassBadgeCluster (4.x) -> Badge (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0236';

export function LiquidGlassBadgeCluster(props: React.ComponentProps<typeof Badge>) {
  warnDeprecated(DEP);
  return wrap('LiquidGlassBadgeCluster', <Badge {...props} />);
}
