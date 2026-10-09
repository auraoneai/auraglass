/* CMP-131 compat: GlassPositioner (4.x) -> Popover.Positioner (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Popover } from '../../../components/popover';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0296';

export function GlassPositioner(props: React.ComponentProps<typeof Popover.Positioner>) {
  warnDeprecated(DEP);
  return wrap('GlassPositioner', <Popover.Positioner {...props} />);
}
