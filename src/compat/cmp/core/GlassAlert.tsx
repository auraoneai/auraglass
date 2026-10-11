/* REQ-CMP-131 compat: GlassAlert (4.x) -> Alert (5.0).
   warnDeprecated('DEP-C0241') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Alert } from '../../../components/alert';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0241';

export function GlassAlert(props: React.ComponentProps<typeof Alert>) {
  warnDeprecated(DEP);
  return wrap('GlassAlert', <Alert {...props} />);
}
