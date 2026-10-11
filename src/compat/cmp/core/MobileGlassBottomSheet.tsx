/* CMP-131 compat: MobileGlassBottomSheet (4.x) -> Sheet.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0132';

export function MobileGlassBottomSheet(props: React.ComponentProps<typeof Sheet.Root>) {
  warnDeprecated(DEP);
  return wrap('MobileGlassBottomSheet', <Sheet.Root {...props} />);
}
