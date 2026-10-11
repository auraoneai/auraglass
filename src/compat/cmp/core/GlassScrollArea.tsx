/* CMP-131 compat: GlassScrollArea (4.x) -> ScrollArea.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ScrollArea } from '../../../components/scroll-area';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0252';

export function GlassScrollArea(props: React.ComponentProps<typeof ScrollArea.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassScrollArea', <ScrollArea.Root {...props} />);
}
