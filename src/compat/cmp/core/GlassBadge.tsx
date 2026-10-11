/* REQ-CMP-131 compat: GlassBadge (4.x) -> Badge (5.0).
   warnDeprecated('DEP-C0235') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0235';

export function GlassBadge(props: React.ComponentProps<typeof Badge>) {
  warnDeprecated(DEP);
  return wrap('GlassBadge', <Badge {...props} />);
}
