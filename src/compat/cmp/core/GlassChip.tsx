/* CMP-131 compat: GlassChip (4.x) -> Chip (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Chip } from '../../../components/chip';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0251';

export function GlassChip(props: React.ComponentProps<typeof Chip>) {
  warnDeprecated(DEP);
  return wrap('GlassChip', <Chip {...props} />);
}
