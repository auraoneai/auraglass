/* CMP-117 compat: CircularProgress (4.x) -> Progress appearance="ring" (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Progress } from '../../../components/progress/Progress.client';
import type { ProgressProps } from '../../../components/progress/Progress.client';

const DEP = 'DEP-C0230';

export type CircularProgressProps = Omit<ProgressProps, 'appearance'>;

export function CircularProgress(props: CircularProgressProps) {
  warnDeprecated(DEP);
  return <Progress appearance="ring" {...props} />;
}
