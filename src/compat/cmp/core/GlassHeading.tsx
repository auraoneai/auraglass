/* CMP-131 compat: GlassHeading (4.x) -> Heading (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Heading } from '../../../components/heading';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassHeading';

export function GlassHeading(props: React.ComponentProps<typeof Heading>) {
  warnDeprecated(DEP);
  return wrap('GlassHeading', <Heading {...props} />);
}
