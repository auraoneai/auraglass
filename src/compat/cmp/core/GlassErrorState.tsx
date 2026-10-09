/* CMP-131 compat: GlassErrorState (4.x) -> ErrorState (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ErrorState } from '../../../components/state-view';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0261';

export function GlassErrorState(props: React.ComponentProps<typeof ErrorState>) {
  warnDeprecated(DEP);
  return wrap('GlassErrorState', <ErrorState {...props} />);
}
