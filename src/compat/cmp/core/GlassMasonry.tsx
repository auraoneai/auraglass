/* CMP-131 compat: GlassMasonry (4.x) -> Grid (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0271';

export function GlassMasonry(props: React.ComponentProps<typeof Grid>) {
  warnDeprecated(DEP);
  return wrap('GlassMasonry', <Grid {...props} />);
}
