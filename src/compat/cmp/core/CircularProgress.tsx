/* CMP-131 compat: CircularProgress (4.x) -> Progress appearance="ring" (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Progress } from '../../../components/progress';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0243';

export function CircularProgress(props: React.ComponentProps<typeof Progress>) {
  warnDeprecated(DEP);
  return wrap('CircularProgress', <Progress appearance="ring" {...props} />);
}
