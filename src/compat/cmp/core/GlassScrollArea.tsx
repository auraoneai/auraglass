/* REQ-CMP-131 compat: GlassScrollArea (4.x) -> ScrollArea.Root (5.0).
   warnDeprecated('DEP-C0252') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ScrollArea } from '../../../components/scroll-area';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0252';

export function GlassScrollArea(props: React.ComponentProps<typeof ScrollArea.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassScrollArea', <ScrollArea.Root {...props} />);
}
