/* CMP-131 compat: GlassTimeline (4.x) -> Timeline (5.0).
   warnDeprecated once per symbol per page load; props pass through unmolested. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Timeline } from '../../../components/timeline/Timeline';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0289';

export function GlassTimeline(props: React.ComponentProps<typeof Timeline>) {
  warnDeprecated(DEP);
  return wrap('GlassTimeline', <Timeline {...props} />);
}
