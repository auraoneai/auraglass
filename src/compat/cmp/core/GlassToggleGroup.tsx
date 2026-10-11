/* CMP-131 compat: GlassToggleGroup (4.x) -> ToggleGroup.Root (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ToggleGroup } from '../../../components/toggle-group';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassToggleGroup';

export function GlassToggleGroup(props: React.ComponentProps<typeof ToggleGroup.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassToggleGroup', <ToggleGroup.Root {...props} />);
}
