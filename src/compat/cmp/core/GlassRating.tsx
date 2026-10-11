/* REQ-CMP-131 compat: GlassRating (4.x) -> Rating (5.0).
   warnDeprecated('DEP-C0253') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Rating } from '../../../components/rating';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0253';

export function GlassRating(props: React.ComponentProps<typeof Rating>) {
  warnDeprecated(DEP);
  return wrap('GlassRating', <Rating {...props} />);
}
