/* REQ-CMP-131 compat: GlassStack (4.x) -> Stack (5.0).
   warnDeprecated('DEP-C0267') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Stack } from '../../../components/stack';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0267';

export function GlassStack(props: React.ComponentProps<typeof Stack>) {
  warnDeprecated(DEP);
  return wrap('GlassStack', <Stack {...props} />);
}
