/* REQ-CMP-131 compat: GlassSeparator (4.x) -> Separator (5.0).
   warnDeprecated('DEP-C0246') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Separator } from '../../../components/separator';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0246';

export function GlassSeparator(props: React.ComponentProps<typeof Separator>) {
  warnDeprecated(DEP);
  return wrap('GlassSeparator', <Separator {...props} />);
}
