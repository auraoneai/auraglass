/* CMP-131 compat: GlassActivityFeed (4.x) -> ActivityFeed (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ActivityFeed } from '../../../components/timeline/ActivityFeed';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0243';

export function GlassActivityFeed(props: React.ComponentProps<typeof ActivityFeed>) {
  warnDeprecated(DEP);
  return wrap('GlassActivityFeed', <ActivityFeed {...props} />);
}
