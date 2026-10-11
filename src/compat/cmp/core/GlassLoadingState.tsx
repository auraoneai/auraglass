/* CMP-131 compat: GlassLoadingState (4.x) -> LoadingState (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LoadingState } from '../../../components/state-view';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0250';

export function GlassLoadingState(props: React.ComponentProps<typeof LoadingState>) {
  warnDeprecated(DEP);
  return wrap('GlassLoadingState', <LoadingState {...props} />);
}
