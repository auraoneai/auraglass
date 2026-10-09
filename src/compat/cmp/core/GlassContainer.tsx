/* CMP-131 compat: GlassContainer (4.x) -> Container (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Container } from '../../../components/container';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0256';

export function GlassContainer(props: React.ComponentProps<typeof Container>) {
  warnDeprecated(DEP);
  return wrap('GlassContainer', <Container {...props} />);
}
