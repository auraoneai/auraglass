/* CMP-131 compat: DisplayText (4.x) -> Heading (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Heading } from '../../../components/heading';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0266';

export function DisplayText(props: React.ComponentProps<typeof Heading>) {
  warnDeprecated(DEP);
  return wrap('DisplayText', <Heading {...props} />);
}
