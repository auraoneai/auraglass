/* CMP-131 compat: GlassSkeleton (4.x) -> Skeleton (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Skeleton } from '../../../components/skeleton';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0244';

export function GlassSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  warnDeprecated(DEP);
  return wrap('GlassSkeleton', <Skeleton {...props} />);
}
