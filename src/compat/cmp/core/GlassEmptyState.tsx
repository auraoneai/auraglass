/* CMP-131 compat: GlassEmptyState (4.x) -> EmptyState (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { EmptyState } from '../../../components/state-view';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0260';

export function GlassEmptyState(props: React.ComponentProps<typeof EmptyState>) {
  warnDeprecated(DEP);
  return wrap('GlassEmptyState', <EmptyState {...props} />);
}
