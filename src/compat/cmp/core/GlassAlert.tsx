/* CMP-131 compat: GlassAlert (4.x) -> Alert (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Alert } from '../../../components/alert';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0241';

export function GlassAlert(props: React.ComponentProps<typeof Alert>) {
  warnDeprecated(DEP);
  return wrap('GlassAlert', <Alert {...props} />);
}
