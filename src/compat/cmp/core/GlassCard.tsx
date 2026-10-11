/* CMP-131 compat: GlassCard (4.x) -> Card (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Card } from '../../../components/card';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0231';

export function GlassCard(props: React.ComponentProps<typeof Card>) {
  warnDeprecated(DEP);
  return wrap('GlassCard', <Card {...props} />);
}
