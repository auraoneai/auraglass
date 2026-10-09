/* CMP-131 compat: CircularProgress (4.x) -> ProgressRing (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ProgressRing } from '../../../components/progress';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0240';

export function CircularProgress(props: React.ComponentProps<typeof ProgressRing>) {
  warnDeprecated(DEP);
  return wrap('CircularProgress', <ProgressRing {...props} />);
}
