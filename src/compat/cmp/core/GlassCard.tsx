/* REQ-CMP-131 compat: GlassCard (4.x) -> Card (5.0).
   warnDeprecated('DEP-C0231') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Card } from '../../../components/card';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0231';

export function GlassCard(props: React.ComponentProps<typeof Card>) {
  warnDeprecated(DEP);
  return wrap('GlassCard', <Card {...props} />);
}
