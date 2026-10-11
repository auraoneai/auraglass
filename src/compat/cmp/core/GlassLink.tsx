/* CMP-131 compat: GlassLink (4.x) -> Link (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Link } from '../../../components/link';
import { __compatWrap as wrap } from './_shared';

// No CMP DEP id yet: the row lands via #313 (4.x) + REQ-FIN-13 sync; re-point then.
const DEP = 'GlassLink';

export function GlassLink(props: React.ComponentProps<typeof Link>) {
  warnDeprecated(DEP);
  return wrap('GlassLink', <Link {...props} />);
}
