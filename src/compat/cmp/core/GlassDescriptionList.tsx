/* CMP-131 compat: GlassDescriptionList (4.x) -> DescriptionList (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DescriptionList } from '../../../components/description-list';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0257';

export function GlassDescriptionList(props: React.ComponentProps<typeof DescriptionList>) {
  warnDeprecated(DEP);
  return wrap('GlassDescriptionList', <DescriptionList {...props} />);
}
