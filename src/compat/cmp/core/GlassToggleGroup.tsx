/* CMP-131 compat: GlassToggleGroup (4.x) -> ToggleGroup.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ToggleGroup } from '../../../components/toggle-group';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0290';

export function GlassToggleGroup(props: React.ComponentProps<typeof ToggleGroup.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassToggleGroup', <ToggleGroup.Root {...props} />);
}
