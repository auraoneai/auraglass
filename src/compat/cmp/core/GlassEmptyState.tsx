/* REQ-CMP-131 compat: GlassEmptyState (4.x) -> EmptyState (5.0).
   warnDeprecated('DEP-C0248') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { EmptyState } from '../../../components/state-view';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0248';

export function GlassEmptyState(props: React.ComponentProps<typeof EmptyState>) {
  warnDeprecated(DEP);
  return wrap('GlassEmptyState', <EmptyState {...props} />);
}
