/* REQ-CMP-131 compat: GlassSkeleton (4.x) -> Skeleton (5.0).
   warnDeprecated('DEP-C0244') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Skeleton } from '../../../components/skeleton';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0244';

export function GlassSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  warnDeprecated(DEP);
  return wrap('GlassSkeleton', <Skeleton {...props} />);
}
