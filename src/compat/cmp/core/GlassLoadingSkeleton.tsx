/* CMP-131 compat: GlassLoadingSkeleton (4.x) -> Skeleton (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Skeleton } from '../../../components/skeleton';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0271';

export function GlassLoadingSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  warnDeprecated(DEP);
  return wrap('GlassLoadingSkeleton', <Skeleton {...props} />);
}
