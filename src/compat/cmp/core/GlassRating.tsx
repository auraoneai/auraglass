/* CMP-131 compat: GlassRating (4.x) -> Rating (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Rating } from '../../../components/rating';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0279';

export function GlassRating(props: React.ComponentProps<typeof Rating>) {
  warnDeprecated(DEP);
  return wrap('GlassRating', <Rating {...props} />);
}
