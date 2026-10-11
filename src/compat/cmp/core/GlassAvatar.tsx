/* REQ-CMP-131 compat: GlassAvatar (4.x) -> Avatar.Root (5.0).
   warnDeprecated('DEP-C0239') fires at call time, once per page load, dev only.
   The 5.0 meta lists no prop changes for this name, so props pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Avatar } from '../../../components/avatar';
import { __compatWrap as wrap } from '../overlays/_shared';

const DEP = 'DEP-C0239';

export function GlassAvatar(props: React.ComponentProps<typeof Avatar.Root>) {
  warnDeprecated(DEP);
  return wrap('GlassAvatar', <Avatar.Root {...props} />);
}
