/* REQ-CMP-131 compat: GlassSpotlight (4.x) -> Tour.Root (5.0).
   warnDeprecated('DEP-C0264') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tour } from '../../../components/tour';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0264';

export function GlassSpotlight(props: React.ComponentProps<typeof Tour.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassSpotlight', <Tour.Root {...props} />);
}
