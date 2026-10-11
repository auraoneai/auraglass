/* CMP-131 compat: GlassNumberInput (4.x) -> NumberField (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { NumberField } from '../../../components/number-field';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassNumberInput';

export function GlassNumberInput(props: React.ComponentProps<typeof NumberField>) {
  warnDeprecated(DEP);
  return wrap('GlassNumberInput', <NumberField {...props} />);
}
