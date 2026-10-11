/* CMP-131 compat: GlassProgress (4.x) -> Progress (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Progress } from '../../../components/progress';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0242';

export function GlassProgress(props: React.ComponentProps<typeof Progress>) {
  warnDeprecated(DEP);
  return wrap('GlassProgress', <Progress {...props} />);
}
