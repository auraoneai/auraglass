/* REQ-CMP-131 compat: GlassContainer (4.x) -> Container (5.0).
   warnDeprecated('DEP-C0273') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Container } from '../../../components/container';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0273';

export function GlassContainer(props: React.ComponentProps<typeof Container>) {
  warnDeprecated(DEP);
  return wrap('GlassContainer', <Container {...props} />);
}
