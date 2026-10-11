/* REQ-CMP-131 compat: GlassErrorState (4.x) -> ErrorState (5.0).
   warnDeprecated('DEP-C0249') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ErrorState } from '../../../components/state-view';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0249';

export function GlassErrorState(props: React.ComponentProps<typeof ErrorState>) {
  warnDeprecated(DEP);
  return wrap('GlassErrorState', <ErrorState {...props} />);
}
