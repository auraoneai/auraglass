/* CMP-131 compat: GlassStack (4.x) -> Stack (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Stack } from '../../../components/stack';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0267';

export function GlassStack(props: React.ComponentProps<typeof Stack>) {
  warnDeprecated(DEP);
  return wrap('GlassStack', <Stack {...props} />);
}
