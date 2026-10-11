/* CMP-131 compat: GlassDescriptionList (4.x) -> DescriptionList (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DescriptionList } from '../../../components/description-list';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassDescriptionList';

export function GlassDescriptionList(props: React.ComponentProps<typeof DescriptionList>) {
  warnDeprecated(DEP);
  return wrap('GlassDescriptionList', <DescriptionList {...props} />);
}
