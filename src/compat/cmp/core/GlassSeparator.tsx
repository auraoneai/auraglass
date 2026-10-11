/* CMP-131 compat: GlassSeparator (4.x) -> Separator (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Separator } from '../../../components/separator';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0246';

export function GlassSeparator(props: React.ComponentProps<typeof Separator>) {
  warnDeprecated(DEP);
  return wrap('GlassSeparator', <Separator {...props} />);
}
