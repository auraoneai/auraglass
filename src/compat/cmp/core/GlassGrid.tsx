/* CMP-131 compat: GlassGrid (4.x) -> Grid (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0265';

export function GlassGrid(props: React.ComponentProps<typeof Grid>) {
  warnDeprecated(DEP);
  return wrap('GlassGrid', <Grid {...props} />);
}
