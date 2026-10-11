/* CMP-131 compat: GlassSpotlight (4.x) -> Tour.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tour } from '../../../components/tour';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0264';

export function GlassSpotlight(props: React.ComponentProps<typeof Tour.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassSpotlight', <Tour.Root {...props} />);
}
