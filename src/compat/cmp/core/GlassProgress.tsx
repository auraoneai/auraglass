/* REQ-CMP-131 compat: GlassProgress (4.x) -> Progress (5.0).
   warnDeprecated('DEP-C0242') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Progress } from '../../../components/progress';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0242';

export function GlassProgress(props: React.ComponentProps<typeof Progress>) {
  warnDeprecated(DEP);
  return wrap('GlassProgress', <Progress {...props} />);
}
