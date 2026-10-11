/* REQ-CMP-131 compat: GlassCoachmarks (4.x) -> Tour.Root (5.0).
   warnDeprecated('DEP-C0263') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tour } from '../../../components/tour';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0263';

export function GlassCoachmarks(props: React.ComponentProps<typeof Tour.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassCoachmarks', <Tour.Root {...props} />);
}
