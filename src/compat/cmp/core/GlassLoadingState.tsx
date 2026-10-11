/* REQ-CMP-131 compat: GlassLoadingState (4.x) -> LoadingState (5.0).
   warnDeprecated('DEP-C0250') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LoadingState } from '../../../components/state-view';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0250';

export function GlassLoadingState(props: React.ComponentProps<typeof LoadingState>) {
  warnDeprecated(DEP);
  return wrap('GlassLoadingState', <LoadingState {...props} />);
}
