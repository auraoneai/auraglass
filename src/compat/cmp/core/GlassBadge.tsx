/* CMP-131 compat: GlassBadge (4.x) -> Badge (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0247';

export function GlassBadge(props: React.ComponentProps<typeof Badge>) {
  warnDeprecated(DEP);
  return wrap('GlassBadge', <Badge {...props} />);
}
